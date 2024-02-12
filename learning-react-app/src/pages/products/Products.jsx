import global from '../../global';
import { AccessTime, Search, Clear, Edit, TimelineRounded, FavoriteRounded, FavoriteBorderRounded, AutoAwesomeRounded, StarRounded, StarBorderRounded } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Rating, Select, MenuItem, Card, CardHeader, CardContent, CardActions, FormControl, Avatar } from '@mui/material';
import http from '../../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { unstable_useNumberInput as useNumberInput } from '@mui/base/unstable_useNumberInput';
import { styled } from '@mui/system';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import { CheckIfDataIsArray } from '../constant';

import dayjs from 'dayjs';

import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";


function Products() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [isMemberPriceVisible, setIsMemberPriceVisible] = useState(false);
    const [timeslotsList, setTimeslots] = useState([]);
    const [services, setServices] = useState([]);
    const [reviewsList, setReviews] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [user, setUser] = useState('');
    const [openYARL, setOpenYARL] = useState(false);
    const [imageForYARL, setImageForYARL] = useState([])
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)

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

                const timeslotValues = res.data.timeSlots;
                const timeValues = timeslotValues.split(', ')
                setTimeslots(timeValues);

            });

        http.get(`/Review/getreview/${id}`)
            .then((res) => {
                res.data = [
                    {
                        "id": 9,
                        "serviceId": 1,
                        "rating": 4,
                        "user": "Amos Tan Jun Wei",
                        "description": "<p>sadadadasdas</p>",
                        "media": 'https://avionrx.blob.core.windows.net/avalon/1da88e73-36b0-41f8-89a7-2d4d414e39c0',
                        "createdAt": "2024-02-12T22:41:51",
                        "updatedAt": "2024-02-12T22:41:51"
                    },
                    {
                        "id": 8,
                        "serviceId": 1,
                        "rating": 5,
                        "user": "Amos Tan",
                        "description": "<p>asdasd</p>",
                        "media": null,
                        "createdAt": "2024-02-12T22:41:45",
                        "updatedAt": "2024-02-12T22:41:45"
                    },
                    {
                        "id": 7,
                        "serviceId": 0,
                        "rating": 5,
                        "user": "Amos Tan",
                        "description": "<p>asdasd</p>",
                        "media": null,
                        "createdAt": "2024-02-12T22:40:55",
                        "updatedAt": "2024-02-12T22:40:55"
                    },
                    {
                        "id": 6,
                        "serviceId": 0,
                        "rating": 5,
                        "user": "Amos Tan",
                        "description": "<p>asdadsa</p>",
                        "media": 'https://avionrx.blob.core.windows.net/avalon/b27096cc-1a58-4317-8fa7-144e07cf266c',
                        "createdAt": "2024-02-12T22:40:41",
                        "updatedAt": "2024-02-12T22:40:41"
                    },
                    {
                        "id": 5,
                        "serviceId": 0,
                        "rating": 3,
                        "user": "string",
                        "description": "string",
                        "media": null,
                        "createdAt": "2024-02-12T22:36:05",
                        "updatedAt": "2024-02-12T22:36:05"
                    },
                    {
                        "id": 4,
                        "serviceId": 0,
                        "rating": 5,
                        "user": "Amos Tan",
                        "description": "<p>sadasdsadas</p>",
                        "media": null,
                        "createdAt": "2024-02-12T22:34:26",
                        "updatedAt": "2024-02-12T22:34:26"
                    },
                    {
                        "id": 3,
                        "serviceId": 0,
                        "rating": 5,
                        "user": "Amos Tan",
                        "description": "<p>sadasdsadas</p>",
                        "media": null,
                        "createdAt": "2024-02-12T22:34:24",
                        "updatedAt": "2024-02-12T22:34:24"
                    },
                    {
                        "id": 2,
                        "serviceId": 0,
                        "rating": 4,
                        "user": "Amos Tan",
                        "description": "<p>adasdsada</p>",
                        "media": null,
                        "createdAt": "2024-02-12T22:31:21",
                        "updatedAt": "2024-02-12T22:31:21"
                    },
                    {
                        "id": 1,
                        "serviceId": 0,
                        "rating": 5,
                        "user": "Amos Tan",
                        "description": "<p>adsadsadasdsadsad</p>",
                        "media": null,
                        "createdAt": "2024-02-12T22:22:04",
                        "updatedAt": "2024-02-12T22:22:04"
                    }
                ]
                const data = CheckIfDataIsArray(res.data)
                setReviews(data);
                // const mediaArray = data.filter(obj => obj.media !== null).map(obj => ({ "src": obj.media }))
                const mediaArray = data.map(r => ({
                    "src": r.media, "title": services.name, "description": (
                        <Box>
                            <Typography>User: {r.user}</Typography>
                            <Typography>Description: {r.description.replace(/<[^>]*>?/gm, '')}</Typography>
                        </Box>
                    )
                }))
                setImageForYARL(mediaArray)
            });


        http.get(`/user/auth`)
            .then((res) => {
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
        initialValues: { ServiceId: id, service: services, email: user.email, quantity: 0, timeslot: '', date: '' },
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

    function getInitials(name) {
        const words = name.split(' ');
        const firstInitial = words[0].charAt(0);
        const lastInitial = words[words.length - 1].charAt(0);
        const initials = firstInitial + lastInitial;
        return initials;
    }


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
        <Box>
            {services.image && (
                services.image.split(',').map((fileName, index) => (
                    <Box key={index} className="aspect-ratio-container" sx={{ mt: 2 }}>
                        <img alt={`product-${index}`} src={`${import.meta.env.VITE_FILE_BASE_URL}${fileName}`} className='image-insert' />
                    </Box>
                ))
            )}

            {/* IMAGE & INFO */}
            <Box marginTop={"20px"} display={"grid"} gridTemplateColumns={"1fr 300px"} gap={"10px"}>
                {/* <img alt="product" src={`${import.meta.env.VITE_FILE_BASE_URL}${services.image}`} className='image-insert' /> */}
                <img src={services.image} style={{ borderRadius: "10px", objectFit: "cover", minHeight: "300px" }} />
                <Card style={{ position: "relative" }} className='productPageCard'>
                    <CardHeader title={services.name} subheader={"$" + services.price} />
                    <CardContent>
                        <Box display={"flex"} alignItems={"center"} gap={"10px"}>
                            <TimelineRounded fontSize='small' />
                            <Typography variant="body2" color="text.secondary">{services.slots} slots</Typography>
                        </Box>
                        {services.memPrice != null &&
                            <Box display={"flex"} alignItems={"center"} gap={"10px"}>
                                <AutoAwesomeRounded fontSize='small' />
                                <Typography variant="body2" color="text.secondary">${services.memPrice} (Member Exclusive)</Typography>
                            </Box>
                        }
                    </CardContent>
                    <CardActions style={{ position: "absolute", bottom: "8px" }}>
                        <Button onClick={handleFavClick} startIcon={isFavorite ? <FavoriteRounded /> : <FavoriteBorderRounded />}>
                            {isFavorite ? "Remove from Wishlist" : " Add to Wishlist"}
                        </Button>
                    </CardActions>
                </Card>
            </Box>



            {/* DESCRIPTION */}
            <Box>
                <Typography variant='h5' style={{ marginTop: "40px", marginBottom: "0px" }}>Description</Typography>
                <Typography variant="subtitle1" style={{ marginTop: "5px" }}>{services.description?.replace(/<[^>]*>?/gm, '') || ''}</Typography>
            </Box>

            {/* REVIEWS */}
            {reviewsList.length != 0 &&
                <Box marginTop={"40px"}>
                    <Typography variant='h5' style={{ marginBottom: "10px" }}>Reviews</Typography>
                    <Box display={"grid"} gap={"10px"}>
                        <Lightbox plugins={[Captions]} open={openYARL} close={() => setOpenYARL(false)} slides={imageForYARL} index={selectedImageIndex} />
                        {reviewsList.map((review, i) => {
                            return (
                                <Card key={i}>
                                    <CardHeader
                                        style={{ alignItems: "center" }}
                                        avatar={<Avatar>{getInitials(review.user)}</Avatar>}
                                        title={review.user} subheader={dayjs(review.createdAt).format("D MMM YYYY, h:mm A")}
                                        action={<Rating icon={<StarRounded />} emptyIcon={<StarBorderRounded />} value={review.rating} readOnly />}
                                    />
                                    <CardContent>
                                        <Typography variant="subtitle1" color="text.secondary">{review.description.replace(/<[^>]*>?/gm, '')}</Typography>
                                        {review.media != null
                                            ? <Box onClick={() => { setSelectedImageIndex(i); setOpenYARL(true); }} style={{ cursor: "pointer" }}>
                                                <img src={review.media} style={{ height: "150px", width: "300px", borderRadius: "5px", objectFit: "cover", marginTop: "10px" }} />
                                            </Box>
                                            : null
                                        }
                                    </CardContent>
                                </Card>
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
        </Box>
    )
}

export default Products