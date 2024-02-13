import React, { useEffect, useState } from 'react'
import { Box, Typography, Card, TextField, Button, Grid, CardContent } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import UserContext from '../../contexts/UserContext';
import http from '../../http';
import DescriptionIcon from '@mui/icons-material/Description';

import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import TitleIcon from '@mui/icons-material/Title';
import { EmailIcon } from '@chakra-ui/icons';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import "../styles/query.css"
function ViewQueries() {
  const navigate = useNavigate()
  const [query, setQuery] = useState([])
  const[filteredQuery,setFilteredQuery] = useState([])
  const setDesc = []
  // useEffect(() => {
  //   if (localStorage.getItem("accessToken")) {
  //     http.get('/user/auth').then((res) => {
  //       console.log(res.data.user)
  //       setUser(res.data.user);
  //     });
  //   }
  // }, []);

  const allClick = () => {
    
    setFilteredQuery(query)
      document.querySelector(".AllClick").style.textDecoration = "underline";
      document.querySelector(".PositiveClick").style.textDecoration = "none";
      document.querySelector(".NegativeClick").style.textDecoration = "none";
      document.querySelector(".NeutralClick").style.textDecoration = "none";
  
  }
  const positiveClick = () => {
    
    const filteredQueries = query.filter(item => item.feelings === "Positive");
    setFilteredQuery(filteredQueries);
    document.querySelector(".AllClick").style.textDecoration = "none";
      document.querySelector(".PositiveClick").style.textDecoration = "underline";
      document.querySelector(".NegativeClick").style.textDecoration = "none";
      document.querySelector(".NeutralClick").style.textDecoration = "none";
  }
  const negativeClick = () => {
    const filteredQueries = query.filter(item => item.feelings === "Negative");
    setFilteredQuery(filteredQueries);
    document.querySelector(".AllClick").style.textDecoration = "none";
      document.querySelector(".PositiveClick").style.textDecoration = "none";
      document.querySelector(".NegativeClick").style.textDecoration = "underline";
      document.querySelector(".NeutralClick").style.textDecoration = "none";
  }
  const neutralClick = () => {
    const filteredQueries = query.filter(item => item.feelings === "Neutral");
    setFilteredQuery(filteredQueries);
    document.querySelector(".AllClick").style.textDecoration = "none";
      document.querySelector(".PositiveClick").style.textDecoration = "none";
      document.querySelector(".NegativeClick").style.textDecoration = "none";
      document.querySelector(".NeutralClick").style.textDecoration = "underline";
  }
  useEffect(() => {
    console.log("useEffect triggered");
    http.get(`/Query`)    //admin can only view and edit where vouchers for everyone
      .then((res) => {
        const modifiedData = res.data.map(item => ({
          ...item,
        }));
        setQuery(modifiedData)
        for (let i = 0; i < modifiedData.length; i++) {
          setDesc.push(modifiedData[i].queryDescription)
        }
        console.log(setDesc)
        const queryParams = setDesc.map(q => `questions=${encodeURIComponent(q)}`).join('&');

        fetch(`http://127.0.0.1:8000/?${queryParams}`).then((res) => {
          return res.json(); // Parse the response body as JSON
        }).then((data) => {
          console.log(data.response); // Access the response data
          for (let i = 0; i < modifiedData.length; i++) {
            modifiedData[i].feelings = data.response[i].sentiment
          }
          console.log(modifiedData)
          setFilteredQuery(modifiedData)
          document.querySelector(".AllClick").style.textDecoration = "underline";

        }).catch((error) => {
          console.error('Error:', error);
        });

      })

  }, [])

  const reply = (id) => {
    navigate(`/ReplyQueries/${id}`);
  };
  const del = (id) => {
    http.delete(`/Query/DeletequeryID/${id}`).then(() => {
      toast.success("Successfully deleted");
      setFilteredQuery((prevQueries) => prevQueries.filter((query) => query.id !== id));

    }).catch((err) => {
      toast.error("Can't delete right now")
    })
  }
  return (
    <div style={{ height: "70dvh" }}>
      <div style={{ height: "100%" }}>
        <Card className="filterbar"  >
          <div style={{ borderRight: "1px solid black", paddingTop: "1%", paddingRight: "5%", paddingLeft: "5%", height: "60%", marginTop: "2.5%" }}
            onClick={allClick} class="AllClick">
            All
          </div>
          <div style={{ borderRight: "1px solid black", paddingTop: "1%", paddingRight: "5%", paddingLeft: "5%", height: "60%", marginTop: "2.5%" }}
            onClick={positiveClick} className='PositiveClick'>
            Positive
          </div>
          <div style={{ borderRight: "1px solid black", paddingTop: "1%", paddingRight: "5%", paddingLeft: "5%", height: "60%", marginTop: "2.5%" }}
            onClick={negativeClick} className='NegativeClick'>
            Negative
          </div>
          <div style={{ paddingTop: "1%", paddingLeft: "5%", height: "60%", marginTop: "2.5%" }}
            onClick={neutralClick} className='NeutralClick'>
            Neutral
          </div>
        </Card>
        <Card style={{ height: "80%", marginTop: "5%", overflow: "hidden", overflowY: "sroll" }}>
          <div style={{ overflowY: "scroll", height: "100%" }}>
            {
              filteredQuery.map((query, i) => {
                return (
                  <Grid key={query.id}>
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

                        <CardContent style={{ margin: "auto" }}>
                          <Typography
                            style={{
                              fontWeight: "bold",
                              textAlign: "left",
                              color: query.queryReply === 'NotReplied' ? "red" : "green",
                              fontSize: "1rem"
                            }}
                          >
                            Status: {query.queryReply === 'NotReplied' ? "Not Replied" : "Replied"}
                          </Typography>
                        </CardContent>


                        <div style={{ height: "4%", display: "flex", flexDirection: "row" }}>
                          <CardContent style={{ margin: "auto", flex: "2" }}>

                            
                          <Box sx={{}}
                              color="text.secondary">
                              <Typography style={{ fontWeight: "bold", textAlign: "center", color: "black", fontSize: "0.7rem" }}>
                                {<div style={{ display: 'flex', alignItems: 'center' }}>
                                  <SentimentSatisfiedIcon style={{ marginRight: 8, fontSize: "18px" }} />
                                  Feelings: {query.feelings}
                                </div>}
                              </Typography>
                            </Box>


                          </CardContent>
                          
                          <CardContent style={{ margin: "auto", flex: "2" }}>

                            
                            <Box sx={{}}
                              color="text.secondary">
                              <Typography style={{ fontWeight: "bold", textAlign: "center", color: "black", fontSize: "0.7rem" }}>
                                {<div style={{ display: 'flex', alignItems: 'center' }}>
                                  <EmailIcon style={{ marginRight: 8, fontSize: "18px" }} />
                                  Email: {query.email}
                                </div>}
                              </Typography>
                            </Box>


                          </CardContent>

                          <CardContent style={{ margin: "auto", flex: "2" }}>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                              color="text.secondary">
                              <Typography style={{ fontWeight: "bold", textAlign: "center", color: "black", fontSize: "0.7rem" }}>
                                {<div style={{ display: 'flex', alignItems: 'center' }}>
                                  <TitleIcon style={{ marginRight: 8, fontSize: "18px" }} />
                                  Subject: {query.querySubject}
                                </div>}
                              </Typography>
                            </Box>
                          </CardContent>
                          <CardContent style={{ margin: "auto", flex: "2" }}>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0 }}
                              color="text.secondary">
                              <Typography style={{ fontWeight: "bold", textAlign: "center", color: "black", fontSize: "0.7rem" }}>
                                {<div style={{ display: 'flex', alignItems: 'center' }}>
                                  <DescriptionIcon style={{ marginRight: 8, fontSize: "18px" }} />
                                  Description: {query.queryDescription}
                                </div>}
                              </Typography>
                            </Box>
                          </CardContent>


                          <CardContent style={{ margin: "auto" }}>
                            <Button fullWidth variant="contained" sx={{}}
                              style={{ backgroundColor: "#63C5DA", padding: "15px", fontWeight: "bold" }}
                              onClick={() => reply(query.id)} id={query.id}>
                              {<div style={{ display: 'flex', alignItems: 'center', fontSize: "0.7rem" }}>
                                <EditIcon style={{ marginRight: 8, fontSize: "18px" }} />
                                 Reply
                              </div>}
                            </Button>
                          </CardContent>
                          <CardContent style={{ margin: "auto" }}>
                            <Button fullWidth variant="contained" sx={{ }}
                              style={{ backgroundColor: "red", padding: "15px", fontWeight: "bold" }}
                              onClick={() => del(query.id)} id={query.id}>
                              {<div style={{ display: 'flex', alignItems: 'center', fontSize: "0.7rem" }}>
                                <DeleteIcon style={{ marginRight: 8, fontSize: "18px" }} />
                                Delete
                              </div>}
                            </Button>
                          </CardContent>
                          
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
      <ToastContainer />
    </div>
  )
}
export default ViewQueries