import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import http from '../../http';
import { useNavigate } from 'react-router-dom';
function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [removeItemId, setRemoveItemId] = useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [editableItemId, setEditableItemId] = useState(null);
  const [editableQuantity, setEditableQuantity] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const navigate = useNavigate();
  const [user, setUser] = useState('');



  useEffect(() => {

    http.get(`/user/auth`)
      .then((res) => {
        setUser(res.data.user);
        console.log(res.data.user);

        http.get(`/Cart/getcart/${res.data.user.email}`)
          .then(response => {
            setCartItems(response.data);
            console.log(response.data)
            if (response.data.length != 0 && response.data.length != null) {
              setIsLoading(false)
            }

          });
      });




  }, []);




  const handleAddToCart = (item) => {
    http.post('/Cart/addtocart', item)
      .then(response => {
        toast.success('Item added to cart');
        fetchCartItems();
      })
      .catch(error => {
        console.error('Error adding item to cart:', error);
        toast.error('Failed to add item to cart');
      });
  };

  const handleRemoveItem = (id) => {
    setRemoveItemId(id);
    setOpenConfirmation(true);
  };

  const removeItemConfirmed = () => {
    http.delete(`/Cart/${removeItemId}`)
      .then(response => {
        toast.success('Item removed from cart');
        fetchCartItems();
      })
      .catch(error => {
        console.error('Error removing item from cart:', error);
        toast.error('Failed to remove item from cart');
      });
    setOpenConfirmation(false);
  };

  const getTotalPrice = () => {
    let total = 0
    if (cartItems.length === 0) {
      return 0; // Return 0 if cart is empty
    }

    // const subtotal = cartItems.reduce((total, item) => {
    //   if (item.price && item.quantity) {
    //     return total + item.price * item.quantity;
    //   } else {
    //     return total;
    //   }
    // }, 0);

    // return subtotal - subtotal * discount;

    for (let i = 0; i < cartItems.length; i++) {
      if (user.userType == "UserMember") {
        if (cartItems[i].memPrice != null)
          total += cartItems[i].service.memPrice
        else{
          total += cartItems[i].service.price
        }
      }
      else{
        total+=cartItems[i].service.price
      }
    }
    return total
  };

  const handlePay = () => {
    http.put(`User/ChangeUsertype/${user.id}`).then((res)=>{
      toast.success("Transaction successful")
      setTimeout(() => {
        navigate('/#', { state: { cartItems, discount } })
      }, 2000);
         
    })}
     


  return (
    <Box m={2}>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>
      {isLoading ? ( // Display loading message while data is being fetched
        <Typography>Loading...</Typography>
      ) : cartItems.length === 0 ? (
        <Box textAlign="center">
          <Typography variant="subtitle1">Your cart is empty.</Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/productspage')}>
            Shop Now
          </Button>
        </Box>
      ) : (
        <>
          {cartItems.map((item) => (
            <Card key={item.id} variant="outlined" style={{ marginBottom: '16px' }}>
              <Typography variant="h6">Name: {item.service.name}</Typography>
            </Card>
          ))}
          <Box mt={2}>
            <Typography variant="h6">Total: ${getTotalPrice()}</Typography>
          </Box>
          <Box mt={4} textAlign="center">
            <Button variant="contained" color="primary" onClick={handlePay}>
              Pay
            </Button>
          </Box>
        </>
      )}
      <Dialog open={openConfirmation} onClose={() => setOpenConfirmation(false)}>
        <DialogTitle>Confirm Removal</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to remove this item from the cart?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmation(false)}>Cancel</Button>
          <Button onClick={removeItemConfirmed} color="secondary">Remove</Button>
        </DialogActions>
      </Dialog>
      <ToastContainer/>
    </Box>
  );
          }


export default Cart;