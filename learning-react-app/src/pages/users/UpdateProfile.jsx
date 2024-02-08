import React, { useEffect, useState, useContext } from 'react'
import { Box, Typography, Card, TextField, Button, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import UserContext from '../../contexts/UserContext';
import http from '../../http';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';
import LockIcon from '@mui/icons-material/Lock';
import { useFormik } from 'formik';
import { useParams } from 'react-router-dom';
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import { Icon } from "react-icons-kit";
import AspectRatio from '@mui/joy/AspectRatio';
import * as yup from 'yup';
import "../styles/updateProfile.css"

function UpdateProfile() {
    const { id } = useParams();
    const [disabled, setDisabled] = useState(true)
    const [imageFile, setImageFile] = useState('');

    const [colour, setColour] = useState("#858886")
    const { user } = useContext(UserContext);
    const disable = () => {
        console.log("clicked")
        setDisabled(false)
        setColour("white")
    }
    const isdisabled = () => {
        setDisabled(true)
        setColour("#858886")
    }

    const [userDetail, setuserDetail] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });
    const [type1, setType1] = useState("password");
    const [icon1, setIcon1] = useState(eyeOff);

    //first eye
    const passToggle = () => {
        if (type1 === "password") {
            setIcon1(eye);
            setType1("text");
        } else {
            setIcon1(eyeOff);
            setType1("password");
        }
    };
    const [type2, setType2] = useState("password");
    const [icon2, setIcon2] = useState(eyeOff);
    //second eye
    const passToggle1 = () => {
        if (type2 === "password") {
            setIcon2(eye);
            setType2("text");
        } else {
            setIcon2(eyeOff);
            setType2("password");
        }
    };

    const formikpass = useFormik({
        initialValues: {
            password: "",
        },
        validationSchema: yup.object().shape({
            password: yup
                .string()
                .trim()
                .min(8, "Password must be at least 8 characters")
                .max(50, "Password must be at most 50 characters")
                .required("Password is required"),
            confirmPassword: yup.string().trim()
                .required('Confirm password is required')
                .oneOf([yup.ref('password')], 'Passwords must match'),
        }),
        onSubmit: (data) => {
            data.password = data.password.trim();
            console.log(data)
            http.put(`/user/securitydetails/${id}`, data)
                .then((res) => {
                    console.log("changed successful!"); // Log the parsed response data
                    toast.success("Changed Suceessfully!")
                    handleClose(true)
                })
                .catch(function (err) {
                    toast.error(`${err.response.data.message}`);
                });
        },
    })
    // const formikimage = useFormik({
    //     initialValues: imageFile,
    //     enableReinitialize: true,
    //     onSubmit: (data) => {            
    //         const formData = new FormData();
    //         formData.append('imageFile', data.imageFile);
    //         http.put(`/user/updateDetails/${id}`,formData,{
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //             },
    //         })

    //             .then((res) => {
    //                 toast.success("Information changed")
    //             })
    //             .catch(function (err) {
    //                 toast.error(`${err.response.data.message}`);
    //             });
    //     }
    // });
    const formik = useFormik({
        initialValues: userDetail,
        enableReinitialize: true,
        validationSchema: yup.object({
            email: yup.string().trim()
                .email('Enter a valid email')
                .max(50, 'Email must be at most 50 characters')
                .required('Email is required'),
            phone: yup.string().trim()
                .required("Phone Number is required")
                .min(7, "Phone number must be at least 7 characters")
                .max(15, "Phone number must be at most 15 digits")
                .matches(/^[0-9]+$/, "Phone number can only be numbers"),
            name: yup.string().trim()
                .min(3, 'Name must be at least 3 characters')
                .max(50, 'Name must be at most 50 characters')
                .required('Name is required')
                .matches(/^[a-zA-Z '-,.]+$/,
                    "Only allow letters, spaces and characters: ' - , ."),
        }),

        onSubmit: (data) => {
            if (imageFile) {
                data.ProfilePicture = imageFile;
            }
            data.email = data.email.trim().toLowerCase();
            data.phone = data.phone.trim();
            data.name = data.name.trim();
            http.put(`/user/updateDetails/${id}`, data)
                .then((res) => {
                    isdisabled()
                    toast.success("Information changed")
                })
                .catch(function (err) {
                    toast.error(`${err.response.data.message}`);
                });
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
            console.log(formData)
            http.post('/file/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((res) => {
                    console.log("image changed")
                    setImageFile(res.data.filename);
                })
                .catch(function (error) {
                    console.log(error.response);
                });
        }
    };
    useEffect(() => {
        console.log(userDetail);

        setImageFile(userDetail.pic);

    }, [userDetail]);

    const reload = () => {
        formik.setFieldValue("name", userDetail.name);
        formik.setFieldValue("phone", userDetail.phone);
        formik.setFieldValue("email", userDetail.email);
    };
    //retrieve user information
    useEffect(() => {
        http.get(`user/userdetails/${id}`)
            .then((data) => {
                setuserDetail(data.data);
                setImageFile(data.data.imageFile)
                console.log(data.data);
            });
    }, []);


    //image
    useEffect(() => {
        console.log(userDetail);

        setImageFile(userDetail.profilePicture);

    }, [userDetail]);

    return (
        <Box>
            <div className='main-container'>
                <Card className='pfp-container'>
                    <Box component="form" onSubmit={formik.handleSubmit}style={{width:"80%",height:"100%",margin:"auto"}}> 

                        <Box style={{ marginBottom: "30px", marginTop: "30px", height: "5rem",textAlign:"center" }} >
                            {
                                imageFile && (
                                    <img
                                    alt="tutorial"
                                    className="pfpimg"
                                    style={{
                                        borderRadius: "50%",
                                        height: "150px",
                                        width: "150px",
                                        objectFit: 'cover', // Adjust based on your requirements
                                        marginTop: "5%",
                                        margin:"auto"
                                    }}
                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                                    />
                                    )
                                }
                                    <Button variant="contained" component="label" style={{ marginTop: "25px" }}>
                                        Upload Image
                                        <input hidden accept="image/*" multiple type="file"
                                            onChange={onFileChange} />              </Button>
                            <Button fullWidth variant="contained" sx={{ mt: 2 }} style={{ background: "#E8533F", marhin:"auto" }}
                                type="submit">
                                Save
                            </Button>
                        </Box>
                    </Box>
                </Card>
                <Card className='information-container'>
                    <Typography style={{ textAlign: "center", marginTop: "5%" }}>Update Your information</Typography>
                    <Box component="form" sx={{ maxWidth: '500px' }} style={{ margin: "auto" }}
                        onSubmit={formik.handleSubmit}>
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label={<div style={{ display: 'flex', alignItems: 'center' }}>
                                <PersonIcon style={{ marginRight: 8 }} />
                                Name
                            </div>}
                            name="name"
                            style={{ background: colour }}
                            value={formik.values.name ?? userDetail.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                            disabled={disabled}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label={<div style={{ display: 'flex', alignItems: 'center' }}>
                                <EmailIcon style={{ marginRight: 8 }} />
                                email
                            </div>}
                            name="email"
                            style={{ background: colour }}

                            value={formik.values.email ?? userDetail.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            disabled={disabled}

                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label={<div style={{ display: 'flex', alignItems: 'center' }}>
                                <PhoneIcon style={{ marginRight: 8 }} />
                                phone
                            </div>}
                            name="phone"
                            style={{ background: colour }}

                            value={formik.values.phone ?? userDetail.phone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.phone && Boolean(formik.errors.phone)}
                            helperText={formik.touched.phone && formik.errors.phone}
                            disabled={disabled}

                        />
                        <Box className="buttonGroup">
                            <Button fullWidth variant="contained" onClick={disable} sx={{ mt: 2 }} style={{ background: "#E8533F" }}><div style={{ display: 'flex', alignItems: 'center' }} >
                                <EditIcon style={{ marginRight: 8 }} />
                                Edit
                            </div></Button>
                            <Button onClick={isdisabled} fullWidth variant="contained" sx={{ mt: 2 }} style={{ background: "#03C04A" }}
                                type="submit">
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <DoneIcon style={{ marginRight: 8 }} />
                                    Save
                                </div>
                            </Button>
                        </Box>
                        <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={isdisabled && reload} style={{ background: "white", border: "1px solid #E8533F", color: "black", marginBottom: "5%" }}><div style={{ display: 'flex', alignItems: 'center' }} >
                            <CancelIcon style={{ marginRight: 8 }} />
                            Cancel
                        </div></Button>

                        <Typography style={{ textAlign: "center", marginTop: "5%" }}>Change Your Password</Typography>
                    </Box>
                    <Box component="form" sx={{ maxWidth: '500px' }} style={{ margin: "auto" }}
                        onSubmit={formikpass.handleSubmit}>
                        <div style={{ display: "flex", flexDirection: "row", position: "relative", width: "100%" }}>
                            <TextField

                                fullWidth margin="dense" autoComplete="off"
                                label={
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <LockIcon style={{ marginRight: 8 }} />
                                        Password
                                    </div>
                                }
                                name="password" type={type1}
                                value={formikpass.values.password}
                                onChange={formikpass.handleChange}
                                onBlur={formikpass.handleBlur}
                                error={formikpass.touched.password && Boolean(formikpass.errors.password)}
                                helperText={formikpass.touched.password && formikpass.errors.password}
                            />
                            <span
                                className="eyespan"
                                style={{ display: "inline-block", margin: "auto", position: "absolute", left: "90%", top: "30%" }}
                            >
                                <Icon
                                    icon={icon1}
                                    onClick={passToggle}
                                    style={{
                                        display: "inline-block",
                                        color: "black",
                                        cursor: "pointer",
                                    }}
                                />

                            </span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "row", position: "relative", width: "100%" }}>
                            <TextField

                                fullWidth margin="dense" autoComplete="off"
                                label={
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <LockIcon style={{ marginRight: 8 }} />
                                        Confirm Password
                                    </div>
                                }
                                name="confirmPassword" type={type2}
                                value={formikpass.values.confirmPassword}
                                onChange={formikpass.handleChange}
                                onBlur={formikpass.handleBlur}
                                error={formikpass.touched.confirmPassword && Boolean(formikpass.errors.confirmPassword)}
                                helperText={formikpass.touched.confirmPassword && formikpass.errors.confirmPassword}
                            />
                            <span
                                className="eyespan"
                                style={{ display: "inline-block", margin: "auto", position: "absolute", left: "90%", top: "30%"}}
                            >
                                <Icon
                                    icon={icon2}
                                    onClick={passToggle1}
                                    style={{
                                        display: "inline-block",
                                        color: "black",
                                        cursor: "pointer",
                                    }}
                                />

                            </span>
                        </div>
                        <Button fullWidth variant="contained" sx={{ mt: 2 }} style={{ background: "#03C04A", marginBottom: "5%" }}
                            type="submit">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <DoneIcon style={{ marginRight: 8 }} />
                                Save
                            </div>
                        </Button>
                    </Box>
                </Card>
            </div>
            <ToastContainer />
        </Box>
    )
}

export default UpdateProfile