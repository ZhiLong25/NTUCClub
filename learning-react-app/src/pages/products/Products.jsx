import global from '../../global';
import { AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton,InputLabel, Select, MenuItem, Grid } from '@mui/material';
import http from '../../http';
import { useFormik } from 'formik';
import * as yup from 'yup';


function Products() {

    var [isMemberPriceVisible, setIsMemberPriceVisible] = useState(false);
    const [imageFile, setImageFile] = useState('');
    const [vendorList, setVendorList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
  
    const [services, setServices] = useState([]);

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

        
    http.get('/Timeslot/gettimeslots').then((res) => {
        setTimeslots(res.data);
          console.log(res.data.length)
      });
      
    }, []);

    const formik = useFormik({
        initialValues: services,
        enableReinitialize: true,
    
        validationSchema: yup.object().shape({
          name: yup.string().trim()
            .min(3, "Name must be at least 3 characters")
            .max(100, 'Name must be at most 100 characters')
            .required('Name is required'),
    
          description: yup.string().trim()
            .min(3, "Description must be at least 3 characters")
            .max(100, 'Description must be at most 100 characters')
            .required('Description is required'),
    
          price: yup.number().required('Price is required'),
    
          timeslots: yup.string().required('Timeslots is required'),
    
          slots: yup.number().required('Slots amount is required'),
    
          vendor: yup.string().trim()
            .min(3, "Vendor must be at least 3 characters")
            .max(100, 'Vendor must be at most 100 characters')
            .required('Vendor is required'),
    
          category: yup.string().required('Category is required')
    
        }),
    
        onSubmit: (data) => {
          console.log("Submit button clicked");
          http.post("/cart/addproduct", data)
            .then((res) => {
              console.log(res.data);
              navigate("/cart");
            })
        }
      });


  return (
    <Container>
        <Typography>hghello</Typography>
        <Container>
        <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
            <img alt="product" src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`} className='image-insert' />
        </Box>
        </Container>

        <Grid container spacing = {2}>

            <Grid item xs={8} md={8} lg={8} >

                <Typography variant='h4' style={{marginTop:"40px"}}>
                    Description
                </Typography>

                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {services.description}
                </Typography>
            
            </Grid>


            <Grid item xs={4} md={4} lg={4} >

                <Box className="booking-box">
                    <Typography variant='h4' style={{marginTop:"40px"}}>
                        Book Now
                    </Typography>

                    <Typography>Price: ${services.price}</Typography>


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
                        Select a timeslot
                    </MenuItem>
                    {/* {timeslotsList.map((timeslots) => (
                        <MenuItem key={timeslots.id} value={timeslots.slot}>
                        {timeslots.slot}
                        </MenuItem>
                    ))} */}
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