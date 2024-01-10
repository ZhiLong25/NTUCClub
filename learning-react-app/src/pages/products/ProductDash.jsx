import { AccessTime, Add, Search, Clear, Edit, Delete } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Container } from '@mui/material';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import http from '../../http';
import '../styles/product.css';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];



function ProductDash() {

  const [totalServices, setTotalServices] = useState(0);

  useEffect(() => {
    http.get('/Product').then((res) => {
      setTotalServices(res.data.length);
    });
  }, []);



  useEffect(() => {
    http.get('/Product').then((res) => {
      setTotalServices(res.data.length);
    });
  }, []);


  return (
    <Box display="block">

      <Box className="main-wrap admin-wrap" >
        <Typography variant="h5" sx={{ my: 2 }} className="main-title">
          Product Management
        </Typography>

        <Box>
          <Grid container spacing={2}>

          <Grid item xs={3} md={3} lg={3}>
              <CardContent className="dashCard" style={{ background: "linear-gradient(to right, #38ef7d, #11998e )" }}>
                <Typography className="topheader">Manage Categories</Typography>

                <Box>
                  <Link to="/managecategory"><IconButton className="changeicon"><Search></Search></IconButton></Link>

                </Box>

              </CardContent>
            </Grid>

          

            <Grid item xs={3} md={3} lg={3}>
              <CardContent className="dashCard" style={{ background: "linear-gradient(to right, #38ef7d, #11998e )" }}>
                <Typography className="topheader">Add Services</Typography>

                <Box>
                  <Link to="/addservice"><IconButton className="changeicon"><Add></Add></IconButton></Link>
                </Box>

              </CardContent>
            </Grid>

            <Grid item xs={3} md={3} lg={3}>
              <CardContent className="dashCard" style={{ background: "linear-gradient(to right, #FFEB3B, #FF9800)" }}>
                <Typography className="topheader">View Services</Typography>

                <Box>
                  <Link to="/getservice"><IconButton className="changeicon"><Search></Search></IconButton></Link>
                </Box>

              </CardContent>
            </Grid>

            <Grid item xs={3} md={3} lg={3}>
              <CardContent className="dashCard" style={{ background: "linear-gradient(to right, #7F00FF,#E100FF)" }}>
                <Typography className="topheader">Manage Vendors</Typography>

                <Box>
                  <Link to="/getservice"><IconButton className="changeicon"><Search></Search></IconButton></Link>
                </Box>

              </CardContent>
            </Grid>

            
          </Grid>

      </Box>

      <Box style={{ marginTop: "20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={6} lg={6} >
            <CardContent className="addCard" style={{ border: "3px solid #E8533F",borderRadius: "5px", minHeight:"250px" }}>
              <Typography variant="h6" className="topheader">Total Services</Typography>
              <Typography variant="h6">{totalServices} Services</Typography>
              <Typography variant="h6" className="topheader">Total Categories</Typography>
              <Typography variant="h6">0</Typography>
              <Typography variant="h6" className="topheader">Total Vendors</Typography>
              <Typography variant="h6">0</Typography>

            </CardContent>

          </Grid>

          <Grid item xs={6} md={6} lg={6} >
            <CardContent className="addCard" style={{ border: "3px solid #E8533F",borderRadius: "5px", minHeight:"250px" }}>
              

            </CardContent>

          </Grid>

        </Grid>
      </Box>

      <Box style={{ marginTop: "30px" }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Dessert (100g serving)</TableCell>
                <TableCell align="right">Calories</TableCell>
                <TableCell align="right">Fat&nbsp;(g)</TableCell>
                <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                <TableCell align="right">Protein&nbsp;(g)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.calories}</TableCell>
                  <TableCell align="right">{row.fat}</TableCell>
                  <TableCell align="right">{row.carbs}</TableCell>
                  <TableCell align="right">{row.protein}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      </Box>

    </Box>
    </Box >
  )
}

export default ProductDash;
