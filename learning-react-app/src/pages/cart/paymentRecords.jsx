import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import MUIDataTable from "mui-datatables"; // Import MUIDataTable if you haven't already

// Sample data
const paymentRecordsData = [
  { orderNumber: '1234', user: 'karstendelfino1120@gmail.com', activityName: 'High Tea Session for 2 at Brunches Café', price: '$50' },
  { orderNumber: '5678', user: 'bananawiz4rd@gmail.com', activityName: 'Matcha Appreciation Workshop', price: '$30' },
  { orderNumber: '91011', user: 'brown07@gmail.com', activityName: 'Secret Trails of Mount Faber', price: '$70' },
];

function PaymentRecords() {
  // Define columns for MUIDataTable
  const columns = [
    { name: "orderNumber", label: "Order Number" },
    { name: "user", label: "User" },
    { name: "activityName", label: "Activity Name" },
    { name: "price", label: "Price" }
  ];

  // Options for MUIDataTable
  const options = {
    // Customize options as needed
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Payment Records
      </Typography>
      <Box marginTop={"15px"}>
        <MUIDataTable data={paymentRecordsData} columns={columns} options={options} />
      </Box>
    </Box>
  );
}

export default PaymentRecords;
