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
      setTotalService(res.data.length);
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

  const [isDeleted, setIsDeleted] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
};
const handleClose = () => {
    setOpen(false);
    setIsDeleted(false);
};

  const deleteService = () => {
    http.delete(`/Product/deleteservice/${id}`)
        .then((res) => {
            console.log(res.data);
            setIsDeleted(true);
            setOpen(false);

            setTimeout(() => {
                navigate("");
            }, 2000);

        });
};


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
                    <Typography variant='h6' sx={{ fontWeight: 'bold' }}>Services No. #{services.id}</Typography>
                    <Box sx={{ display: 'flex', mb: 1 }}>
                      <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {services.name}
                      </Typography>
                      <Link to={`/editservice/${services.id}`}>
                        <IconButton color="primary" sx={{ padding: '4px' }}>
                          <Edit />
                        </IconButton>


                      </Link>
                      <Link onClick={handleOpen}>
                      <IconButton color="primary" sx={{ padding: '4px' }}>
                          <Clear />
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

                  </CardContent>
                </Card>
              </Grid>
            );
          })
        }
      </Grid>


      <Dialog open={open} onClose={handleClose} >
                <img src='https://cdn-icons-png.flaticon.com/512/3588/3588294.png' style={{minWidth:"20%"}} alt="warning" className='noti-icon' />

                <DialogTitle>
                    Delete Service
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this service?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>

                    <Button variant="contained" color="error" className='noti-btn'
                        onClick={deleteService}>
                        Delete
                    </Button>

                </DialogActions>
                <DialogActions>
                    <Button variant="contained" color="inherit" className='noti-btn'
                        onClick={handleClose}>
                        Cancel
                    </Button>
                </DialogActions>

            </Dialog>

            <Dialog open={isDeleted} onClose={handleClose}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flat_tick_icon.svg/768px-Flat_tick_icon.svg.png" className='noti-icon' />

                <DialogTitle>
                    Service has been deleted
                </DialogTitle>
            </Dialog>



    </Box>
  );
}

export default GetService