import dayjs from 'dayjs';
import global from '../../global';
import { AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../../http';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

function ViewWishlist() {

    const [wishlist, setWishlist] = useState([]);
    const [user, setUser] = useState('');

    useEffect(() => {
        http.get(`/user/auth`)
            .then((res) => {
                setUser(res.data.user);
            })
            .catch((error) => {
                console.error("Error fetching user:", error);
            });
    }, []);

    useEffect(() => {
        if (user) {
            const currentUser = user.name;

            http.get(`/Wishlist/getwishlist/${currentUser}`)
                .then((res) => {
                    setWishlist(res.data);

                })
                .catch((error) => {
                    console.error("Error fetching wishlist:", error);
                });
        }
    }, [user]); 

    const handleClick = (id) => {
        http.delete(`/Wishlist/deletewishlist/${user.name}/${id}`)
            .then((res) => {
                setWishlist(prevWishlist => prevWishlist.filter(item => item.id !== id));
                window.location.reload(); // Refresh the page

            })
            .catch((error) => {
                console.error("Error deleting wishlist item:", error);
            });
    };

    return (
        <Box>
            {wishlist.length === 0 ? (
                <Typography variant="h6">Wishlist is empty...</Typography>
            ) : (
                wishlist.map((wishlistItem, i) => (
                    <Card key={i} style={{ marginTop: "20px" }}>
                        <CardContent style={{ padding: "10px" }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={2} lg={2}>
                                    {wishlistItem.service.image && (
                                        <Box>
                                            <img
                                                alt="image"
                                                style={{ width: "100%" }}
                                                src={`${import.meta.env.VITE_FILE_BASE_URL}${wishlistItem.service.image}`}
                                            />
                                        </Box>
                                    )}
                                </Grid>

                                <Grid item xs={12} md={8} lg={8}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}></Typography>
                                    <Box sx={{ display: 'flex', mb: 1 }}>
                                        <Typography variant="" sx={{ flexGrow: 1 }}>
                                        <Link to={`/experiences/${wishlistItem.service.id}`}>
                                        <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{wishlistItem.service.name}</span>                                        </Link>
                                        </Typography>
                                        <Button onClick={() => handleClick(wishlistItem.service.id)} sx={{ minWidth: 0 }}>
                                            <FavoriteIcon />
                                        </Button>
                                    </Box>
                                    <Box sx={{ display: 'flex', mb: 1 }}>
                                        <Typography variant="" sx={{ flexGrow: 1 }}>
                                            <b>Category:</b> {wishlistItem.service.category}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', mb: 1 }}>
                                        <Typography variant="" sx={{ flexGrow: 1 }} >
                                            <b>Vendor:</b> {wishlistItem.service.vendor}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                        <Typography>
                                            Saved on: {dayjs(wishlistItem.createdAt).format(global.datetimeFormat)}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                ))
            )}
        </Box>
    );
}

export default ViewWishlist;
