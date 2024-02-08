import React, { useEffect, useState } from 'react'
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
import AspectRatio from '@mui/joy/AspectRatio';

function voucherDashboard() {
    const navigate = useNavigate()
    const [vouchers, setVouchers] = useState([])
    const [open, setOpen] = useState(false);
    const [id, setID] = useState(null);

    // useEffect(() => {
    //   if (localStorage.getItem("accessToken")) {
    //     http.get('/user/auth').then((res) => {
    //       console.log(res.data.user)
    //       setUser(res.data.user);
    //     });
    //   }
    // }, []);

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
    }, [])

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
        <Box>
            <Typography variant="h5" sx={{ mt: 8, fontWeight:"bold" }}>
                Vouchers
            </Typography>

            <Grid container spacing={2} style={{ marginTop: "1%", marginBottom: "5%" }}>
                {vouchers.map((voucher, i) => (
                    //         <Grid item xs={12} md={6} lg={4} key={voucher.id}>
                    //             <div style={{
                    //                 background: "linear-gradient(45deg, rgba(255, 99, 71, 0.4) 0%, rgba(255, 99, 71, 0.7) 100%)",
                    //                 borderRadius: "50px",
                    //                 boxShadow: "4px 4px 8px rgba(255, 99, 71, 0.5)",
                    //                 marginBottom: "5%",
                    //                 height: "30rem",
                    //                 width: "100%",
                    //                 display: "flex",
                    //                 alignItems: "center",
                    //                 justifyContent: "center"
                    //             }}>
                    //                 <Card style={{
                    //                     boxShadow: "none",
                    //                     width: "75%",
                    //                     height: "90%",
                    //                     background: "transparent",
                    //                 }}>

                    //                     <div style={{ height: "15vh" }}>
                    //                     {
                    //                                 vouchers.voucher_Image && (
                    //                                     <AspectRatio>
                    //                                         <Box component="img"
                    //                                             src={`${import.meta.env.VITE_FILE_BASE_URL}${vouchers.voucher_Image}`}
                    //                                             alt="tutorial">
                    //                                         </Box>
                    //                                     </AspectRatio>
                    //                                 )
                    //                             }
                    //                         <CardContent style={{ margin: "auto" }}>
                    //                             <Box sx={{}}
                    //                                 color="text.secondary">
                    //                                 <Typography style={{ fontWeight: "bold", textAlign: "center", color: "black", fontSize: "0.7rem" }}>
                    //                                     {<div style={{ display: 'flex', alignItems: 'center' }}>
                    //                                         <DriveFileRenameOutlineIcon style={{ marginRight: 8, fontSize: "18px" }} />
                    //                                         Name: {voucher.voucher_Name}
                    //                                     </div>}
                    //                                 </Typography>
                    //                             </Box>
                    //                         </CardContent>

                    //                         <CardContent style={{ margin: "auto" }}>
                    //                             <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                    //                                 color="text.secondary">
                    //                                 <Typography style={{ fontWeight: "bold", textAlign: "center", color: "black", fontSize: "0.7rem" }}>
                    //                                     {<div style={{ display: 'flex', alignItems: 'center' }}>
                    //                                         <DescriptionIcon style={{ marginRight: 8, fontSize: "18px" }} />
                    //                                         Description: {voucher.voucher_Details}
                    //                                     </div>}
                    //                                 </Typography>
                    //                             </Box>
                    //                         </CardContent>

                    //                         <CardContent style={{ margin: "auto" }}>
                    //                             <Box sx={{ display: 'flex', alignItems: 'center', mb: 0 }}
                    //                                 color="text.secondary">
                    //                                 <Typography style={{ fontWeight: "bold", textAlign: "center", color: "black", fontSize: "0.7rem" }}>
                    //                                     {<div style={{ display: 'flex', alignItems: 'center' }}>
                    //                                         <ProductionQuantityLimitsIcon style={{ marginRight: 8, fontSize: "18px" }} />
                    //                                         Quantity: {voucher.voucher_Quantity}
                    //                                     </div>}
                    //                                 </Typography>
                    //                             </Box>
                    //                         </CardContent>

                    //                         <CardContent style={{ margin: "auto" }}>
                    //                             <Box sx={{ display: 'flex', alignItems: 'center', mb: 0 }}
                    //                                 color="text.secondary">
                    //                                 <Typography style={{ fontWeight: "bold", textAlign: "center", color: "black", fontSize: "0.7rem" }}>
                    //                                     {<div style={{ display: 'flex', alignItems: 'center' }}>
                    //                                         <AccessTimeIcon style={{ marginRight: 8, fontSize: "18px" }} />
                    //                                         Validity: {voucher.voucher_Validity}
                    //                                     </div>}
                    //                                 </Typography>
                    //                             </Box>
                    //                         </CardContent>

                    //                         <div style={{ display: "flex", alignItems: "center" }}>
                    //                             <CardContent style={{ margin: "auto" }}>
                    //                                 <Button fullWidth variant="contained" sx={{ mt: 2 }}
                    //                                     style={{ backgroundColor: "#63C5DA", padding: "15px", fontWeight: "bold" }}
                    //                                     onClick={() => edit(voucher.id)} id={voucher.id}>
                    //                                     {<div style={{ display: 'flex', alignItems: 'center', fontSize: "0.7rem" }}>
                    //                                         <EditIcon style={{ marginRight: 8, fontSize: "18px" }} />
                    //                                         Edit
                    //                                     </div>}
                    //                                 </Button>
                    //                             </CardContent>

                    //                             <CardContent style={{ margin: "auto", marginBottom: "-8px" }}>
                    //                                 <Button fullWidth variant="contained" sx={{ mt: 2 }}
                    //                                     style={{ backgroundColor: "red", padding: "15px", fontWeight: "bold" }}
                    //                                     onClick={() => del(voucher.id)} id={voucher.id}>
                    //                                     {<div style={{ display: 'flex', alignItems: 'center', fontSize: "0.7rem" }}>
                    //                                         <DeleteIcon style={{ marginRight: 8, fontSize: "18px" }} />
                    //                                         Delete
                    //                                     </div>}
                    //                                 </Button>
                    //                             </CardContent>
                    //                         </div>
                    //                     </div>
                    //                 </Card>
                    //             </div>
                    //         </Grid>
                    <Grid item xs={12} md={6} lg={4} key={voucher.id}>
                        <Card>
                            {
                                voucher.voucher_Image && (
                                    <AspectRatio>
                                        <Box component="img"
                                            src={`${import.meta.env.VITE_FILE_BASE_URL}${voucher.voucher_Image}`}
                                            alt="tutorial">
                                        </Box>
                                    </AspectRatio>
                                )
                            }
                            <CardContent style={{ margin: "auto" }}>
                                <Box sx={{ display: 'flex', mb: 5, mt: 1 }}
                                    color="text.secondary">
                                    <Typography style={{ fontWeight: "bold", textAlign: "center", color: "black", fontSize: "1.2rem", flex: "3" }}>
                                        {<div style={{ display: 'flex', alignItems: 'center' }}>
                                            Voucher Details
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
                                    <Typography style={{ fontWeight: "bold", textAlign: "center", color: "black", fontSize: "0.85rem", flex: "3" }}>
                                        {<div style={{ display: 'flex', alignItems: 'center' }}>
                                            <DriveFileRenameOutlineIcon style={{ marginRight: 8, fontSize: "18px" }} />
                                            Name: {voucher.voucher_Name}
                                        </div>}
                                    </Typography>
                                    
                                </Box>
                            </CardContent>

                            <CardContent style={{ margin: "auto" }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                    color="text.secondary">
                                    <Typography style={{ fontWeight: "bold", textAlign: "center", color: "black", fontSize: "0.85rem" }}>
                                        {<div style={{ display: 'flex', alignItems: 'center' }}>
                                            <DescriptionIcon style={{ marginRight: 8, fontSize: "18px" }} />
                                            Description: {voucher.voucher_Details}
                                        </div>}
                                    </Typography>
                                </Box>
                            </CardContent>

                            <CardContent style={{ margin: "auto" }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0 }}
                                    color="text.secondary">
                                    <Typography style={{ fontWeight: "bold", textAlign: "center", color: "black", fontSize: "0.85rem" }}>
                                        {<div style={{ display: 'flex', alignItems: 'center' }}>
                                            <ProductionQuantityLimitsIcon style={{ marginRight: 8, fontSize: "18px" }} />
                                            Quantity: {voucher.voucher_Quantity}
                                        </div>}
                                    </Typography>
                                </Box>
                            </CardContent>

                            <CardContent style={{ margin: "auto" }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0 }}
                                    color="text.secondary">
                                    <Typography style={{ fontWeight: "bold", textAlign: "center", color: "black", fontSize: "0.85rem" }}>
                                        {<div style={{ display: 'flex', alignItems: 'center'}}>
                                            <AccessTimeIcon style={{ marginRight: 8, fontSize: "18px" }} />
                                            Validity: {voucher.voucher_Validity}
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