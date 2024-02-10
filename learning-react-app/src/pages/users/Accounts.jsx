import React, { useEffect, useState } from 'react'
import "../styles/account.css"
import http from "../../http"
import { Box, Typography, Card, Button, Grid, CardContent } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';

function Accounts() {
  const [account, setAccount] = useState([])

  const userClick = () => {
    const user = "User"
    http.get(`User/getAllUser/${user}`).then((res) => {
      setAccount(res.data)
      document.querySelector(".userClick").style.textDecoration = "underline";
      document.querySelector(".adminClick").style.textDecoration = "none";
      document.querySelector(".merchantClick").style.textDecoration = "none";
    })
  }
  const adminClick = () => {
    const user = "Admin"
    http.get(`User/getAllUser/${user}`).then((res) => {
      document.querySelector(".adminClick").style.textDecoration = "underline";
      document.querySelector(".userClick").style.textDecoration = "none";
      document.querySelector(".merchantClick").style.textDecoration = "none";
    
      setAccount(res.data)
    })

  }
  const merchantClick = () => {
    const user = "Merchant"
    http.get(`User/getAllUser/${user}`).then((res) => {
      setAccount(res.data)
      document.querySelector(".merchantClick").style.textDecoration = "underline";
      document.querySelector(".userClick").style.textDecoration = "none";
      document.querySelector(".adminClick").style.textDecoration = "none";
    })
  }
 const del=(id)=>{
  http.delete(`User/Delete/${id}`).then(()=>{
    toast.success("Account deleted Successfully")
    window.location.reload()
  }).catch((err)=>{
    toast.error("Unable to delete account")
  })
 } 
  
  return (
    <div style={{height:"80dvh"}}>
      <div style={{ height: "100%" }}>
        <Card className="filterbar" >
          <div style={{ borderRight: "1px solid black", paddingTop: "1%", paddingRight: "5%", paddingLeft: "5%", height: "60%", marginTop: "2.5%" }}
            onClick={ userClick }class="userClick">
            Users
          </div>
          <div style={{ borderRight: "1px solid black", paddingTop: "1%", paddingRight: "5%", paddingLeft: "5%", height: "60%", marginTop: "2.5%" }}
            onClick={ adminClick } className='adminClick'>
            Admin
          </div>
          <div style={{ paddingTop: "1%", paddingLeft: "5%", height: "60%", marginTop: "2.5%" }}
            onClick={ merchantClick } className='merchantClick'>
            Merchants
          </div>
        </Card>
        <Card style={{ height: "80%", marginTop: "5%",overflow:"hidden",overflowY:"sroll" }}>
        <div style={{ overflowY: "scroll", height: "100%" }}>
          {
            account.map((accounts, i) => {
              return (
                <Grid  key={accounts.id}>
                  <div style={{
                    background: "linear-gradient(45deg, rgba(255, 99, 71, 0.4) 0%, rgba(255, 99, 71, 0.7) 100%)",
                    
                    boxShadow: "4px 4px 8px rgba(255, 99, 71, 0.5)", marginBottom: "5%", height: "3%", width: "100%"
                  }}>
                    <Card style={{

                      boxShadow: "none",
                      width: "100%",
                      height: "90%",
                      background: "transparent",

                    }}>

                      <div style={{ height: "4%",display: "flex", flexDirection:"row" }}>
                        <CardContent style={{ margin: "auto" ,flex:"2"}}>

                          <Box sx={{}}
                            color="text.secondary">
                            <Typography style={{ fontWeight: "bold", textAlign: "center", color: "black", fontSize: "0.7rem" }}>
                              {<div style={{ display: 'flex', alignItems: 'center' }}>
                                <PersonIcon style={{ marginRight: 8, fontSize: "18px" }} />
                                Name: {accounts.name}
                              </div>}
                            </Typography>
                          </Box>


                        </CardContent>

                        <CardContent style={{ margin: "auto" ,flex:"2"}}>

                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                            color="text.secondary">
                            <Typography style={{ fontWeight: "bold", textAlign: "center", color: "black", fontSize: "0.7rem" }}>
                              {<div style={{ display: 'flex', alignItems: 'center' }}>
                                <EmailIcon style={{ marginRight: 8, fontSize: "18px" }} />
                                Email: {accounts.email}
                              </div>}
                            </Typography>
                          </Box>
                        </CardContent>
                        <CardContent style={{ margin: "auto" ,flex:"2"}}>

                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0 }}
                            color="text.secondary">
                            <Typography style={{ fontWeight: "bold", textAlign: "center", color: "black", fontSize: "0.7rem" }}>
                              {<div style={{ display: 'flex', alignItems: 'center' }}>
                                <PhoneIcon style={{ marginRight: 8, fontSize: "18px" }} />
                                Phone: {accounts.phone}
                              </div>}
                            </Typography>
                          </Box>
                        </CardContent>
                        
                        
                        {accounts.userType != "Admin"  ?(
                          <CardContent style={{ margin: "auto",height:"8%",flex:"1",width:"70%" }}>
                            <Button fullWidth variant="contained" sx={{ mt: 2 }}
                              style={{ backgroundColor: "red", padding: "15px", fontWeight: "bold" }}
                              onClick={() => del(accounts.id)} id={accounts.id}>
                              {<div style={{ display: 'flex', alignItems: 'center', fontSize: "0.7rem" }}>
                                <DeleteIcon style={{ marginRight: 8, fontSize: "0.7rem" }} />
                                Delete
                              </div>}
                            </Button>
                          </CardContent>
                        ):(
                          <CardContent style={{ margin: "auto",height:"8%",flex:"1",width:"70%" }}>
                          <Button fullWidth variant="contained" sx={{ mt: 2 }} disabled="true"
                            style={{ backgroundColor: "gray", padding: "15px", fontWeight: "bold" }}
                            onClick={() => del(accounts.id)} id={accounts.id}>
                            {<div style={{ display: 'flex', alignItems: 'center', fontSize: "0.7rem" }}>
                              <DeleteIcon style={{ marginRight: 8, fontSize: "0.7rem" }} />
                              Delete
                            </div>}
                          </Button>
                        </CardContent>
                        )}
                      </div>


                    </Card>
                  </div>
                </Grid>
              );
            })
          }
          </div>
        </Card>
      </div>
      <ToastContainer/>
    </div>
  )
}

export default Accounts