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

import MUIDataTable from "mui-datatables";


function ManageVendor() {

    const [serviceList, setServiceList] = useState([]);
    const [imageFile, setImageFile] = useState(null);

    const onFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {

            if (file.size > 1024 * 1024) {
                toast.error('Maximum file size is 1MB');
                return;
            }

            let formData = new FormData();
            formData.append('file', file);
            http.post('/file/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((res) => {
                    setImageFile(res.data.filename);
                })
                .catch(function (error) {
                    console.log(error.response);
                });
        }
    };

    const formik = useFormik({
        initialValues: {
            image: '',
            name: '',

 
        },

        validationSchema: yup.object().shape({
            name: yup.string().trim()
                .min(3, "Name must be at least 3 characters")
                .max(100, 'Name must be at most 100 characters')
                .required('Name is required'),

        }),

        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }
            console.log("Submit button clicked");
            http.post("/Vendor/addvendor", data)
                .then((res) => {
                    console.log(res.data);
                    window.location.reload();

                })
        }
    });

    const getVendor = () => {
        http.get('/Vendor/getvendor').then((res) => {
          console.log(res.data)
          setServiceList(res.data);
        });
      };

    useEffect(() => {
        http.get('/Vendor/getvendor').then((res) => {
          getVendor();

        });
      }, []);


    const options = {
        filterType: 'checkbox',
    };

    const columns = ['id', 'name', 'updatedAt'];

    return (
        <Container>
            <Typography variant='h5' sx={{ my: 2 }} style={{ marginTop: "5%" }}>
                Vendors
            </Typography>

            {/* <Box component="form" onSubmit={formik.handleSubmit}>

                <Grid container spacing={2}>
                    <Grid item xs={4} md={4} lg={4} >
                        <Box sx={{ textAlign: 'center', mt: 2 }} >


                            {
                                imageFile ? (
                                    <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                                        <img alt="product" src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`} className='image-insert'/>
                                    </Box>
                                ) : (
                                    <img src={placeholder} alt="placeholder" className='image-insert'/>
                                )
                            }
                            <Button variant="contained" component="label" style={{ marginTop: "20px"}}>
                                Upload Image
                                <input hidden accept="image/*" multiple type="file" onChange={onFileChange} />
                            </Button>
                           
                        </Box>
                    </Grid>
                    <Grid item xs={8} md={8} lg={8} >
                        <InputLabel>Enter New Vendor Name</InputLabel>

                        <TextField
                            fullWidth margin="normal" autoComplete="off"
                            label="Title"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />


                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" type="submit" className='addbtn'>
                                Add
                            </Button>
                        </Box>

                    </Grid>
                </Grid>

            </Box> */}


            <Box>

                {/* <Typography variant='h5' sx={{ my: 2 }} style={{ marginTop: "5%" }}>
                    View and Manage Vendor
                </Typography> */}
                
                <MUIDataTable title="Vendor List" data={serviceList} columns={columns} options={options} />



            </Box>

        </Container>
    );
}
export default ManageVendor;