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
    const [reviewsList, setReviews] = useState([]);

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
        

        http.get(`/Review/getreview`).then((res) => {
            console.log(res.data);
            setReviews(res.data);
            
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
        if (isFavorite) {
            setIsFavorite((prevIsFavorite) => !prevIsFavorite);
            http.get('/user/auth')
            .then((res) => {
                const currentUser = res.data.user;
                console.log(currentUser.name)
    
                if (currentUser) {
                    // Fetch the user's wishlist
                    http.get("/Wishlist/getwishlist")
                        .then((response) => {
                            const wishlist = response.data;
                            const existingService = wishlist.find(item => item.ServiceId === parseInt(id));
    
                            if (existingService) {
                                console.log("Service is already in the wishlist.");
                            } else {
                                // If the service is not in the wishlist, add it
                                const requestData = {
                                    User: currentUser.name,
                                    ServiceId: parseInt(id)
                                };
    
                                http.post("/Wishlist/addwishlist", requestData)
                                    .then((res) => {
                                        console.log("Service added to wishlist:", res.data);
                                    })
                                    .catch((error) => {
                                        console.error("Error adding service to wishlist:", error);
                                    });
                            }
                        })
                        .catch((error) => {
                            console.error("Error fetching wishlist:", error);
                        });
                } else {
                    console.error("Unable to fetch current user's information");
                }
            })
            .catch((error) => {
                console.error("Error fetching current user's information:", error);
            });
        } else {
            console.log(id);

            // DELETE
            http.delete(`/Wishlist/deletewishlist/${id}`)
            .then((res) => {
              console.log(res.data);
              setIsFavorite((prevIsFavorite) => !prevIsFavorite);
            });
        }
    };

    const [user, setUser] = useState(null);

    useEffect(() => {

        http.get('/user/auth').then((res) => {
            setUser(res.data.user);
            console.log(res.data.user.name);
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

                <Typography variant='h4' style={{marginTop:"40px"}}>
                    Description
                </Typography>

                
                <div onClick={handleClick}>
                    {isFavorite ? <FavoriteBorderIcon /> : <FavoriteIcon />} Add to your wishlist
                </div>

                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {services.description.replace(/<[^>]*>?/gm, '')}
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

        {/* REVIEWS SECTION */}
        
        <Typography variant="h5" style={{ marginBottom: "20px", marginTop: '20px' }}>Reviews by others</Typography>

        <Box>
        {reviewsList.map((reviews, i) => {
            return (
            <Container>

                <Typography variant="h5" component="div">{reviews.subject}</Typography>
                
                <Typography>{reviews.rating}</Typography>


                <Typography>{reviews.description.replace(/<[^>]*>?/gm, '')}</Typography>
                <Typography>Listed on : {reviews.createdAt}</Typography>
                <Typography>Listed by : {reviews.user}</Typography>


                <Box style={{width: "80px"}}>
                    <img alt="product" src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`} className='image-insert' />
                </Box>
                <hr style={{ height: "10px"}}></hr>
            </Container>

            );
          })}
        </Box>


    </Container>
  )
}

export default Products