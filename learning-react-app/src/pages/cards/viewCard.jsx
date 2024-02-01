import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, Button, Grid, CardContent } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import http from '../../http';
import { useNavigate } from 'react-router-dom';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import DescriptionIcon from '@mui/icons-material/Description';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

function ViewCard() {
  const navigate = useNavigate();
  const [cardsList, setCardList] = useState([]);
  
  const getCards = () => {
    http.get('/Card/GetCard').then((res) => {
      setCardList(res.data);
    })
  }

  useEffect(() => {
    http.get('/Card/GetCard').then((res) => {
      getCards();
    });
  }, []);


  const edit = (id) => {
    navigate(`/updateCard/${id}`);
  };

  const del = (id) => {
    http.delete(`/Card/DeleteCardById/${id}`).then(() => {
      toast.success("Card successfully deleted") 
    }).catch((err) => {
      toast.error("Failed to delete card")
    });
  };

  return (
    <div>
      <Grid container spacing={2} style={{ marginTop: "5%", marginBottom: "5%" }}>
        {
          cardsList.map((cards, i) => {
            return (
              <Grid item xs={12} md={6} lg={4} key={cards.id}>
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
                              Card Number: {cards.card_Number}
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
                              Card Type: {cards.card_Name}
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
                                Owner: {cards.first_Name} {cards.last_Name}
                              </div>}
                            </Typography>
                          </Box>
                          </CardContent>
                    
                      <div style={{display:"flex",alignItems:"center"}}>

                      <CardContent style={{ margin: "auto" }}>
                        <Button fullWidth variant="contained" sx={{ mt: 2 }}
                          style={{  backgroundColor: "#63C5DA", padding: "15px", fontWeight: "bold" }}
                          onClick={() => edit(cards.id)} id={cards.id}>
                          {<div style={{ display: 'flex', alignItems: 'center',fontSize:"0.7rem"  }}>
                            <EditIcon style={{ marginRight: 8, fontSize: "18px" }} />
                            Edit
                          </div>}
                        </Button>
                      </CardContent>

                      <CardContent style={{ margin: "auto",marginBottom:"-8px" }}>
                        <Button fullWidth variant="contained" sx={{ mt: 2 }}
                          style={{  backgroundColor: "red", padding: "15px", fontWeight: "bold" }}
                          onClick={() => del(cards.id)} id={cards.id}>
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

export default ViewCard;
