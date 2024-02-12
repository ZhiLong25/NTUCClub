import global from '../../global';
import { AccessTime, Search, Clear, Edit, TimelineRounded, FavoriteRounded, FavoriteBorderRounded, AutoAwesomeRounded } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Rating, InputLabel, Select, MenuItem, Grid, Card, CardHeader, CardContent, CardActions, FormControl } from '@mui/material';
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
import { CheckIfDataIsArray } from '../constant';


function Products() {
    var [isMemberPriceVisible, setIsMemberPriceVisible] = useState(false);
    const [imageFile, setImageFile] = useState('');
    const [timeslotsList, setTimeslots] = useState([]);

    const [services, setServices] = useState([]);
    const [reviewsList, setReviews] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [user, setUser] = useState('');

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        http.get(`/Product/getservice/${id}`)
            .then((res) => {
                res.data = {
                    "id": 1,
                    "image": "https://avionrx.blob.core.windows.net/avalon/899e398c-dce7-4935-b3f8-934a9d76faa1?v=20240108052937",
                    "name": "Good Old Days Asian Dinner Buffet (Adult)",
                    "description": "Good Old Days Food Court will delight you and your loved ones with its diverse range of tantalising local favourites",
                    "category": "Dine & Wine",
                    "price": 25,
                    "memPrice": 20,
                    "timeSlots": "12:00",
                    "slots": 12,
                    "vendor": "Vendor1",
                    "createdAt": "2024-02-01T23:53:51",
                    "updatedAt": "2024-02-01T23:53:51",
                    "categoryID": 4,
                    "catName": null
                }
                setServices(res.data);
                if (res.data.memPrice != null) {
                    setIsMemberPriceVisible(true)
                }
                if (res.data.image) {
                    setImageFile(res.data.image);
                }
    
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
    
        http.get(`/Review/getreview/${id}`).then((res) => {
            console.log(res.data);
            setReviews(res.data);
        });
    
        http.get(`/user/auth`).then((res) => {
            setUser(res.data.user);
            console.log(res.data.user.name);
    
            http.get(`/Wishlist/getwishlist/${res.data.user.name}/${id}`).then((res) => {
                setIsFavorite(res.data);
            }).catch((error) => {
                console.error("Error fetching wishlist:", error);
            });
    
        });
    }, []);
    
         
    const formik = useFormik({
        initialValues: {
            ServiceId: id,
            service: services,
            email : user.email,
            quantity: 0,
            timeslot: '',
            date: '',
        },

        validationSchema: yup.object().shape({
            timeslot: yup.string().required('Timeslots is required'),
            date: yup.date().required('Date is required'),
            quantity: yup.number().required('Quantity is required')
        }),

        onSubmit: (data) => {
            console.log(data)
            http.post("/cart/addtocart", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/cart");
                })
        }
    });


    const handleFavClick = () => {
        if (!isFavorite) {
            setIsFavorite((prevIsFavorite) => !prevIsFavorite);
            http.get('/user/auth')
                .then((res) => {
                    const currentUser = res.data.user.name;

                    if (currentUser) {
                        // Fetch the user's wishlist
                        http.get(`/Wishlist/getwishlist/${currentUser}`)
                            .then((response) => {
                                const wishlist = response.data;
                                const existingService = wishlist.find(item => item.ServiceId === parseInt(id));

                                if (existingService) {
                                    console.log("Service is already in the wishlist.");
                                } else {
                                    // If the service is not in the wishlist, add it
                                    const requestData = {
                                        User: currentUser,
                                        ServiceId: parseInt(id),
                                        Service: services
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
                                console.log(response.data)
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
            // DELETE
            http.delete(`/Wishlist/deletewishlist/${user.name}/${id}`)
                .then((res) => {
                    console.log(res.data);
                    setIsFavorite((prevIsFavorite) => !prevIsFavorite);
                });
        }
    };



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
            const newValue = parseInt(props.value) + 1; // Increment the value
            props.onChange(newValue); // Update the value
        };

        // Event handler for decrementing the value
        const handleDecrement = () => {
            const newValue = parseInt(props.value) - 1; // Decrement the value
            props.onChange(newValue); // Update the value
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



    const blue = { 100: '#DAECFF', 200: '#B6DAFF', 400: '#3399FF', 500: '#007FFF', 600: '#0072E5', 700: '#0059B2', 900: '#003A75' };
    const grey = { 50: '#F3F6F9', 100: '#E5EAF2', 200: '#DAE2ED', 300: '#C7D0DD', 400: '#B0B8C4', 500: '#9DA8B7', 600: '#6B7A90', 700: '#434D5B', 800: '#303740', 900: '#1C2025' };
    const StyledInputRoot = styled('div')(
        ({ theme }) => `
        font-family: 'IBM Plex Sans', sans-serif;
        font-weight: 400;
        border-radius: 8px;
        color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
        background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
        border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
        box-shadow: 0px 2px 4px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'};
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
                <Container>
                    {imageFile && (
                        imageFile.split(',').map((fileName, index) => (
                            <Box key={index} className="aspect-ratio-container" sx={{ mt: 2 }}>
                                <img alt={`product-${index}`} src={`${import.meta.env.VITE_FILE_BASE_URL}${fileName}`} className='image-insert' />
                            </Box>
                        ))
                    )}
                </Container>
            </Container>

            <Grid container spacing={2}>

                <Grid item xs={8} md={8} lg={8} >

                    <Typography variant='h4' style={{ marginTop: "40px" }}>
                        Description
                    </Typography>


                    <Box onClick={handleClick}>
                        {!isFavorite ?

                            <Box>
                                <FavoriteBorderIcon /> Add to your wishlist
                            </Box>

                            :

                            <Box>
                                <FavoriteIcon /> Remove from wishlist
                            </Box>

                        }

                    </Box>

                    <Typography variant="subtitle1" sx={{ flexGrow: 1 }} style={{ marginTop: "10px " }}>
                        {services.description?.replace(/<[^>]*>?/gm, '') || ''}
                    </Typography>


                </Grid>


                <Grid item xs={4} md={4} lg={4} >

                    <Box className="booking-box" component="form" onSubmit={formik.handleSubmit}>
                        <Typography variant='h4' style={{ marginTop: "40px" }}>
                            Book Now
                        </Typography>

                        <Typography>Price: ${services.price}</Typography>

                        <Typography>Slots left: {services.slots}</Typography>
                        <InputLabel>Timeslot :</InputLabel>
                        <Select
                            style={{ marginTop: "15px" }}
                            fullWidth
                            margin="normal"
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

                        {formik.touched.date && formik.errors.date ? (
                            <Typography color="error">{formik.errors.date}</Typography>
                        ) : null}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={formik.values.date}
                                onChange={(value) => formik.setFieldValue('date', value)}
                                renderInput={(props) => <TextField {...props} error={formik.touched.date && Boolean(formik.errors.date)} helperText={formik.touched.date && formik.errors.date} />}
                            />
                        </LocalizationProvider>

                        {formik.touched.quantity && formik.errors.quantity ? (
                            <Typography color="error">{formik.errors.quantity}</Typography>
                        ) : null}
                        <InputLabel>Quantity :</InputLabel>
                        <CustomNumberInput
                            aria-label="Demo number input"
                            placeholder="Type a number…"
                            value={formik.values.quantity}
                            onChange={(newValue) => formik.setFieldValue('quantity', newValue)}
                            error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                            helperText={formik.touched.quantity && formik.errors.quantity}
                        />

                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" type="submit" className='addbtn'>
                                Add to Cart
                            </Button>
                        </Box>
                        {services.memPrice != null &&
                            <Box display={"flex"} alignItems={"center"} gap={"10px"}>
                                <AutoAwesomeRounded fontSize='small' />
                                <Typography variant="body2" color="text.secondary">${services.memPrice} (Member Exclusive)</Typography>
                            </Box>
                        }
                    </Box>
                    <CardActions style={{ position: "absolute", bottom: "8px" }}>
                        <Button onClick={handleFavClick} startIcon={isFavorite ? <FavoriteRounded /> : <FavoriteBorderRounded />}>
                            {isFavorite ? "Remove from Wishlist" : " Add to Wishlist"}
                        </Button>
                    </CardActions>
                </Grid>
            </Grid>


            {/* DESCRIPTION */}
            <Box>
                <Typography variant='h5' style={{ marginTop: "40px", marginBottom: "0px" }}>Description</Typography>
                <Typography variant="subtitle1" style={{ marginTop: "5px" }}>{services.description?.replace(/<[^>]*>?/gm, '') || ''}</Typography>
            </Box>


            {/* REVIEWS  */}
            {reviewsList.length != 0 &&
                <Box>
                    <Typography variant='h5' style={{ marginTop: "40px", marginBottom: "0px" }}>Reviews</Typography>
                    <Box display={"grid"} gap={"10px"}>
                        {reviewsList.map((reviews, i) => {
                            return (
                                <Box>
                                    <Typography variant="h5" component="div">{reviews.subject}</Typography>
                                    <Rating name="read-only" value={reviews.rating} readOnly />
                                    <Typography>{reviews.description.replace(/<[^>]*>?/gm, '')}</Typography>
                                    <Typography>Listed on : {reviews.createdAt}</Typography>
                                    <Typography>Listed by : {reviews.user}</Typography>
                                    <Box style={{ width: "80px" }}>
                                        <img alt="product" src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`} className='image-insert' />
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
            }

            {/* BOOK */}
            <Box padding={"20px"} backgroundColor={"#efefef"} position={"sticky"} bottom={"20px"} borderRadius={"10px"} marginTop={"60px"}>
                <Typography variant='h6' style={{ marginBottom: "5px", fontWeight: "bold" }}>Book Now</Typography>
                <Box component="form">
                    <FormControl style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "20px", alignItems: "center" }}>
                        <Select
                            displayEmpty
                            name="timeslot"
                            label="Select a Timeslot"
                            variant='standard'
                            value={formik.values.timeslot}
                            onChange={formik.handleChange}
                            helperText={formik.touched.timeslot && formik.errors.timeslot}
                            error={formik.touched.timeslot && Boolean(formik.errors.timeslot)}
                        >
                            <MenuItem value="" disabled>Select a Timeslot</MenuItem>
                            {timeslotsList.map((timeslot) => (
                                <MenuItem key={timeslot} value={timeslot}>{timeslot}</MenuItem>
                            ))}
                        </Select>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker slotProps={{ textField: { variant: "standard", placeholder: "Select a Date" } }} />
                        </LocalizationProvider>
                        <div>Select a Quantity</div>
                        {/* <CustomNumberInput
                            aria-label="Demo number input"
                            placeholder="Type a number…"
                            value={formik.values.quantity}  // Assuming formik is used to manage state
                            onChange={(newValue) => formik.setFieldValue('quantity', newValue)} // Update the formik state with the new value
                        /> */}
                        <Button variant="contained" type="submit">Add to Cart</Button>
                    </FormControl>
                </Box>
            </Box>
        </Container>
    )
}

export default Products