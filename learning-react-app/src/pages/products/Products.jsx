import global from '../../global';
import { AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Container } from '@mui/material';
import http from '../../http';
function Products() {

    var [isMemberPriceVisible, setIsMemberPriceVisible] = useState(false);
    const [imageFile, setImageFile] = useState('');
    const [vendorList, setVendorList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
  
  
    const { id } = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        http.get(`/Product/getservice/${id}`).then((res) => {
          console.log(res.data);
          setServices(res.data);
    
          if (res.data.memPrice != null) {
              setIsMemberPriceVisible(true)
    
          }
    
          if (res.data.image) {
            setImageFile(res.data.image);
          }
    
        });
    }, []);



  return (
    <Container>
        
        <Container>
        <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
            <img alt="product" src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`} className='image-insert' />
        </Box>
        </Container>


        <Grid container spacing = {2}>

            <Grid item xs={8} md={8} lg={8} >

                <Typography variant='h3'>
                    Description
                </Typography>

                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {services.description}
                </Typography>

            
            
            </Grid>


            <Grid item xs={4} md={4} lg={4} >

                <Box className="booking-box">
                    <Typography variant='h3'>
                        Book Now
                    </Typography>

                    <InputLabel>TimeSlots</InputLabel>
                    
                    <Select
                    style={{ marginTop: "15px" }}
                    fullWidth margin="normal"
                    labelId="timeslots-label"
                    id="timeslots"
                    name="timeslots"
                    value={formik.values.timeslots}
                    onChange={formik.handleChange}
                    error={formik.touched.timeslots && Boolean(formik.errors.timeslots)}
                    helperText={formik.touched.timeslots && formik.errors.timeslots}
                    >
                    <MenuItem value="" disabled>
                        Select a timeslots
                    </MenuItem>
                    {timeslotsList.map((timeslots) => (
                        <MenuItem key={timeslots.id} value={timeslots.slot}>
                        {timeslots.slot}
                        </MenuItem>
                    ))}
                    </Select>

                    
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" type="submit" className='addbtn'>
                            Add to Cart
                        </Button>
                    </Box>


                </Box>

            </Grid>
        </Grid>
    </Container>
  )
}

export default Products