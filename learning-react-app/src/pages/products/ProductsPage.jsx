import { AccessTime, Add, Search, Clear, Edit, Delete } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Container } from '@mui/material';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import http from '../../http';
import '../styles/product.css';
import banner from '../products/media/Banner.jpeg'

function ProductsPage() {
  const [imageFile, setImageFile] = useState('');
  const [serviceList, setServiceList] = useState([]);

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
    <Container>
        <Grid container spacing = {2}>
        {
          serviceList.map((services, i) => {
            return (
              <Grid item xs={12} md={6} lg={4} key={services.id}>
                <Card>
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
                      <Link to={`/Products/${services.id}`}>
                        <IconButton color="primary" sx={{ padding: '4px' }}>
                          <Edit />
                        </IconButton>


                      </Link>


                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                      color="text.secondary">
                      <AccessTime sx={{ mr: 1 }} />
                      <Typography>
                        {services.price} {services.memPrice}
                      </Typography>

                    </Box>

                  </CardContent>
                </Card>
              </Grid>
            );
          })
        }
        </Grid>
    </Container>
  )
}

export default ProductsPage