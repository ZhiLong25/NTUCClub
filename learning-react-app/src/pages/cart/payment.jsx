import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Grid } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    // Check if state contains cartItems and discount
    if (!state || !state.cartItems) {
      // Redirect to cart page if data is missing
      navigate('/cart');
    }
  }, [navigate, state]);

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

  const { cartItems, discount } = state || {};

  // Function to calculate the total price
  const getTotalPrice = () => {
    if (!cartItems || !cartItems.length) return 0;
    const subtotal = cartItems.reduce((total, item) => total + item.service.price * item.quantity, 0);
    return subtotal - subtotal * discount;
  };

  return (
    <Box m={2}>
      <Typography variant="h4" gutterBottom>
        Payment Details
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>
          <Box border="1px solid #ccc" borderRadius="8px" p={2} mb={2}>
            {cartItems && cartItems.length > 0 ? (
              <>
                {cartItems.map((item) => (
                  <Box key={item.id} mb={1}>
                    <Typography>{item.service.name} - ${item.service.price * item.quantity}</Typography>
                  </Box>
                ))}
                <Typography variant="subtitle1">
                  Total: ${getTotalPrice()}
                </Typography>
              </>
            ) : (
              <Typography variant="subtitle1">No items in cart</Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
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
              label="First Name"
              variant="outlined"
              fullWidth
              margin="normal"
            />
             <TextField
              label="Last Name"
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
            <Button variant="contained" color="primary" fullWidth onClick={handlePayNow} style={{ marginTop: '16px' }}>
              Pay Now
            </Button>
          </form>
        </Grid>
      </Grid>
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
