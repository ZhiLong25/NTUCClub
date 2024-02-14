    import React, { useState, useEffect } from 'react';
    import { useFormik } from 'formik';
    import * as yup from 'yup';
    import http from '../../http';
    import { Container, Box, Rating, Typography, TextField, Button, InputLabel, Select, MenuItem, Grid, Chip } from '@mui/material';
    import ReactQuill from 'react-quill';
    import { useNavigate, useParams } from 'react-router-dom';

    function AddReviews() {

        const [value, setValue] = React.useState(2);
        const [imageFile, setImageFile] = useState('');
        const [user, setUser] = useState(null);
    
        useEffect(() => {
            http.get('/user/auth').then((res) => {
                setUser(res.data.user);
            });
        }, []);

        const { id } = useParams();
        const navigate = useNavigate();
                
        const formik = useFormik({
            initialValues: {
                serviceId: 1, // Set to 1 if id is null
                User : user ? user.name : '' ,
                rating: 0,
                subject: '',
                description: '',
                image: 'placeholder.png',
            },
            enableReinitialize: true,

            validationSchema: yup.object().shape({
                subject: yup.string().trim()
                    .min(3, "Subject must be at least 3 characters")
                    .max(100, 'Subject must be at most 100 characters')
                    .required('Subject is required'),
    
                description: yup.string().trim()
                    .min(3, "Description must be at least 3 characters")
                    .max(100, 'Description must be at most 100 characters')
                    .required('Description is required'),
    
            }),
    
            onSubmit: (data) => {
                if (imageFile) {
                    data.image = imageFile;
                }
                console.log("Submit button clicked");
                http.post("/Review/addreview", data)
                    .then((res) => {
                        console.log(res.data);
                        navigate("/")
                    })
            }
        });


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

        return (
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Container className='main-container'>
                    <Grid container spacing={2}>

                        <Grid item xs={4} md={4} lg={4} >
                            <InputLabel id="rating">Rating</InputLabel>


                            <Rating
                                size="large"
                                name="rating"
                                value={formik.values.rating}
                                onChange={(event, newValue) => {
                                    formik.setFieldValue('rating', newValue);
                                }}
                            />

                            <InputLabel id="title">Subject</InputLabel>

                            <TextField
                                fullWidth margin="normal" autoComplete="off"
                                label="Subject"
                                name="subject"
                                value={formik.values.subject}
                                onChange={formik.handleChange}
                                error={formik.touched.subject && Boolean(formik.errors.subject)}
                                helperText={formik.touched.subject && formik.errors.subject}
                            />
                        </Grid>
                    </Grid>


                    <ReactQuill
                        style={{ borderRadius: "5px" }}
                        value={formik.values.description}
                        onChange={(value) => formik.setFieldValue('description', value)}
                        modules={{
                            toolbar: [
                                [{ header: [1, 2, false] }],
                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                [{ list: 'ordered' }, { list: 'bullet' }],
                                ['link', 'image'],
                                ['clean'],
                            ],
                        }}
                        formats={[
                            'header',
                            'bold', 'italic', 'underline', 'strike', 'blockquote',
                            'list', 'bullet',
                            'link', 'image',
                        ]}
                        placeholder='Enter description here...'
                    />
                    {formik.touched.description && formik.errors.description && (
                        <div class="css-1wc848c-MuiFormHelperText-root" style={{ color: '#D32F2F' }}>{formik.errors.description}</div>
                    )}

                    {/* ADD IMAGE */}
                    <Box sx={{ textAlign: 'center', mt: 2 }} >


                        <Button variant="contained" component="label" style={{ marginTop: "20px", float: 'left', background: 'transparent', color: "black", border: "2px solid #e81515" }}>
                            Upload Image
                            <input hidden accept="image/*" multiple type="file" onChange={onFileChange} />
                        </Button>
                    </Box>


                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" type="submit" className='addbtn'>
                            Add
                        </Button>
                    </Box>
                </Container>


            </Box>
        )
    }

    export default AddReviews