import React, { useEffect, useState } from 'react'
import { Box, Typography, Card, TextField, Button, Grid, CardContent } from '@mui/material';
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
import AspectRatio from '@mui/joy/AspectRatio';

function ViewVouchers() {
  const navigate = useNavigate()
  const [vouchers, setVouchers] = useState([])
  const [user, setUser] = useState()

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/user/auth').then((res) => {
        console.log(res.data.user)
        setUser(res.data.user);
      });
    }
  }, []);

  useEffect(() => {
    http.get("/Voucher")    //admin can only view and edit where vouchers for everyone
      .then((res) => {
        const modifiedData = res.data.map(item => ({
          ...item,
          voucher_Validity: new Date(item.voucher_Validity).toLocaleString(),
        }));
        setVouchers(modifiedData)
      })

  }, [])

  const claim = (id) => {
    console.log(user.id)
    http.put(`User/claim/${user.id}/${id}`).then(() => {
      toast.success("Successfully claimed")
    }).catch((err) => {
      toast.error(err)
    })
  }

  return (
    <div>
      <Typography variant="h5" sx={{ mt: 8, fontWeight: "bold" }}>
        Vouchers
      </Typography>

      <Grid container spacing={2} style={{ marginTop: "1%", marginBottom: "5%" }}>
        {
          vouchers.map((voucher, i) => {
            return (
              <Grid item xs={12} md={6} lg={4} key={voucher.id}>
                {/* <div style={{
                  background: "linear-gradient(45deg, rgba(255, 99, 71, 0.4) 0%, rgba(255, 99, 71, 0.7) 100%)",
                  borderRadius: "50px",
                  boxShadow: "4px 4px 8px rgba(255, 99, 71, 0.5)", marginBottom: "5%", height: "20rem", width: "100%", display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Card style={{

                    boxShadow: "none",
                    width: "75%",
                    height: "90%",
                    background: "transparent",

                  }}>

                    <div style={{ height: "15vh" }}>
                      <CardContent style={{ margin: "auto" }}>

                        <Box sx={{}}
                          color="text.secondary">
                          <Typography style={{ fontWeight: "bold", textAlign: "center", color: "black", fontSize: "0.7rem" }}>
                            {<div style={{ display: 'flex', alignItems: 'center' }}>
                              <DriveFileRenameOutlineIcon style={{ marginRight: 8, fontSize: "18px" }} />
                              Name: {vouchers.voucher_Name}
                            </div>}
                          </Typography>
                        </Box>


                      </CardContent>

                      <CardContent style={{ margin: "auto" }}>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                          color="text.secondary">
                          <Typography style={{ fontWeight: "bold", textAlign: "center", color: "black", fontSize: "0.7rem" }}>
                            {<div style={{ display: 'flex', alignItems: 'center' }}>
                              <DescriptionIcon style={{ marginRight: 8, fontSize: "18px" }} />
                              Description: {vouchers.voucher_Details}
                            </div>}
                          </Typography>
                        </Box>
                        </CardContent>
                        <CardContent style={{ margin: "auto" }}>

                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0 }}
                            color="text.secondary">
                            <Typography style={{ fontWeight: "bold", textAlign: "center", color: "black", fontSize: "0.7rem" }}>
                              {<div style={{ display: 'flex', alignItems: 'center' }}>
                                <ProductionQuantityLimitsIcon style={{ marginRight: 8, fontSize: "18px" }} />
                                Quantity: {vouchers.voucher_Quantity}
                              </div>}
                            </Typography>
                          </Box>


                        

                      </CardContent>
                      <CardContent style={{ margin: "auto" }}>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0 }}
                          color="text.secondary">
                          <Typography style={{ fontWeight: "bold", textAlign: "center", color: "black", fontSize: "0.7rem" }}>
                            {<div style={{ display: 'flex', alignItems: 'center' }}>
                              <AccessTimeIcon style={{ marginRight: 8, fontSize: "18px" }} />
                              Validity: {vouchers.voucher_Validity}
                            </div>}
                          </Typography>
                        </Box>


                      </CardContent>
                      <div style={{display:"flex",alignItems:"center"}}>

                      <CardContent style={{ margin: "auto" }}>
                        <Button fullWidth variant="contained" sx={{ mt: 2 }}
                          style={{  backgroundColor: "#63C5DA", padding: "15px", fontWeight: "bold" }}
                          onClick={() => claim(vouchers.id)} id={vouchers.id}>
                          
                            Claim
                          
                        </Button>
                      </CardContent>

                      
                      </div>
                    </div>


                  </Card>
                </div> */}

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
                    <Typography style={{ fontWeight: "bold", textAlign: "center", color: "black", fontSize: "1.2rem", flex: "3" }}>
                      {<div style={{ display: 'flex', alignItems: 'center' }}>
                        Voucher Details
                      </div>}
                    </Typography>
                  </CardContent>
                  <CardContent style={{ margin: "auto" }}>
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
                        {<div style={{ display: 'flex', alignItems: 'center' }}>
                          <AccessTimeIcon style={{ marginRight: 8, fontSize: "18px" }} />
                          Validity: {voucher.voucher_Validity}
                        </div>}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardContent style={{ margin: "auto" }}>
                    <Button fullWidth variant="contained" sx={{ mt: 2 }}
                      style={{ backgroundColor: "#03C04A", padding: "15px", fontWeight: "bold" }}
                      onClick={() => claim(voucher.id)} id={voucher.id}>

                      Claim

                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        }
      </Grid>
      <ToastContainer />
    </div>
  )
}

export default ViewVouchers