import global from '../../global';
import { AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton,InputLabel, Select, MenuItem, Grid } from '@mui/material';
import http from '../../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';


function Products() {

    var [isMemberPriceVisible, setIsMemberPriceVisible] = useState(false);
    const [imageFile, setImageFile] = useState('');
    const [timeslotsList, setTimeslots] = useState([]);

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

          const timeslotValues = res.data.timeSlots;
          const timeValues = timeslotValues.split(', ')
            setTimeslots(timeValues);

        });
    }, []);

    const formik = useFormik({
        initialValues: {
            timeslot: ''
        },
            
        validationSchema: yup.object().shape({
    
          timeslot: yup.string().required('Timeslots is required'),
    
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

    const [isFavorite, setIsFavorite] = useState(false);
      
    const handleClick = () => {
        setIsFavorite((prevIsFavorite) => !prevIsFavorite);
    };

    const [user, setUser] = useState(null);

    useEffect(() => {

        http.get('/user/auth').then((res) => {
            setUser(res.data.user);
            console.log(res.data.user.name);
        });



        if (isFavorite == true) {
            if (isFavorite == true) {
                http.post("/Favorites/addfavorites", currentuser, isFavorite)
                .then((res) => {
                  console.log(res.data);
                  navigate("/cart");
                })
            }
            else {
                http.delete("/Favorites/deletefavorites", currentuser, isFavorite)
                .then((res) => {
                  console.log(res.data);
                  navigate("/cart");
                })
            }
        }
        
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

                <Typography variant='h4' style={{marginTop:"40px"}}>
                    Description
                </Typography>

                
                <div onClick={handleClick}>
                    {isFavorite ? <FavoriteBorderIcon /> : <FavoriteIcon />} Add to your wishlist
                </div>

                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {services.description}
                </Typography>
            


            </Grid>


            <Grid item xs={4} md={4} lg={4} >

                <Box className="booking-box" component="form">
                    <Typography variant='h4' style={{marginTop:"40px"}}>
                        Book Now
                    </Typography>

                    <Typography>Price: ${services.price}</Typography>

                    <Typography>Slots left: {services.slots}</Typography>


                    <InputLabel>TimeSlots : {services.timeSlots}</InputLabel>


                    <Select
                    style={{ marginTop: "15px" }}
                    fullWidth margin="normal"
                    labelId="timeslots-label"
                    id="timeslot"
                    name="timeslot"
                    value={formik.values.timeslot}
                    onChange={formik.handleChange}
                    error={formik.touched.timeslot && Boolean(formik.errors.timeslot)}
                    helperText={formik.touched.timeslot && formik.errors.timeslot}
                    >

                    <MenuItem value="" disabled>
                        Select a timeslot
                    </MenuItem>
                    {timeslotsList.map((timeslots) => (
                        <MenuItem key={timeslots} value={timeslots}>
                            {timeslots}
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