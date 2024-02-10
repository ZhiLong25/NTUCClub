import React, { useEffect, useState } from 'react'
import { Box, Typography, Card, TextField, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import UserContext from '../../contexts/UserContext';
import http from '../../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
function AddMerchant() {

  const [user, setUser] = useState(null)
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
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/user/auth').then((res) => {

        console.log(res.data.user.UserType)
        setUser(res.data.user.userType);
      });
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: ""
    },
    validationSchema: yup.object({
      name: yup.string().trim()
        .min(3, 'Name must be at least 3 characters')
        .max(50, 'Name must be at most 50 characters')
        .required('Name is required')
        .matches(/^[a-zA-Z '-,.]+$/,
          "Only allow letters, spaces and characters: ' - , ."),
      email: yup.string().trim()
        .email('Enter a valid email')
        .max(50, 'Email must be at most 50 characters')
        .required('Email is required'),
      password: yup.string().trim()
        .min(8, 'Password must be at least 8 characters')
        .max(50, 'Password must be at most 50 characters')
        .required('Password is required')
        .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
          "At least 1 letter and 1 number"),
      confirmPassword: yup.string().trim()
        .required('Confirm password is required')
        .oneOf([yup.ref('password')], 'Passwords must match'),
      phone: yup.string().trim()
        .required("Phone Number is required")
        .min(7, "Phone number must be at least 7 characters")
        .max(15, "Phone number must be at most 15 digits")
        .matches(/^[0-9]+$/, "Phone number can only be numbers")
    }),
    onSubmit: (data) => {
      console.log("try")
      data.name = data.name.trim();
      data.email = data.email.trim().toLowerCase();
      data.password = data.password.trim();
      data.ProfilePicture = "defaultPfp.png"
      http.post(`/User/register/merchant`, data)
        .then((res) => {
          console.log(res.data);
          localStorage.setItem('userData', JSON.stringify(res.data));
          toast.success("Admin Added")
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
        Add Admin
      </Typography>
      <Box component="form" sx={{ maxWidth: '500px' }}
        onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth margin="dense" autoComplete="off"
          label={<div style={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon style={{ marginRight: 8 }} />
            Merchant Name
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

        />
        <div style={{ display: "flex", flexDirection: "row", position: "relative", width: "100%" }}>

          <TextField
            fullWidth margin="dense" autoComplete="off"
            label={<div style={{ display: 'flex', alignItems: 'center' }}>
              <LockIcon style={{ marginRight: 8 }} />
              Password
            </div>}
            name="password"
            type={type1}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}

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
            label={<div style={{ display: 'flex', alignItems: 'center' }}>
              <LockIcon style={{ marginRight: 8 }} />
              Confirm Password
            </div>}
            name="confirmPassword"
            type={type2}
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}

          />
          <span
            className="eyespan"
            style={{ display: "inline-block", margin: "auto", position: "absolute", left: "90%", top: "30%" }}
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
        <Button fullWidth variant="contained" sx={{ mt: 2 }} style={{ background: "#03C04A" }} type="submit">
          Add
        </Button>
      </Box>
      <ToastContainer />

    </Card>
  )
}

export default AddMerchant