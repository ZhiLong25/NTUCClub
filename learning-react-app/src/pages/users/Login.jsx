import React, { useContext, useState,useEffect } from 'react';
import { Box, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../../contexts/UserContext';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import EmailIcon from '@mui/icons-material/Email';
import '../styles/login.css'
import {jwtDecode } from "jwt-decode";
function Login() {
    const navigate = useNavigate();
    const [icon, setIcon] = useState(eyeOff);
    const [pass, setPass] = useState(false)
    const [type, setType] = useState("password");
    const [open, setOpen] = useState(false);
    const[email,setEmail] = useState("")
    const { setUser } = useContext(UserContext);
    const circleStyles = {
        position: 'absolute',
        background: "linear-gradient(45deg, rgba(255, 99, 71, 0.2) 0%, rgba(255, 99, 71, 0.5) 100%)",

        borderRadius: '50%',

    };
    //for forgot password modal
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setPass(false)
    };

    const passToggle = () => {
        if (type === "password") {
            setIcon(eye);
            setType("text");
        } else {
            setIcon(eyeOff);
            setType("password");
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
        }),
        onSubmit: (data) => {
            data.password = data.password.trim();
            console.log(data)
            http.put(`/user/securitydetails/${email}`,data)
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
    const formikemail = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: yup.object().shape({
            email: yup
                .string()
                .trim()
                .email("Enter a valid email")
                .max(50, "Email must be at most 50 characters")
                .required("Email is required"),
        }),
        onSubmit: (data) => {
            data.email = data.email.trim().toLowerCase();
            console.log(data.email)
            http
            .get(`/user/findemail/${data.email}`)
            .then((res) => {
                    // handleLogin()
                    console.log()
                    setEmail(res.data.id)
                    setPass(true)
                })
                .catch(function (err) {
                    
                    toast.error(`${err.response.data.message}`);
                });
        },
    })
    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: yup.object({
            email: yup.string().trim()
                .email('Enter a valid email')
                .max(50, 'Email must be at most 50 characters')
                .required('Email is required'),
            password: yup.string().trim()
                .min(8, 'Password must be at least 8 characters')
                .max(50, 'Password must be at most 50 characters')
                .required('Password is required')
        }),
        onSubmit: (data) => {
            data.email = data.email.trim().toLowerCase();
            data.password = data.password.trim();
            http.post("/user/login", data)
                .then((res) => {
                    localStorage.setItem("accessToken", res.data.accessToken);
                    setUser(res.data.user);
                    navigate("/");
                })
                .catch(function (err) {
                    toast.error(`${err.response.data.message}`);
                });
        }

    });
    //google auth part
  const clientId ="187449264999-e8qk675ti421g8lau39aq1d9rqpvaq9r.apps.googleusercontent.com"
  const handleCallbackResponse=(response)=>{
        console.log("Encoded JWT:"+response.credential)
        var userObject = jwtDecode (response.credential);
        var email = userObject.email;
        //need check if account exist or not
        http.get(`user/findemail/${email}`).then(async(res)=>{
            await http.post("/user/login", res.data).then((res)=>{
                console.log("logging in")
                localStorage.setItem("accessToken", res.data.accessToken);
                setUser(userObject);
                navigate("/");
            })
        })
        userObject.Email = userObject.email
        http.post("/user/register/userGoogle", userObject).then((res)=>{
            localStorage.setItem('userDatagoogle', JSON.stringify(userObject));
            navigate("/RegisterGoogle")

        }).catch(function(err){
            toast.error(`${err.response.data.message}`);
        })
  }

  useEffect(()=>{
    // global google
    google.accounts.id.initialize({
      client_id:clientId,
      callback:handleCallbackResponse
    })
    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      {theme:"outline",size:"large",text: "Sign in with Google",prompt: "none"}
    )
    google.accounts.id.prompt();
  },[])
    return (
        <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: "linear-gradient(45deg, rgba(255, 99, 71, 0.4) 0%, rgba(255, 99, 71, 0.7) 100%)",
            borderRadius: "50px",
            boxShadow: "4px 4px 8px rgba(255, 99, 71, 0.5)",
            height: "60dvh",
            position: 'relative'
        }}>
            <div className='circle1' style={{ ...circleStyles }}></div>
            <div className='circle2' style={{ ...circleStyles }}></div>
            <div className='circle3' style={{ ...circleStyles }}></div>
            <div className='circle4' style={{ ...circleStyles }}></div>
            <div className='circle5' style={{ ...circleStyles }}></div>

            <div className='loginContainer'>
                <Typography variant="h5" sx={{ my: 2 }}>
                    Login
                </Typography>
                <Box component="form" sx={{ maxWidth: '500px' }}
                    onSubmit={formik.handleSubmit}>
                    <TextField style={{width:"25dvw"}}
                        fullWidth margin="dense" autoComplete="off"
                        label={
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <EmailIcon style={{ marginRight: 8 }} />
                                Email
                            </div>
                        }
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                    <div style={{display:"flex",flexDirection:"row",position:"relative",width:"25dvw"}}>
                        <TextField
                            
                            fullWidth margin="dense" autoComplete="off"
                            label={
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <LockIcon style={{ marginRight: 8 }} />
                                    Password
                                </div>
                            }
                            name="password" type={type}
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
                                icon={icon}
                                onClick={passToggle}
                                style={{
                                    display: "inline-block",
                                    color: "black",
                                    cursor: "pointer",
                                }}
                            />

                        </span>
                    </div>
                    <Button fullWidth variant="contained" sx={{ mt: 2 }}
                        type="submit" style={{ background: "#E8533F" }}>
                        Login
                    </Button>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <input
                        type="checkbox"
                        // checked={rememberMe}
                        // onChange={(e) => setRememberMe(e.target.checked)}
                        style={{ height: "20px", marginRight: "5px" }}
                    />

                    <div style={{ inline: true }}>
                        <p
                            style={{ color: "black", fontSize: "10px", }}
                        >
                            Remember Me
                        </p>
                    </div>

                    <a
                        href="#"
                        className="forgotpass"
                        onClick={handleOpen}
                        style={{
                            marginRight: "0",
                            marginLeft: "auto",
                            color: "black",
                            textDecoration: "none",

                            cursor: "pointer",
                        }}
                    >
                        Forget Password?
                    </a>
                </Box>
                    <div id="signInDiv"></div>
                <Dialog open={open} onClose={handleClose}>
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/3588/3588294.png"
                        style={{ height: "50px", width: "50px", margin: "auto" }}
                        alt="warning"
                        className="noti-icon"
                    />

                    <DialogTitle>Forgot Password</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter The Email of the account you want to change the password for
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Box
                            component="form"
                            sx={{ maxWidth: "500px" }}
                            onSubmit={formikemail.handleSubmit}
                            style={{ margin: "auto" }}
                        >
                           <TextField 
                        fullWidth margin="dense" autoComplete="off"
                        label={
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <PersonIcon style={{ marginRight: 8 }} />
                                Email
                            </div>
                        }
                        name="email"
                        value={formikemail.values.email}
                        onChange={formikemail.handleChange}
                        onBlur={formikemail.handleBlur}
                        error={formikemail.touched.email && Boolean(formikemail.errors.email)}
                        helperText={formikemail.touched.email && formik.errors.email}
                    />
                            
                            <Button
                                fullWidth
                                variant="contained"
                                style={{
                                    width: "100%",
                                    margin: "auto",
                                    marginTop: "30px",
                                    backgroundColor: "white",
                                    color: "black",
                                }}
                                type="submit"
                            >
                                Continue
                            </Button>

                        </Box>
                    </DialogActions>
                    <DialogActions>
                        <Button
                            variant="contained"
                            color="inherit"
                            style={{ margin: "auto" }}
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={pass} onClose={handleClose} >
                    <DialogTitle>Change Your Password</DialogTitle>
                    <Box
                        component="form"
                        sx={{ maxWidth: "500px" }}
                        onSubmit={formikpass.handleSubmit}
                    >
                        
                        <div style={{display:"flex",flexDirection:"row",position:"relative",width:"25dvw"}}>
                        <TextField
                            
                            fullWidth margin="dense" autoComplete="off"
                            label={
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <LockIcon style={{ marginRight: 8 }} />
                                    Password
                                </div>
                            }
                            name="password" type={type}
                            value={formikpass.values.password}
                            onChange={formikpass.handleChange}
                            onBlur={formikpass.handleBlur}

                            error={formikpass.touched.password && Boolean(formikpass.errors.password)}
                            helperText={formikpass.touched.password && formikpass.errors.password}
                        />
                        <span
                            className="eyespan"
                            style={{ display: "inline-block",margin:"auto",position:"absolute",left:"23dvw",top:"25%" }}
                        >
                            <Icon
                                icon={icon}
                                onClick={passToggle}
                                style={{
                                    display: "inline-block",
                                    color: "black",
                                    cursor: "pointer",
                                }}
                            />

                        </span>
                    </div>
                        <Button
                            fullWidth
                            variant="contained"
                            style={{
                                width: "100%",
                                margin: "auto",
                                marginTop: "30px",
                                backgroundColor: "white",
                                color: "black",
                            }}
                            type="submit"
                        >
                            Continue
                        </Button>
                    </Box>

                </Dialog>
            </div>


            <ToastContainer />
        </Box>
    );
}

export default Login;