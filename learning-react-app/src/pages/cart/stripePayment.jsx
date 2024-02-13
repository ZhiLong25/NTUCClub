import React, { useState,useContext,useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import http from '../../http';
import UserContext from '../../contexts/UserContext';
import { ToastContainer, toast } from "react-toastify";


const CheckoutForm = () => {
    const { user } = useContext(UserContext);
    const [clientSecret, setClientSecret] = useState();

  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => {

    async function getClientSecret() {
        console.log("ran")
      try {
        const price = localStorage.getItem("price");
        console.log(user._id);
        http.post(`/payment/create-payment-intent/?price=${price}`,user._id).then((res)=>{
            setClientSecret(res.data.clientSecret)
        })
        console.log(res.data.clientSecret)
      } catch (error) {
        console.error('Error fetching client secret:', error);
      }
    }
  
    // Call the async function inside useEffect
    getClientSecret();
  }, []);
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (elements == null) {
      return;
    }

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      // Show error to your customer
      setErrorMessage(submitError.message);
      return;
    }

    
     
    // const {client_secret: clientSecret} = await res.json();
    console.log(clientSecret)
    const { error } = await stripe.confirmPayment({
      // `Elements` instance that was used to create the Payment Element
      elements,
      clientSecret,
      confirmParams: {
        return_url: 'http://localhost:3000/',
      },
    });

    if (error) {
        console.error('Error confirming payment:', error);
        setErrorMessage(error.message || 'An error occurred while confirming the payment');
      } else {
      // Your customer will be redirected to your `return_url`.
      // For some payment methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
      toast.success("Success")
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe || !elements} style={{marginTop:"5%",width:"100%",height:"3dvw",background:"green"}}>
        Pay
      </button>
      {/* Show error message to your customers */}
      {errorMessage && <div>{errorMessage}</div>}
      <ToastContainer/>
    </form>
  );
};

const stripePromise = loadStripe('pk_test_51Oj1eiAILpJG8YMg7WAZPRA1AXE6d9KoXdI1chIpllbNt8HlcQjSpiHRuZwcmIVoNeYODtIQzEcDd250OW5glzZY006SfSTAQV');

const options = {
  mode: 'payment',
  amount: 1099,
  currency: 'sgd',
  // Fully customizable with appearance API.
  appearance: {
    /*...*/
  },
};

const StripePayment = () => (
  <Elements stripe={stripePromise} options={options}>
    <CheckoutForm />
  </Elements>
);

export default StripePayment;