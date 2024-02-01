import React, { useState } from 'react';
import { Box, Typography, Card, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


function Cart() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'High Tea Session for 2 at Brunches Café', price: 47, quantity: 1 },
    { id: 2, name: 'Matcha Appreciation Workshop', price: 46, quantity: 2 },
    { id: 3, name: 'Secret Trails of Mount Faber', price: 14, quantity: 5 },
  ]);

  const [removeItemId, setRemoveItemId] = useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [editableItemId, setEditableItemId] = useState(null);
  const [editableQuantity, setEditableQuantity] = useState(0);
  const navigate = useNavigate();

  const handleRemoveItem = (id) => {
    setRemoveItemId(id);
    setOpenConfirmation(true);
  };

  const removeItemConfirmed = () => {
    setCartItems(cartItems.filter((item) => item.id !== removeItemId));
    setOpenConfirmation(false);
    toast.success('Item removed from cart');
  };

  const handleEditQuantity = (id, quantity) => {
    setEditableItemId(id);
    setEditableQuantity(quantity);
  };

  const handleQuantityChange = (e) => {
    setEditableQuantity(parseInt(e.target.value, 10));
  };

  const handleQuantityConfirm = (id) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: editableQuantity } : item
      )
    );
    setEditableItemId(null);
  };

  const handleApplyVoucher = () => {
    if (voucherCode === 'UPLAY10') { // Hardcoded voucher code
      setDiscount(0.1); // 10% discount
      toast.success('Voucher applied successfully!');
    } else {
      toast.error('Invalid voucher code');
    }
  };

  const getTotalPrice = () => {
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    return subtotal - subtotal * discount;
  };

  const handlePay = () => {
    // Navigate to the payment page when Pay button is clicked
    navigate('/payment', { state: { cartItems, discount }});
  };

  return (
    <Box m={2}>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>
      {cartItems.map((item) => (
        <Card key={item.id} variant="outlined" style={{ marginBottom: '16px' }}>
          <Box p={2}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <Typography variant="body1">{item.name}</Typography>
              </Grid>
              <Grid item xs={6} sm={2}>
                {editableItemId === item.id ? (
                  <TextField
                    type="number"
                    value={editableQuantity}
                    onChange={handleQuantityChange}
                    inputProps={{ min: 1 }}
                  />
                ) : (
                  <Typography>Quantity: {item.quantity}</Typography>
                )}
              </Grid>
              <Grid item xs={6} sm={2}>
                <Typography>Price: ${item.price * item.quantity}</Typography>
              </Grid>
              <Grid item xs={6} sm={2}>
                {editableItemId !== item.id ? (
                  <Button variant="outlined" color="primary" onClick={() => handleEditQuantity(item.id, item.quantity)}>
                    Edit Quantity
                  </Button>
                ) : (
                  <Button variant="outlined" color="primary" onClick={() => handleQuantityConfirm(item.id)}>
                    Done
                  </Button>
                )}
              </Grid>
              <Grid item xs={6} sm={2}>
                <Button variant="contained" color="secondary" onClick={() => handleRemoveItem(item.id)}>
                  Remove
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Card>
      ))}
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
      <Box mt={2}>
        <Typography variant="h6">Total: ${getTotalPrice()}</Typography>
      </Box>
      <Box mt={4} textAlign="center">
        <Button variant="contained" color="primary" onClick={handlePay}>
          Pay
        </Button>
      </Box>
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
