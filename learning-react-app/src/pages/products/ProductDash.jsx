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
import MUIDataTable from "mui-datatables";


function ProductDash() {

  const [totalServices, setTotalServices] = useState(0);
  const [totalCategory, setTotalCategory] = useState(0);
  const [totalVendors, setTotalVendors] = useState(0);

  const [serviceList, setServiceList] = useState([]);

  useEffect(() => {
    http.get('/Product/getproduct').then((res) => {
      setTotalServices(res.data.length);
    });

    http.get('/Category/getcategory').then((res) => {
      setTotalCategory(res.data.length);
    });

    http.get('/Vendor/getvendor').then((res) => {
      setTotalVendors(res.data.length);
    });

  }, []);


  const getServices = () => {
    http.get('/Product/getservice').then((res) => {
        console.log(res.data)
        setServiceList(res.data);
    });
};

useEffect(() => {
    http.get('/Product/getservice').then((res) => {
        getServices();

    });
}, []);

const options = {
  filterType: 'checkbox',
};  

const columns = ['id', 'name', 'category', 'updatedAt'];

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
              <CardContent className="dashCard" style={{ background: "linear-gradient(to right, #FFEB3B, #FF9800)" }}>
                <Typography className="topheader">Manage Services</Typography>

                <Box>
                  <Link to="/addservice"><IconButton className="changeicon"><Add></Add></IconButton></Link>
                </Box>

                <Box>
                  <Link to="/getservice"><IconButton className="changeicon"><Search></Search></IconButton></Link>
                </Box>

              </CardContent>
            </Grid>

            <Grid item xs={3} md={3} lg={3}>
              <CardContent className="dashCard" style={{ background: "linear-gradient(to right, #7F00FF,#E100FF)" }}>
                <Typography className="topheader">Manage Vendors</Typography>

                <Box>
                  <Link to="/managevendor"><IconButton className="changeicon"><Search></Search></IconButton></Link>
                </Box>

              </CardContent>
            </Grid>


            <Grid item xs={3} md={3} lg={3}>

            </Grid>


            
          </Grid>

      </Box>

      <Box style={{ marginTop: "20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={6} lg={6} >
            <CardContent className="addCard" style={{ border: "3px solid #E8533F",borderRadius: "5px", minHeight:"250px" }}>
              <Typography className="topheader">Total Services</Typography>
              <Typography ><span className='number-head'>{totalServices}</span> Services</Typography>
              <Typography className="topheader">Total Categories</Typography>
              <Typography ><span className='number-head'>{totalCategory}</span> Categories</Typography>
              <Typography className="topheader">Total Vendors</Typography>
              <Typography className=''><span className='number-head'>{totalVendors} </span>Vendors</Typography>

            </CardContent>

          </Grid>

          <Grid item xs={6} md={6} lg={6} >
            <CardContent className="addCard" style={{ border: "3px solid #E8533F",borderRadius: "5px", minHeight:"250px" }}>
              

            </CardContent>

          </Grid>

        </Grid>
      </Box>

      <Box style={{ marginTop: "30px" }}>
      <MUIDataTable title="Services List" data={serviceList} columns={columns} options={options} />


      </Box>

    </Box>
    </Box >
  )
}

export default ProductDash;
