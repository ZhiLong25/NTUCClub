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

    import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api'; // API

    function ExperienceNearMe() {
        const [locationCoords, setLocationCoords] = useState({ lat: 1.3521, lng: 103.8198 }); // Coordinates for Singapore

        const [userLocation, setUserLocation] = useState(null);
        const [nearestServices, setNearestServices] = useState([]);
        const [services, setServices] = useState([]);
        const [showAllServices, setShowAllServices] = useState(false);

        const getUserLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setUserLocation({ lat: latitude, lng: longitude });
                    },
                    (error) => {
                        console.error('Error getting user location:', error);
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
            }
        };

        useEffect(() => {
            getUserLocation();

            http.get(`/Product/getservice/`)
                .then((res) => {
                    setServices(res.data);
                    console.log("Services")
                    console.log(res.data)
                });
        }, []);

        // Function to filter services based on distance from user
        const filterNearestServices = async (services, userLocation) => {
            const nearest = [];
            for (const service of services) {
                const serviceLocation = await geocodeLocation(service.location);
                console.log(serviceLocation);
                if (serviceLocation) {
                    const distance = calculateDistance(userLocation, serviceLocation);
                    if (distance < 10) {
                        console.log("distance")
                        console.log(distance)
                        nearest.push({ ...service, distance }); // Add distance to the service object
                    }

                }
            }
            console.log(nearest)
            return nearest;
        };

        // Function to calculate distance between two points (using Haversine formula)
        const calculateDistance = (point1, point2) => {
            const R = 6371; // Radius of the Earth in kilometers
            const dLat = (point2.lat - point1.lat) * (Math.PI / 180); // Latitude difference in radians
            const dLon = (point2.lng - point1.lng) * (Math.PI / 180); // Longitude difference in radians
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(point1.lat * (Math.PI / 180)) * Math.cos(point2.lat * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = R * c; // Distance in kilometers
            return distance;
        };

        const geocodeLocation = async (locationName) => {
            try {
                const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationName)}&key=AIzaSyAqS06SaOm9qPZ25jGGECjCyAAbnKd_jLg`);
                const data = await response.json();

                if (data.results && data.results.length > 0) {

                    const { lat, lng } = data.results[0].geometry.location;
                    console.log(lat, lng)
                    return { lat, lng };
                } else {
                    console.error('No results found for location:', locationName);
                    return null;
                }
            } catch (error) {
                console.error('Error geocoding location:', error);
                return null;
            }
        };

        useEffect(() => {
            const fetchNearestServices = async () => {
                if (userLocation) {
                    if (showAllServices) { // Check if we need to show all services
                        const servicesWithDistance = await Promise.all(services.map(async service => {
                            const serviceLocation = await geocodeLocation(service.location);
                            const distance = serviceLocation ? calculateDistance(userLocation, serviceLocation) : null;
                            return { ...service, distance };
                        }));
                        setNearestServices(servicesWithDistance);
                    } else {
                        const nearest = await filterNearestServices(services, userLocation);
                        setNearestServices(nearest);
                    }
                }
            };
            fetchNearestServices();
        }, [userLocation, services, showAllServices]);

        const handleToggleServices = () => {
            setShowAllServices(prevState => !prevState);
        };

        console.log("sdasd")
        console.log(nearestServices)
        return (
            <Box>

                <LoadScript googleMapsApiKey="AIzaSyAqS06SaOm9qPZ25jGGECjCyAAbnKd_jLg">
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '400px' }}
                        center={userLocation}
                        zoom={15}
                    >
                        {/* Display user marker */}
                        {userLocation && <Marker position={userLocation} label="You are here" />}

                        {/* Display markers for nearest services */}
                        {nearestServices.map((service, index) => (
                            <Marker key={index} position={{ lat: parseFloat(service.latitude), lng: parseFloat(service.longitude) }} />
                        ))}
                    </GoogleMap>
                </LoadScript>
                <Typography variant="h4" gutterBottom>
                    Nearest Services
                </Typography>

                <Button onClick={handleToggleServices}>
                    {showAllServices ? 'Show Nearest Services' : 'Show All Services'}
                </Button>

                {nearestServices.map((service, index) => (
                    <Card key={index} sx={{ marginBottom: 2 }}>
                        <CardHeader title={service.name} />
                        <CardContent>
                            <Typography>Distance from you: {service.distance ? service.distance.toFixed(2) : 'N/A'} km</Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        )
    }


    export default ExperienceNearMe