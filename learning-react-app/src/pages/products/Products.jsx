import global from '../../global';
import { AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Rating, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import http from '../../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { unstable_useNumberInput as useNumberInput } from '@mui/base/unstable_useNumberInput';
import { styled } from '@mui/system';
import { unstable_useForkRef as useForkRef } from '@mui/utils';

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
            timeslot: '',
            date: '',
            quantity: 0,
        },

        validationSchema: yup.object().shape({

            timeslot: yup.string().required('Timeslots is required'),
            date: yup.date().required('Date is required'),
            quantity: yup.number().required('Quantity is required')

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


    const CustomNumberInput = React.forwardRef(function CustomNumberInput(props, ref) {
        const {
          getRootProps,
          getInputProps,
          getIncrementButtonProps,
          getDecrementButtonProps,
          focused,
        } = useNumberInput(props);
      
        const inputProps = getInputProps();
      
        // Make sure that both the forwarded ref and the ref returned from the getInputProps are applied on the input element
        inputProps.ref = useForkRef(inputProps.ref, ref);
      
        // Event handler for incrementing the value
        const handleIncrement = () => {
          props.onChange(props.value + 1); // Update the value by incrementing
        };
      
        // Event handler for decrementing the value
        const handleDecrement = () => {
          props.onChange(props.value - 1); // Update the value by decrementing
        };
      
        return (
          <StyledInputRoot {...getRootProps()} className={focused ? 'focused' : null}>
            <StyledStepperButton {...getIncrementButtonProps()} className="increment" onClick={handleIncrement} type="button">
              ▴
            </StyledStepperButton>
            <StyledStepperButton {...getDecrementButtonProps()} className="decrement" onClick={handleDecrement} type="button">
              ▾
            </StyledStepperButton>
            <StyledInputElement {...inputProps} />
          </StyledInputRoot>
        );
      });
      
      
      const blue = {
        100: '#DAECFF',
        200: '#B6DAFF',
        400: '#3399FF',
        500: '#007FFF',
        600: '#0072E5',
        700: '#0059B2',
        900: '#003A75',
      };
      
      const grey = {
        50: '#F3F6F9',
        100: '#E5EAF2',
        200: '#DAE2ED',
        300: '#C7D0DD',
        400: '#B0B8C4',
        500: '#9DA8B7',
        600: '#6B7A90',
        700: '#434D5B',
        800: '#303740',
        900: '#1C2025',
      };
      
      const StyledInputRoot = styled('div')(
        ({ theme }) => `
        font-family: 'IBM Plex Sans', sans-serif;
        font-weight: 400;
        border-radius: 8px;
        color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
        background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
        border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
        box-shadow: 0px 2px 4px ${
          theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'
        };
        display: grid;
        grid-template-columns: 1fr 19px;
        grid-template-rows: 1fr 1fr;
        overflow: hidden;
        column-gap: 8px;
        padding: 4px;
      
          &.focused {
            border-color: ${blue[400]};
            box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[700] : blue[200]};
      
            & button:hover {
              background: ${blue[400]};
            }
            // firefox
            &:focus-visible {
              outline: 0;
          }
        `,
      );
      
      const StyledInputElement = styled('input')(
        ({ theme }) => `
        font-size: 0.875rem;
        font-family: inherit;
        font-weight: 400;
        line-height: 1.5;
        grid-column: 1/2;
        grid-row: 1/3;
        color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
        background: inherit;
        border: none;
        border-radius: inherit;
        padding: 8px 12px;
        outline: 0;
      `,
      );
      
      const StyledStepperButton = styled('button')(
        ({ theme }) => `
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        appearance: none;
        padding: 0;
        width: 19px;
        height: 19px;
        font-family: system-ui, sans-serif;
        font-size: 0.875rem;
        line-height: 1;
        box-sizing: border-box;
        background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
        border: 0;
        color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
        transition-property: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 120ms;
      
          &.increment {
            grid-column: 2/3;
            grid-row: 1/2;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            border: 1px solid;
            border-bottom: 0;
            border-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
            background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
            color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
      
            &:hover {
              cursor: pointer;
              color: #FFF;
              background: ${theme.palette.mode === 'dark' ? blue[600] : blue[500]};
              border-color: ${theme.palette.mode === 'dark' ? blue[400] : blue[600]};
            }
          }
      
          &.decrement {
            grid-column: 2/3;
            grid-row: 2/3;
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
            border: 1px solid;
            border-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
            background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
            color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
      
            &:hover {
              cursor: pointer;
              color: #FFF;
              background: ${theme.palette.mode === 'dark' ? blue[600] : blue[500]};
              border-color: ${theme.palette.mode === 'dark' ? blue[400] : blue[600]};
            }
        }
        `,
      );

    return (
        <Container>
            <Container>
                <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                    <img alt="product" src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`} className='image-insert' />
                </Box>
            </Container>

            <Grid container spacing={2}>

                <Grid item xs={8} md={8} lg={8} >

                    <Typography variant='h4' style={{ marginTop: "40px" }}>
                        Description
                    </Typography>


                    <Box onClick={handleClick}>
                        {isFavorite ? 
                        
                        <Box>
                            <FavoriteBorderIcon /> Add to your wishlist
                        </Box>

                        : 
                        <Box>
                            <FavoriteIcon /> Remove from wishlist
                        </Box>

                        } 
                        
                        
                    </Box>

                    <Typography variant="subtitle1" sx={{ flexGrow: 1 }} style={{ marginTop: "10px "}}>
                    {services.description?.replace(/<[^>]*>?/gm, '') || ''}
                    </Typography>


                </Grid>


                <Grid item xs={4} md={4} lg={4} >

                    <Box className="booking-box" component="form">
                        <Typography variant='h4' style={{ marginTop: "40px" }}>
                            Book Now
                        </Typography>

                        <Typography>Price: ${services.price}</Typography>

                        <Typography>Slots left: {services.slots}</Typography>

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

                        <InputLabel>Date :</InputLabel>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker />
                        </LocalizationProvider>

                        <InputLabel>Quantity :</InputLabel>
                        <CustomNumberInput
                            aria-label="Demo number input"
                            placeholder="Type a number…"
                            value={formik.values.quantity}  // Assuming formik is used to manage state
                            onChange={(newValue) => formik.setFieldValue('quantity', newValue)} // Update the formik state with the new value
                        />
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

                            <Rating name="read-only" value={reviews.rating} readOnly />


                            <Typography>{reviews.description.replace(/<[^>]*>?/gm, '')}</Typography>
                            <Typography>Listed on : {reviews.createdAt}</Typography>
                            <Typography>Listed by : {reviews.user}</Typography>


                            <Box style={{ width: "80px" }}>
                                <img alt="product" src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`} className='image-insert' />
                            </Box>
                            <hr style={{ height: "10px" }}></hr>
                        </Container>

                    );
                })}
            </Box>


        </Container>
    )
}

export default Products