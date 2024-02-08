import { AccessTime, Add, Search, Clear, Edit, Delete, Telegram } from '@mui/icons-material';
import SellIcon from '@mui/icons-material/Sell';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardHeader, CardActionArea, CardActions, Button, IconButton, FormControlLabel, CardMedia, Divider, Paper, InputBase } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import http from '../../http';
import '../styles/product.css';
import banner from '../products/media/placeholder.png'
import TelegramCard from '../components/telegram';

function ProductsPage() {
  const [imageFile, setImageFile] = useState('');
  const [serviceList, setServiceList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [totalService, setTotalService] = useState('');
  const [search, setSearch] = useState('');


  const onClickClear = () => {
    setSearch('');
    http.get('/Product/getservice')
      .then((res) => {
        setServiceList(res.data);
        setTotalService(res.data.length);
      });

    // setSelectedCategories([]);
  }

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const searchServices = () => {
    http.get(`/Product/getservice?search=${search}`)
      .then((res) => {
        setServiceList(res.data);
      })
  };

  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      searchServices();
    }
  }

  const onClickSearch = () => {
    searchServices();
  }

  useEffect(() => {
    http.get('/Category/getcategory')
      .then((res) => {
        try {
          JSON.parse(res.data)
          setCategoryList(res.data);
        }
        catch {
          setCategoryList([])
        }
      });

    http.get('/Product/getservice')
      .then((res) => {
        try {
          JSON.parse(res.data)
          setServiceList(res.data);
          setTotalService(res.data.length);
        }
        catch {
          setCategoryList([])
          setTotalService(0)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }, []);


  return (
    <Box style={{ marginBottom: "60px" }}>
      <img src={banner} style={{ width: "100%", maxHeight: "150px", objectFit: "cover" }}></img>
      <Typography variant="h5" style={{ marginBottom: "20px", marginTop: '20px' }}>Events</Typography>

      {/* TELEGRAM CTA */}
      <TelegramCard />

      {/* Filter input */}
      <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', marginTop: "30px" }}>
        <InputBase value={search} onChange={onSearchChange} onKeyDown={onSearchKeyDown} sx={{ ml: 1, flex: 1 }} placeholder="Search for Events" inputProps={{ 'aria-label': 'search events' }} />
        <IconButton type="button" onClick={onClickSearch} sx={{ p: '10px' }} aria-label="search"><Search /></IconButton>
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton color="button" onClick={onClickClear} sx={{ p: '10px' }} aria-label="clear"><Clear /></IconButton>
      </Paper>


      {/* Category checkboxes */}
      {serviceList.length != 0 ?
        <Grid container spacing={3} style={{ marginTop: "20px" }}>
          {serviceList.map((services, i) => {
            return (
              <Grid item xs={6} md={3} lg={3} key={services.id}>
                <Link to={`/experiences/${services.id}`} className='link'>
                  <Card>
                    <CardActionArea>
                      <CardHeader title={services.name} subheader={services.category} />
                      <CardMedia style={{ height: 150 }} image={`${import.meta.env.VITE_FILE_BASE_URL}${services.image}`} />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">Lizard</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Lizards are a widespread group of squamate reptiles, with over 6,000
                          species, ranging across all continents except Antarctica
                          <br />
                          <Typography style={{ color: "black" }}>
                            {services.memPrice ? (
                              <Box>
                                <Typography style={{ textDecoration: "line-through" }}>${services.price}</Typography>
                                <Typography>From: ${services.memPrice}</Typography>
                              </Box>
                            ) : (
                              <Typography>${services.price}</Typography>
                            )}
                          </Typography>
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Link>


                {/* <Link to={`/Products/${services.id}`} className='link'>
                  <Card style={{ height: "350px" }}>
                    <CardContent>

                      {
                        services.image && (
                          <Box className="aspect-ratio-container">
                            <img alt="image" src={`${import.meta.env.VITE_FILE_BASE_URL}${services.image}`}> </img>
                          </Box>
                        )
                      }

                      <Typography variant='body' sx={{ fontWeight: 'bold' }}>{services.name}</Typography>
                      <Box sx={{ display: 'flex', mb: 1 }}>
                        <Typography variant="body" sx={{ flexGrow: 1 }}>{services.category}</Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                        color="text.secondary">
                        <SellIcon sx={{ mr: 1 }} />
                        <Typography style={{ color: "black" }}>
                          {services.memPrice ? (
                            // If member price is not null, strike the price and show member price
                            <Box>
                              <Typography >${services.price}</Typography>
                              <Typography>From: ${services.memPrice}</Typography>
                            </Box>
                          ) : (
                            // Otherwise, show only the regular price
                            <Typography>${services.price}</Typography>
                          )}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Link> */}
              </Grid>
            );
          })}
        </Grid>
        : null}
    </Box>
  )
}

export default ProductsPage