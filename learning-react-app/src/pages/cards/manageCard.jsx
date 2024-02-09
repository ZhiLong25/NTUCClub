import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Container, Grid, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageviewIcon from '@mui/icons-material/Pageview';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Icon from 'react-icons-kit';

const ManageCard = () => {

  return (  
    <Container sx={{ marginTop: '2em', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh'}}>
      <Grid container spacing={3}>
        {/* Add Card */}
        <Grid item xs={12} md={6}>
          <Link to="/addCard" style={{ textDecoration: 'none' }} className='link'>
            <Card style={{ background: '#0BDA51', padding: '40px', cursor: 'pointer', borderRadius: '15px', border: '1px solid black', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <CardContent>
                <Typography variant="h5" component="div" align="center" color="white">
                  Add Card <AddIcon />
                </Typography>
                <Typography color="white" align="center">
                  Add a new credit card
                </Typography>

              </CardContent>
            </Card>
          </Link>
        </Grid>

        {/* View Cards */}
        <Grid item xs={12} md={6}>
          <Link to="/viewCard" style={{ textDecoration: 'none' }}>
            <Card style={{ background: '#800080', padding: '40px', cursor: 'pointer', borderRadius: '15px', border: '1px solid black', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <CardContent>
                <Typography variant="h5" component="div" align="center" color="white">
                  View Cards <PageviewIcon/>
                </Typography>
                <Typography color="white" align="center">
                  View your credit cards
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>

        {/* Update Card */}
        <Grid item xs={12} md={6}>
          <Link to="/updateCard" style={{ textDecoration: 'none' }}>
            <Card style={{ background: '#FFBF00', padding: '40px', cursor: 'pointer', borderRadius: '15px', border: '1px solid black', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <CardContent>
                <Typography variant="h5" component="div" align="center" color="white">
                  Update Card <EditIcon/>
                </Typography>
                <Typography color="white" align="center">
                  Update your credit cards
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>

        {/* Delete Card */}
        <Grid item xs={12} md={6}>
          <Link to="/delete-card" style={{ textDecoration: 'none' }}>
            <Card style={{ background: '#EE4B2B', padding: '40px' , cursor: 'pointer', borderRadius: '15px', border: '1px solid black', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <CardContent>
                <Typography variant="h5" component="div" align="center" color="white">
                  Delete Card <DeleteIcon/>
                </Typography>
                <Typography color="white" align="center">
                  Delete a credit card
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ManageCard;

