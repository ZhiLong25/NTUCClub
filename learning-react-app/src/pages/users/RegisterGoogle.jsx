import React,{useState} from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PersonIcon from '@mui/icons-material/Person';
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
function RegisterGoogle() {
    const navigate = useNavigate();
    const circleStyles = {
        position: 'absolute',
        background: "linear-gradient(45deg, rgba(255, 99, 71, 0.2) 0%, rgba(255, 99, 71, 0.5) 100%)",

        borderRadius: '50%',

    };
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
    const formik = useFormik({
        initialValues: {
           
            password: "",
            confirmPassword: "",
            phone:""
        },
        validationSchema: yup.object({
            
            password: yup.string().trim()
                .min(8, 'Password must be at least 8 characters')
                .max(50, 'Password must be at most 50 characters')
                .required('Password is required')
                .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
                    "At least 1 letter and 1 number"),
            confirmPassword: yup.string().trim()
                .required('Confirm password is required')
                .oneOf([yup.ref('password')], 'Passwords must match'),
            phone:yup.string().trim()
                .required("Phone Number is required")
                .min(7,"Phone number must be at least 7 characters")
                .max(15,"Phone number must be at most 15 digits")
                .matches(/^[0-9]+$/,"Phone number can only be numbers")
        }),
        onSubmit: (data) => {
            data.name = data.name.trim();
            data.email = data.email.trim().toLowerCase();
            data.password = data.password.trim();
            data.ProfilePicture = "defaultPfp.png"
            http.post("/user/register", data)
                .then((res) => {
                    console.log(res.data);
                    localStorage.setItem('userData', JSON.stringify(res.data));
                    navigate("/verification")
                })
                .catch(function (err) {
                    toast.error(`${err.response.data.message}`);
                });
        }
    });

    return (
        <Box sx={{
            height:"40rem"
        }}>
            <div style={{marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: "linear-gradient(45deg, rgba(255, 99, 71, 0.4) 0%, rgba(255, 99, 71, 0.7) 100%)",
            borderRadius: "50px",
            boxShadow: "4px 4px 8px rgba(255, 99, 71, 0.5)",
            height: "90%",
            position: 'relative'}}>
            <div className='circle1' style={{ ...circleStyles }}></div>
            <div className='circle2' style={{ ...circleStyles }}></div>
            <div className='circle3' style={{ ...circleStyles }}></div>
            <div className='circle4' style={{ ...circleStyles }}></div>
            <div className='circle5' style={{ ...circleStyles }}></div>
            <Typography variant="h5" sx={{ my: 2 }} style={{marginTop:"5%"}}>
                Register
            </Typography>
            <Box component="form" sx={{ maxWidth: '500px' }}
                onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label={ <div style={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon style={{ marginRight: 8 }} />
                    Name
                </div>}
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                />
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label={<div style={{ display: 'flex', alignItems: 'center' }}>
                    <EmailIcon style={{ marginRight: 8 }} />
                    Email
                </div>}
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
                <div style={{display:"flex",flexDirection:"row",position:"relative",width:"100%"}}>
                        <TextField
                            
                            fullWidth margin="dense" autoComplete="off"
                            label={
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <LockIcon style={{ marginRight: 8 }} />
                                    Password
                                </div>
                            }
                            name="password" type={type1}
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />
                        <span
                            className="eyespan"
                            style={{ display: "inline-block",margin:"auto",position:"absolute",left:"90%",top:"30%" }}
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
                    <div style={{display:"flex",flexDirection:"row",position:"relative",width:"100%"}}>
                        <TextField
                            
                            fullWidth margin="dense" autoComplete="off"
                            label={
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <LockIcon style={{ marginRight: 8 }} />
                                    Confirm Password
                                </div>
                            }
                            name="confirmPassword" type={type2}
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                        />
                        <span
                            className="eyespan"
                            style={{ display: "inline-block",margin:"auto",position:"absolute",left:"90%",top:"30%" }}
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
                    <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label={<div style={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon style={{ marginRight: 8 }} />
                    Phone
                </div>}
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                    inputProps={{
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                      }}
                />
                <Button fullWidth variant="contained" sx={{ mt: 2 }}style={{ background: "#E8533F" }}
                    type="submit">
                    Register
                </Button>
            </Box>
            </div>
            <ToastContainer />
        </Box>
    );
}

export default RegisterGoogle;