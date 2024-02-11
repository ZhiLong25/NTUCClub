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

  useEffect(() => {

    fetchCartItems();
  }, []);

  const fetchCartItems = () => {
    setIsLoading(true); 
    http.get('/Cart/getcart')
      .then(response => {
        setCartItems(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching cart items:', error);
        toast.error('Failed to fetch cart items');
        setIsLoading(false); 
      });
  };
  

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
    if (cartItems.length === 0) {
      return 0; // Return 0 if cart is empty
    }
  
    const subtotal = cartItems.reduce((total, item) => {
      if (item.price && item.quantity) {
        return total + item.price * item.quantity;
      } else {
        return total;
      }
    }, 0);
  
    return subtotal - subtotal * discount;
  };

  const handlePay = () => {
    navigate('/#', { state: { cartItems, discount }});
  };

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
              {/* Render cart items */}
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
      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
}

export default Cart;