import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const handlePayNow = () => {
    // Simulate payment completion
    // You would integrate your actual payment logic here
    // For demonstration, we'll show the dialog immediately and then simulate payment completion
    setOpenDialog(true);
    setTimeout(() => {
      setOpenDialog(false);
      toast.success('Payment successful!');
      navigate('/cart');
    }, 2000);
  };

  const [openDialog, setOpenDialog] = React.useState(false);

  // Check if state contains cartItems and discount
  if (!state || !state.cartItems || !state.discount) {
    // Redirect to cart page if data is missing
    navigate('/cart');
    return null; // Return null to prevent rendering content before redirection
  }

  const { cartItems, discount } = state;

  // Function to calculate the total price
  const getTotalPrice = () => {
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    return subtotal - subtotal * discount;
  };

  return (
    <Box m={2}>
      <Typography variant="h4" gutterBottom>
        Payment Details
      </Typography>
      <Box>
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>
        <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
          {cartItems.map((item) => (
            <li key={item.id}>
              <Typography>{item.name} - ${item.price * item.quantity}</Typography>
            </li>
          ))}
        </ul>
        <Typography variant="subtitle1">
          Total: ${getTotalPrice()}
        </Typography>
      </Box>
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Payment Information
        </Typography>
        <form>
          <TextField
            label="Card Number"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Expiry Date"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label="CVV"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Name on Card"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" fullWidth onClick={handlePayNow} style={{ marginTop: '16px' }}>
            Pay Now
          </Button>
        </form>
      </Box>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Payment Successful!</DialogTitle>
        <DialogContent>
          <Typography variant="body1">A confirmation email will be sent</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
}

export default Payment;
