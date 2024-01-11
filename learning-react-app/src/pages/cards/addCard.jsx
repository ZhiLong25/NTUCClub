import React, { useEffect, useState } from 'react'
import { Box, Typography, Card, TextField, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import UserContext from '../../contexts/UserContext';
import http from '../../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import DescriptionIcon from '@mui/icons-material/Description';
import AddCardIcon from '@mui/icons-material/AddCard';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Calendar from "react-calendar"

function AddCard() {

  const [user, setUser] = useState(null)
  const [date, setDate] = useState(new Date())

  const onChange = date => {
    setDate(date)
  }
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/user/auth').then((res) => {
        console.log(res.data.user)
        setUser(res.data.user);
      });
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      Card_Number: "",
      Card_Name: "",
      Cvv: "",
      First_Name: "",
      Last_Name: ""
    },
    validationSchema: yup.object({
      Card_Number: yup.string().trim()
        .min(15, "Card number must be at least 15 characters")
        .max(16, "Card number must be at most 16 characters")
        .required("Card number is required")
        .matches(/^[0-9]*$/,
          "Only numbers are allowed"),
      Card_Name: yup.string().trim()
        .max(30, "Card name must be at most 30 characters")
        .required("Card name is required")
        .matches(/^[a-zA-Z '-,.]+$/,
          "Only allow letters, spaces and characters: ' - , ."),
      Cvv: yup.string().trim()
        .min(3, 'Name must be at least 3 characters')
        .max(3, 'Name must be at most 3 characters')
        .required("Cvv is required")
        .matches(/^[0-9]+$/,
          "Only numbers are allowed"),
      First_Name: yup.string().trim()
        .min(3, "First name must be at least 3 characters")
        .max(50, "First name must be at most 50 characters")
        .required("First name is required")
        .matches(/^[a-zA-Z '-,.]+$/,
          "Only allow letters, spaces and characters: ' - , ."),
      Last_Name: yup.string().trim()
        .min(3, "Last name must be at most 3 characters")
        .max(50, "Last name must be at most 50 characters")
        .required("Last name is required")
        .matches(/^[a-zA-Z '-,.]+$/,
          "Only allow letters, spaces and characters: ' - , .")
    }),

    onSubmit: (data) => {
      data.Card_Number = data.Card_Number.trim()
      data.Card_Name = data.Card_Name.trim();
      data.Cvv = data.Cvv.trim();
      data.First_Name = data.First_Name.trim();
      data.Last_Name = data.Last_Name.trim();
      data.Voucher_Validity = date.toISOString();
      http.post("/Card/AddCard", data)
        .then((res) => {
          console.log(res.data);
          toast.success("Card Information Added");
        })
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
        Add Card
      </Typography>
      <Box component="form" sx={{ maxWidth: '500px' }}
        onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth margin="dense" autoComplete="off"
          label={<div style={{ display: 'flex', alignItems: 'center' }}>
            Card Number
          </div>}
          name="Card_Number"
          value={formik.values.Card_Number}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.Voucher_Number && Boolean(formik.errors.Voucher_Number)}
          helperText={formik.touched.Voucher_Number && formik.errors.Voucher_Number}
        />
        <TextField
          fullWidth margin="dense" autoComplete="off"
          label={<div style={{ display: 'flex', alignItems: 'center' }}>
            Card Name
          </div>}
          name="Card_Name"
          value={formik.values.Card_Name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.Card_Name && Boolean(formik.errors.Card_Name)}
          helperText={formik.touched.Card_Number && formik.errors.Card_Number}
        />
        <TextField
          fullWidth margin="dense" autoComplete="off"
          label={<div style={{ display: 'flex', alignItems: 'center' }}>
            CVV
          </div>}
          name="Cvv"
          value={formik.values.Cvv}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.Cvv && Boolean(formik.errors.Cvv)}
          helperText={formik.touched.Cvv && formik.errors.Cvv}
        />
        <TextField
          fullWidth margin="dense" autoComplete="off"
          label={<div style={{ display: 'flex', alignItems: 'center' }}>
            First Name
          </div>}
          name="First_Name"
          value={formik.values.First_Name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.First_Name && Boolean(formik.errors.First_Name)}
          helperText={formik.touched.First_Name && formik.errors.First_Name}

        />
        <TextField
          fullWidth margin="dense" autoComplete="off"
          label={<div style={{ display: 'flex', alignItems: 'center' }}>
            Last Name
          </div>}
          name="Last_Name"
          value={formik.values.Last_Name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.Last_Name && Boolean(formik.errors.Last_Name)}
          helperText={formik.touched.Last_Name && formik.errors.Last_Name}

        />
        <Button fullWidth variant="contained" sx={{ mt: 2 }} style={{ background: "#03C04A" }} type="submit">
          Add Card
        </Button>
      </Box>
      <ToastContainer />
    </Card>
  )
}

export default AddCard