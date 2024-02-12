import dayjs from 'dayjs';
import global from '../../global';
import { AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../../http';

function GetService() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [serviceList, setServiceList] = useState([]);
  const [search, setSearch] = useState('');
  const [totalService, setTotalService] = useState(0);

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const searchServices = () => {
    http.get(`/Product/getservice?search=${search}`).then((res) => {
      setServiceList(res.data);
    }
    )
  };

  const getService = () => {
    http.get('/Product/getservice').then((res) => {
      setServiceList(res.data);
      setTotalService(res.data.length);
    });
  };

  useEffect(() => {
    http.get('/Product/getservice').then((res) => {
      getService();
    });
  }, []);

  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      searchServices();
    }
  }

  const onClickSearch = () => {
    searchServices();
  }



  return (
    <Box className="admin-wrap main-wrap">

      <Typography variant="h6" sx={{ mt: 1 }} style={{ color: 'black' }}>
        Total Services: {totalService}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, marginTop: "10px" }}>

        <Input value={search} placeholder="Search" sx={{ width: '100%' }}
          onChange={onSearchChange} onKeyDown={onSearchKeyDown} />
        <IconButton color="primary" onClick={onClickSearch}>

          <Search />
        </IconButton>
        <IconButton color="primary" onClick={onClickSearch}>
          <Clear />
        </IconButton>
      </Box>
      <Grid container spacing={2}>
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

                    <Typography variant='h6' sx={{ fontWeight: 'bold' }}>{services.name}</Typography>
                    <Box sx={{ display: 'flex', mb: 1 }}>
                      <Typography variant="" sx={{ flexGrow: 1 }}>
                        <b>Category:</b> {services.category}
                      </Typography>
                      
                      <Link to={`/editservice/${services.id}`}>
                        <IconButton color="primary" sx={{ padding: '4px' }}>
                          <Edit />
                        </IconButton>


                      </Link>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                      color="text.secondary">
                      <AccessTime sx={{ mr: 1 }} />
                      <Typography>
                        {dayjs(services.createdAt).format(global.datetimeFormat)}
                      </Typography>
                    </Box>
                    
                    <Typography variant="" sx={{ flexGrow: 1 }} >
                        <b>Vendor:</b> {services.vendor}
                    </Typography>

                  </CardContent>
                </Card>
              </Grid>
            );
          })
          
        }
      </Grid>


      


    </Box>
  );
}

export default GetService