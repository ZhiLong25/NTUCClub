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
function ViewVouchers() {
  const navigate = useNavigate()
  const [vouchers, setVouchers] = useState([])

  // useEffect(() => {
  //   if (localStorage.getItem("accessToken")) {
  //     http.get('/user/auth').then((res) => {
  //       console.log(res.data.user)
  //       setUser(res.data.user);
  //     });
  //   }
  // }, []);
  useEffect(() => {
    http.get("/Voucher")    //admin can only view and edit where vouchers for everyone
      .then((res) => {
        const modifiedData = res.data.map(item => ({
          ...item,
          voucher_Validity: new Date(item.voucher_Validity).toLocaleString(),
        }));
        setVouchers(modifiedData)
      })
      
  }, [vouchers])

  const edit = (id)=>{
    navigate(`/updateVouchers/${id}`)
  }
  const del = (id)=>{
    http.delete(`/Voucher/deletebyID/${id}`).then(()=>{
      toast.success("Successfully deleted")

    }).catch((err)=>{
      toast.error("Can't delete right now")
    })
  }
  return (
    <div>
      <Grid container spacing={2} style={{ marginTop: "5%", marginBottom: "5%" }}>
        {
          vouchers.map((vouchers, i) => {
            return (
              <Grid item xs={12} md={6} lg={4} key={vouchers.id}>
                <div style={{
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
                          onClick={() => edit(vouchers.id)} id={vouchers.id}>
                          {<div style={{ display: 'flex', alignItems: 'center',fontSize:"0.7rem"  }}>
                            <EditIcon style={{ marginRight: 8, fontSize: "18px" }} />
                            Edit
                          </div>}
                        </Button>
                      </CardContent>

                      <CardContent style={{ margin: "auto",marginBottom:"-8px" }}>
                        <Button fullWidth variant="contained" sx={{ mt: 2 }}
                          style={{  backgroundColor: "red", padding: "15px", fontWeight: "bold" }}
                          onClick={() => del(vouchers.id)} id={vouchers.id}>
                          {<div style={{ display: 'flex', alignItems: 'center',fontSize:"0.7rem" }}>
                            <DeleteIcon style={{ marginRight: 8, fontSize: "18px" }} />
                            Delete
                          </div>}
                        </Button>
                      </CardContent>
                      </div>
                    </div>


                  </Card>
                </div>
              </Grid>
            );
          })
        }
      </Grid>
      <ToastContainer/>
    </div>
  )
}

export default ViewVouchers