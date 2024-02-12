import React, { useEffect, useState } from 'react'
import { Box, Typography, Card, TextField, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import UserContext from '../../contexts/UserContext';
import http from '../../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import SubjectIcon from '@mui/icons-material/Subject';
function AddQueries() {

    const [user, setUser] = useState(null)

    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            http.get('/user/auth').then((res) => {

                console.log(res.data.user.UserType)
                setUser(res.data.user.Email);
            });
        }
    }, []);

    const formik = useFormik({
        initialValues: {
            Email: "",
            QuerySubject: "",
            QueryDescription: ""
        },
        validationSchema: yup.object({
            QueryDescription: yup.string().trim()
                .min(3, "Descriptions must be at least 3 characters")
                .max(450, 'Descriptions must be at most 450 characters')
                .required('Description is required'),
                Email: yup.string().trim()
                .email('Enter a valid email')
                .max(50, 'Email must be at most 50 characters')
                .required('Email is required'),
            QuerySubject: yup.string().trim()
                .min(3, "Subject must be at least 3 characters")
                .max(100, 'Subject must be at most 100 characters')
                .required('Description is required'),


        }),
        onSubmit: (data) => {
            console.log(data)
            data.Email = data.Email.trim().toLowerCase();
            data.QuerySubject = data.QuerySubject.trim()
            data.QueryDescription = data.QueryDescription.trim();
            http.post("/Query/Addquery", data)
                .then((res) => {
                    console.log(res.data);
                    toast.success("Query sent Added")
                })
                .catch(function (err) {
                    toast.error(`${err.response.data.message}`);
                });
        }
    });


    return (
        <Card style={{
            marginTop: "8%",

            background: "white",
            borderRadius: "50px",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: "48em",
            position: 'relative'
        }}>
            <Typography variant="h5" sx={{ my: 2 }} style={{ marginTop: "5%" }}>
                Send us a query!
            </Typography>
            <Box component="form" sx={{ maxWidth: '500px' }}
                onSubmit={formik.handleSubmit}>
                
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label={<div style={{ display: 'flex', alignItems: 'center' }}>
                        <EmailIcon style={{ marginRight: 8 }} />
                        Email
                    </div>}
                    name="Email"

                    value={formik.values.Email ?? user}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.Email && Boolean(formik.errors.Email)}
                    helperText={formik.touched.Email && formik.errors.Email}

                />




                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label={<div style={{ display: 'flex', alignItems: 'center' }}>
                        <SubjectIcon style={{ marginRight: 8 }} />
                        Query Subject
                    </div>}
                    name="QuerySubject"

                    value={formik.values.QuerySubject}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.QuerySubject && Boolean(formik.errors.QuerySubject)}
                    helperText={formik.touched.QuerySubject && formik.errors.QuerySubject}

                />
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label={<div style={{ display: 'flex', alignItems: 'center' }}>
                        <DescriptionIcon style={{ marginRight: 8 }} />
                        Query Description
                    </div>}
                    name="QueryDescription"

                    value={formik.values.QueryDescription}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.QueryDescription && Boolean(formik.errors.QueryDescription)}
                    helperText={formik.touched.QueryDescription && formik.errors.QueryDescription}

                />

                <Button fullWidth variant="contained" sx={{ mt: 2 }} style={{ background: "#03C04A" }} type="submit">
                    Add
                </Button>
            </Box>
            <ToastContainer />

        </Card>
    )
}

export default AddQueries