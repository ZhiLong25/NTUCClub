import React, { useEffect, useState } from 'react';
import { Box, IconButton, Typography, Card, TextField, Button, Grid, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import UserContext from '../../contexts/UserContext';
import http from '../../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import DescriptionIcon from '@mui/icons-material/Description';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { Edit } from '@mui/icons-material';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

function voucherDashboard() {
    const navigate = useNavigate()
    const [vouchers, setVouchers] = useState([])
    const [open, setOpen] = useState(false);
    const [id, setID] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        http.get(`Voucher/GetID/${-1}`)    //admin can only view and edit where vouchers for everyone
            .then((res) => {
                const modifiedData = res.data.map(item => ({
                    ...item,
                    voucher_Validity: new Date(item.voucher_Validity).toLocaleString(),
                }));
                setVouchers(modifiedData)
                console.log(modifiedData)
            })

            http.get(`Voucher/GetName/${-1}`)
            .then((res) => {
                // Assuming the response is an array of voucher names
                // Modify this part based on the actual response structure
                const voucherNames = res.data;

                // Update the state with the voucher names
                // This can be used for searching later
                setVoucherNames(voucherNames);
            });

    }, [])

    // Filter vouchers based on the search term
    const filteredVouchers = vouchers.filter((voucher) =>
        voucher.voucher_Name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const edit = (id) => {
        navigate(`/updateVouchers/${id}`)
    }

    const del = (id) => {
        http.delete(`/Voucher/deletebyID/${id}`).then(() => {
            toast.success("Successfully deleted")
            setTimeout(() => {
                window.location.reload();
            }, 2000); // 2000 milliseconds = 2 seconds

        }).catch((err) => {
            toast.error("Can't delete right now")
        })
    }

    const handleOpen = (id) => {
        setID(id)
        console.log(id)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ position: 'relative' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ mt: 8, fontWeight: 'bold', color: '#E6533F' }}>
                    Vouchers
                </Typography>
            
                <TextField
                    id="search"
                    label="Search by Name"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                        width: '300px',
                        ml: "auto",
                        mt: 8,
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}  // Use the AddIcon as the start icon
                    style={{ backgroundColor: '#E6533F', color: 'white', marginLeft: 10 , marginTop: "64px", }}  // Adjust margin as needed
                    onClick={() => navigate('/addVouchers')}  // Navigate to the addVoucher page
                >
                    Add Voucher
                </Button>
            </Box>

            <Grid container spacing={2} style={{ marginTop: "1%", marginBottom: "5%" }}>
            {filteredVouchers.map((voucher, i) => (
                    <Grid item xs={12} md={6} lg={4} key={voucher.id}>
                        <Card>
                            <Box style={{ marginTop: "5%" }}>
                                {voucher.voucher_Image && (
                                    <img
                                        component="img"
                                        alt="tutorial"
                                        style={{
                                            borderRadius: "150%",
                                            height: "200px",
                                            width: "200px",
                                            margin: "auto",
                                        }}
                                        src={`${import.meta.env.VITE_FILE_BASE_URL}${voucher.voucher_Image}`}
                                    />
                                )}
                            </Box>
                            <CardContent style={{ margin: "auto" }}>
                                <Box sx={{ display: 'flex', mb: 5, mt: 2 }}
                                    color="text.secondary">
                                    <Typography style={{ fontWeight: "bold", textAlign: "center", color: "black", fontSize: "1.2rem", flex: "3" }}>
                                        {<div style={{ display: 'flex', alignItems: 'center' }}>
                                            {voucher.voucher_Name}
                                        </div>}
                                    </Typography>
                                    {

                                        <EditIcon onClick={() => edit(voucher.id)} id={voucher.id} style={{ marginRight: 8, fontSize: "1.5rem", cursor: "pointer", color: "#FCD12A" }} />

                                    }
                                    {
                                        <DeleteIcon onClick={() => handleOpen(voucher.id)} id={voucher.id} style={{ marginRight: 8, fontSize: "1.5rem", color: "red" }} />

                                    }
                                </Box>
                                <Box sx={{ display: 'flex', mb: 1 }}
                                    color="text.secondary">
                                    <Typography style={{ textAlign: "center", color: "black", fontSize: "0.85rem", flex: "3" }}>
                                        {<div style={{ display: 'flex', alignItems: 'center' }}>
                                            <DriveFileRenameOutlineIcon style={{ marginRight: 8, fontSize: "18px" }} />
                                            <span style={{ fontWeight: "bold" }}>Voucher Name:</span> &nbsp; {voucher.voucher_Name}
                                        </div>}
                                    </Typography>

                                </Box>



                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                    color="text.secondary">
                                    <Typography style={{ textAlign: "center", color: "black", fontSize: "0.85rem" }}>
                                        {<div style={{ display: 'flex', alignItems: 'center' }}>
                                            <DescriptionIcon style={{ marginRight: 8, fontSize: "18px" }} />
                                            <span style={{ fontWeight: "bold" }}>Voucher Details:</span> &nbsp; {voucher.voucher_Details}
                                           
                                        </div>}
                                    </Typography>
                                </Box>


                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                    color="text.secondary">
                                    <Typography style={{ textAlign: "center", color: "black", fontSize: "0.85rem" }}>
                                        {<div style={{ display: 'flex', alignItems: 'center' }}>
                                            <ProductionQuantityLimitsIcon style={{ marginRight: 8, fontSize: "18px" }} />
                                            <span style={{ fontWeight: "bold" }}>Quantity:</span> &nbsp; {voucher.voucher_Quantity}
                                       
                                        </div>}
                                    </Typography>
                                </Box>



                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                    color="text.secondary">
                                    <Typography style={{ textAlign: "center", color: "black", fontSize: "0.85rem" }}>
                                        {<div style={{ display: 'flex', alignItems: 'center' }}>
                                            <AccessTimeIcon style={{ marginRight: 8, fontSize: "18px" }} />
                                            <span style={{ fontWeight: "bold" }}>Validity:</span> &nbsp; {voucher.voucher_Validity}
                                          
                                        </div>}
                                    </Typography>
                                </Box>

                            </CardContent>
                        </Card>
                    </Grid>

                ))}
            </Grid>

            <Dialog open={open} onClose={handleClose}>
                <div style={{ padding: '5%' }}>
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/3588/3588294.png"
                        style={{ height: "50px", width: "50px", margin: "auto" }}
                        alt="warning"
                        className="noti-icon"
                    />
                    <DialogTitle style={{ textAlign: 'center' }}>Are you sure you would like to delete voucher?</DialogTitle>
                    <DialogContent>
                        <DialogContentText></DialogContentText>
                    </DialogContent>
                    <DialogActions style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                            fullWidth
                            variant="contained"
                            style={{
                                width: "48%", // Adjust width as needed
                                backgroundColor: "red",
                                color: "white",
                            }}
                            onClick={() => del(id)}
                        >
                            Delete
                        </Button>
                        <Button
                            variant="contained"
                            color="inherit"
                            style={{ width: "48%" }} // Adjust width as needed
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </div>
            </Dialog>


            <ToastContainer />
        </Box>
    );
}

export default voucherDashboard