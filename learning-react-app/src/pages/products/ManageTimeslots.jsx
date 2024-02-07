import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput';
import * as yup from 'yup';
import http from '../../http';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import placeholder from './media/placeholder.png'


function ManageTimeslots() {

    const [timeslotsList, setTimeslots] = useState([]);
    const [selectedDateTime, setSelectedDateTime] = useState(null);
    const formik = useFormik({
        initialValues: {
            timeslot: '',
 
        },

        validationSchema: yup.object().shape({
            name: yup.string().trim()
                .min(3, "Timeslot must be at least 3 characters")
                .max(100, 'Timeslot must be at most 100 characters')
                .required('Timeslot is required'),

        }),

        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }
            console.log("Submit button clicked");
            http.post("/Timeslot/addtimeslots", data)
                .then((res) => {
                    console.log(res.data);
                    window.location.reload();

                })
        }
    });


    useEffect(() => {
        http.get('/Timeslot/gettimeslots').then((res) => {
          setTimeslots(res.data);
            console.log(res.data.length)
        });
      }, []);


    const options = {
        filterType: 'checkbox',
    };

    const columns = ['id', 'timeslot', 'updatedAt'];

    return (
        <Container>
            <Typography variant='h5' sx={{ my: 2 }} style={{ marginTop: "5%" }}>
                Timeslots
            </Typography>

            <Box component="form" onSubmit={formik.handleSubmit}>

                <Grid container spacing={2}>
                    <Grid item xs={8} md={8} lg={8} >
                        <InputLabel>Enter Timeslots</InputLabel>
            
                        <TextField
                            fullWidth margin="normal" autoComplete="off"
                            label="Timeslots"
                            name="timeslot"
                            value={formik.values.timeslot}
                            onChange={formik.handleChange}
                            error={formik.touched.timeslot && Boolean(formik.errors.timeslot)}
                            helperText={formik.touched.timeslot && formik.errors.timeslot}
                        />


                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" type="submit" className='addbtn'>
                                Add
                            </Button>
                        </Box>

                    </Grid>
                </Grid>

            </Box>

        </Container>
    );
}
export default ManageTimeslots;