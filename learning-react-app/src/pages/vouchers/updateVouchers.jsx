import React, { useEffect, useState } from 'react'
import { Box, Typography, Card, TextField, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import UserContext from '../../contexts/UserContext';
import http from '../../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import DescriptionIcon from '@mui/icons-material/Description';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Calendar from "react-calendar"
import 'react-calendar/dist/Calendar.css';
import { useParams } from 'react-router-dom';
function updateVouchers() {
  const {id} = useParams()
  const [user, setUser] = useState(null)
  const [date,setDate] = useState()

  const onChange = date =>{
    console.log(date)
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
  useEffect(()=>{
    http.get(`Voucher/GetVoucherID/${id}`).then((res)=>{
      const formattedData = {
        Voucher_Name: res.data[0].voucher_Name,
        Voucher_Details: res.data[0].voucher_Details, // Adjust the capitalization here
        Voucher_Quantity: res.data[0].voucher_Quantity,
        Voucher_Validity: res.data[0].voucher_Validity,
      };
      setVoucherDetails(formattedData)
      console.log(res.data[0])
    })
  },[])
  const [VoucherDetails,setVoucherDetails]  = useState({
    Voucher_Name:"",
    Voucher_Details: "",
      Voucher_Quantity: "",
      Voucher_Validity: ""
  })
  const formik = useFormik({
    initialValues: VoucherDetails,
    enableReinitialize : true,
    validationSchema: yup.object({
      Voucher_Details: yup.string().trim()
        .min(3, "Descriptions must be at least 3 characters")
        .max(450, 'Descriptions must be at most 450 characters')
        .required('Description is required'),
      Voucher_Quantity: yup.string().trim()
        .required("Voucher Quantity is required")
        .min(0, "Voucher Quantity must be at least 7 characters")
        .matches(/^[0-9]+$/, "Voucher Quantity can only be numbers"),
     
      Voucher_Name: yup.string().trim()
        .min(3, 'Name must be at least 3 characters')
        .max(100, 'Name must be at most 50 characters')
        .required('Name is required')
        .matches(/^[a-zA-Z '-,.]+$/,
          "Only allow letters, spaces and characters: ' - , ."),
    }),

    onSubmit: (data) => {
      data.Voucher_Details = data.Voucher_Details.trim()
      data.Voucher_Name = data.Voucher_Name.trim();
      data.Voucher_Validity = date.toISOString();
      console.log(date.toISOString())
    if (date< new Date()){
        toast.error("Date should not be in the past")
    }
      if (user.userType === "Admin") {
        data.Activity_ID = -1
      }
      console.log(data)
      http.put(`/Voucher/${id}`, data)
        .then((res) => {
          toast.success("Information changed")
          window.location.reload();
        })
        .catch(function (err) {
          console.log("Error")
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
          Update Voucher
        </Typography>
        <Box component="form" sx={{ maxWidth: '500px' }}
          onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth margin="dense" autoComplete="off"
            label={<div style={{ display: 'flex', alignItems: 'center' }}>
              <DriveFileRenameOutlineIcon style={{ marginRight: 8 }} />
              Voucher Name
            </div>}
            name="Voucher_Name"
            value={formik.values.Voucher_Name ?? VoucherDetails.Voucher_Name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.Voucher_Name && Boolean(formik.errors.Voucher_Name)}
            helperText={formik.touched.Voucher_Name && formik.errors.Voucher_Name}
          />
          <TextField
            fullWidth margin="dense" autoComplete="off"
            label={<div style={{ display: 'flex', alignItems: 'center' }}>
              <DescriptionIcon style={{ marginRight: 8 }} />
              Details
            </div>}
            name="Voucher_Details"

            value={formik.values.Voucher_Details ?? VoucherDetails.Voucher_Details}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.Voucher_Details && Boolean(formik.errors.Voucher_Details)}
            helperText={formik.touched.Voucher_Details && formik.errors.Voucher_Details}

          />



          <TextField
            fullWidth margin="dense" autoComplete="off"
            label={<div style={{ display: 'flex', alignItems: 'center' }}>
              <ProductionQuantityLimitsIcon style={{ marginRight: 8 }} />
              Quantity
            </div>}
            name="Voucher_Quantity"

            value={formik.values.Voucher_Quantity ?? VoucherDetails.Voucher_Quantity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.Voucher_Quantity && Boolean(formik.errors.Voucher_Quantity)}
            helperText={formik.touched.Voucher_Quantity && formik.errors.Voucher_Quantity}

          />

            <Calendar 
                onChange={onChange} value={date ?? VoucherDetails.Voucher_Validity}
                />

          <Button fullWidth variant="contained" sx={{ mt: 2 }} style={{ background: "#03C04A" }} type="submit">
            Save
          </Button>
        </Box>
        <ToastContainer />

      </Card>
  )
}

export default updateVouchers