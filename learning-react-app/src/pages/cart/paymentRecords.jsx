import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

// Sample data
const paymentRecordsData = [
  { orderNumber: '1234', user: 'karstendelfino1120@gmail.com', activityName: 'High Tea Session for 2 at Brunches Café', price: '$50' },
  { orderNumber: '5678', user: 'bananawiz4rd@gmail.com', activityName: 'Matcha Appreciation Workshop', price: '$30' },
  { orderNumber: '91011', user: 'brown07@gmail.com', activityName: 'Secret Trails of Mount Faber', price: '$70' },
];

function PaymentRecords() {
  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Payment Records
      </Typography>
      <TableContainer component={Paper} sx={{ boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.1)', marginTop: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Order Number</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">User</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Activity Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paymentRecordsData.map((record, index) => (
              <TableRow key={index}>
                <TableCell align="center">{record.orderNumber}</TableCell>
                <TableCell align="center">{record.user}</TableCell>
                <TableCell align="center">{record.activityName}</TableCell>
                <TableCell align="center">{record.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default PaymentRecords;
