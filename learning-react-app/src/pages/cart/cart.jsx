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
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('stripe'); // default to stripe

  useEffect(() => {
    // Fetch cart items and user data
    setIsLoading(true);
    http.get("/user/auth")
      .then((res) => {
        setUser(res.data.user);
        http.get(`/Cart/getcart/${res.data.user.email}`)
          .then(response => {
            setCartItems(response.data);
            setIsLoading(false);
          })
          .catch(error => {
            console.error('Error fetching cart items:', error);
            setIsLoading(false);
          });
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        setIsLoading(false);
      });
  }, []);

  const handleRemoveItem = (id) => {
    setRemoveItemId(id);
    setOpenConfirmation(true);
  };

  const removeItemConfirmed = () => {
    http.delete(`/Cart/removefromcart/${removeItemId}`)
      .then(response => {
        // Remove item from frontend state
        setCartItems(cartItems.filter((item) => item.id !== removeItemId));
        setOpenConfirmation(false);
        toast.success('Item removed from cart');
      })
      .catch(error => {
        console.error('Error removing item from cart:', error);
        toast.error('Failed to remove item from cart');
      });
  };

  const handleApplyVoucher = () => {
    http.get(`Voucher/GetName/${voucherCode}`).then((res)=>{
      setDiscount(0.1); // 10% discount
      toast.success('Voucher applied successfully!');
    }).catch((err)=>{
      toast.error('Invalid voucher code');
    })

  };

  const getTotalPrice = () => {
    if (cartItems.length === 0) {
      return 0; // Return 0 if cart is empty
    }

    const subtotal = cartItems.reduce((total, item) => {
      if (item.service && item.quantity) {
        if (user.UserType=="UserMember"){
        return total + item.service.MemPrice * item.quantity;
        }
        else{
          return total + item.service.price * item.quantity;

        }
      } else {
        return total;
      }
    }, 0);

    return subtotal - subtotal * discount;
  };

  const handlePay = () => {
    // Navigate to the selected payment page with the necessary data
    if (paymentMethod === 'stripe') {
      navigate('/stripePayment', { state: { cartItems, discount } });
    } else {
      navigate('/payment', { state: { cartItems, discount } });
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <Box m={2}>
          <Typography variant="h4" gutterBottom>
            Your Cart
          </Typography>
          {isLoading ? (
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
                  <Box p={2}>
                    <Typography variant="h6">{item.service.name}</Typography>
                    <Typography variant="body1">Quantity: {item.quantity}</Typography>
                    <Typography variant="body1">Price: ${item.service.price}</Typography>
                    <Button variant="outlined" color="secondary" onClick={() => handleRemoveItem(item.id)}>Remove</Button>
                    <Button variant="outlined" color="primary" onClick={() => handleEditQuantity(item.id, item.quantity)}>
                      Edit Quantity
                    </Button>
                  </Box>
                </Card>
              ))}
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
      </Grid>
      <Grid item xs={6}>
        <Box m={2}>
          <Typography variant="h4" gutterBottom>
            Payment Summary
          </Typography>
          <Typography variant="h6" style={{ marginRight: '16px' }}>Total: ${getTotalPrice()}</Typography>
          <Box mt={2} display="flex" alignItems="center">
            <TextField
              label="Voucher Code"
              variant="outlined"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              style={{ marginRight: '16px', flex: 1 }}
            />
            <Button variant="contained" color="primary" onClick={handleApplyVoucher}>
              Apply Voucher
            </Button>
          </Box>
          <Box mt={2} width="100%">
            <Typography variant="body1">Select Payment Method:</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant={paymentMethod === 'stripe' ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => setPaymentMethod('stripe')}
                >
                  Stripe
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant={paymentMethod === 'normal' ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => setPaymentMethod('normal')}
                >
                  Normal
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box mt={4} textAlign="center">
            <Button fullWidth variant="contained" color="secondary" onClick={handlePay}>
              Pay
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Cart;