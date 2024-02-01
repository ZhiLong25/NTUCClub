import { AccessTime, Add, Search, Clear, Edit, Delete } from '@mui/icons-material';
import SellIcon from '@mui/icons-material/Sell';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Container } from '@mui/material';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import http from '../../http';
import '../styles/product.css';
import banner from '../products/media/Banner.png'

function ProductsPage() {
  const [imageFile, setImageFile] = useState('');
  const [serviceList, setServiceList] = useState([]);
  const [categoryList, setCategoryList] = useState('');

  const [totalService, setTotalService] = useState('');

  useEffect(() => {
    http.get('/Category/getcategory').then((res) => {
      setCategoryList(res.data);

    });

    http.get('/Product/getservice').then((res) => {
      setServiceList(res.data);
      setTotalService(res.data.length);
    });

  }, []);

  return (
    
    <Box>
          <img alt="image" src={banner} style={{width: "100%"}}></img>
        <Typography variant="h5">Products Page</Typography>


        
        <Grid container spacing = {3}>
        {
          serviceList.map((services, i) => {
            return (
              <Grid item xs={6} md={3} lg={3} key={services.id}>
                <Link to={`/Products/${services.id}`}>
                <Card style={{ height: "350px"}}>
                  <CardContent>

                    {
                      services.image && (
                        <Box className="aspect-ratio-container">
                          <img alt="image"
                            src={`${import.meta.env.VITE_FILE_BASE_URL}${services.image}`}>
                          </img>
                        </Box>
                      )
                    }

                    <Typography variant='h6' sx={{ fontWeight: 'bold' }}>Services No. #{services.id}</Typography>
                    <Box sx={{ display: 'flex', mb: 1 }}>
                      <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {services.name}
                      </Typography>



                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                      color="text.secondary">
                      <SellIcon sx={{ mr: 1 }} />
                      <Typography style={{color:"black"}}>
                      {services.memPrice ? (
                        // If member price is not null, strike the price and show member price
                        <Box>
                          <Typography >${services.price}</Typography>
                          <Typography>From: ${services.memPrice}</Typography>
                        </Box>

                      ) : (
                        // Otherwise, show only the regular price
                        <Typography>{services.price}</Typography>
                      )}
                      
                      </Typography>

                    </Box>

                  </CardContent>
                </Card>
                </Link>
              </Grid>
            );
          })
        }
        </Grid>
    </Box>
  )
}

export default ProductsPage