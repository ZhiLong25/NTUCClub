import React, { useEffect, useState } from 'react'
import { Box, Typography, Card, TextField, Button, Grid } from '@mui/material';
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
// import 'react-calendar/dist/Calendar.css';
import { useParams } from 'react-router-dom';
import "../styles/updateProfile.css";
import { useNavigate } from 'react-router-dom';
import "../styles/calendar.css";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


function updateVouchers() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [date, setDate] = useState(new Date());
  const [imageFile, setImageFile] = useState()

  const onChange = date => {
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
  useEffect(() => {
    http.get(`Voucher/GetVoucherID/${id}`).then((res) => {
      const formattedData = {
        Voucher_Name: res.data[0].voucher_Name,
        Voucher_Details: res.data[0].voucher_Details, // Adjust the capitalization here
        Voucher_Quantity: res.data[0].voucher_Quantity,
        Voucher_Validity: res.data[0].voucher_Validity,
      };
      setImageFile(res.data[0].voucher_Image)
      setVoucherDetails(formattedData)
      console.log(res.data[0])
    })
  }, [])
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
          console.log("Image Uploaded", res.data.filename);
          setImageFile(res.data.filename);
        })
        .catch(function (error) {
          console.log(error.response);
        });
    }
  };
  const [VoucherDetails, setVoucherDetails] = useState({
    Voucher_Name: "",
    Voucher_Details: "",
    Voucher_Quantity: "",
    Voucher_Validity: ""
  })
  const formik = useFormik({
    initialValues: VoucherDetails,
    enableReinitialize: true,
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
        .matches(/^[a-zA-Z0-9\s]+$/, "Only letter and numbers input accepted"),
    }),

    onSubmit: (data) => {
      data.Voucher_Details = data.Voucher_Details.trim();
      data.Voucher_Name = data.Voucher_Name.trim();
      data.Voucher_Validity = date.toISOString();

      if (date < new Date()) {
        toast.error("Date should not be in the past");
      } else {
        if (user.userType === "Admin") {
          data.Activity_ID = -1;
        }
        console.log(imageFile)
        // Create FormData to handle file upload
        if (imageFile != null) {
          data.Voucher_Image = imageFile;
        }

        http.put(`/Voucher/${id}`, data)
          .then((res) => {
            toast.success("Voucher Updated");
            setTimeout(() => {
              navigate("/voucherdashboard")
            }, 2000); // 2000 milliseconds = 2 seconds
          })

          .catch(function (err) {
            console.error('Error:', err);
            toast.error(`${err.response.data.message}`);
          });
      }
    }

  });

  const goBack = () => {
    navigate("/voucherdashboard")
  }

  return (
    <Box>
      <Button sx={{ mt: 2 }} onClick={goBack}><ArrowBackIcon /> Back to Dashboard</Button>

      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#E6533F', textAlign: 'center' }}>
        Edit Voucher
      </Typography>

      <Grid container spacing={1}>
        <Grid item xs={12} md={3} lg={5} >
          <Card className='pfp-container' style={{ height: "325px" }}>
            <Box style={{ marginBottom: "30px", marginTop: "30px", height: "5rem", textAlign: "center" }}>
              {imageFile ? (
                <img
                  alt="tutorial"
                  className="voucherImg"
                  style={{
                    borderRadius: "150%",
                    height: "200px",
                    width: "200px",
                    margin: "auto",
                  }}
                  src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                />
              ) : (
                <img
                  src="/assets/placeholder.jpg"
                  alt="placeholder"
                  className="voucherImg"
                  style={{
                    borderRadius: "150%",
                    height: "200px",
                    width: "200px",
                    margin: "auto",
                  }}
                />
              )}
              <Button variant="contained" component="label" style={{ marginTop: "25px", backgroundColor: "#E6533F", color: "white" }}>
                Change Image
                <input hidden accept="image/*" multiple type="file" onChange={onFileChange} />
              </Button>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={9} lg={7} >
          <Card className='information-container' >
            <Box component="form" sx={{ maxWidth: '500px', width: '100%' }} onSubmit={formik.handleSubmit} style={{ margin: "auto", marginTop: "5%" }}>
              <TextField
                fullWidth margin="dense" autoComplete="off"
                label={<div style={{ display: 'flex', alignItems: 'center'}}>
                  <DriveFileRenameOutlineIcon style={{ marginRight: 8 }} />
                  Voucher Name
                </div>}
                name="Voucher_Name"
                value={formik.values.Voucher_Name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.Voucher_Name && Boolean(formik.errors.Voucher_Name)}
                helperText={formik.touched.Voucher_Name && formik.errors.Voucher_Name}
              />
              <TextField
                fullWidth
                multiline // Enable multiline
                rows={4} // Adjust the number of rows as needed
                margin="dense"
                autoComplete="off"
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <DescriptionIcon style={{ marginRight: 8 }} />
                    Voucher Details
                  </div>
                }
                name="Voucher_Details"
                value={formik.values.Voucher_Details}
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
              <div style={{ marginTop: "8px", marginBottom: "8px"}}><p>Change Expiry Date</p></div>
              <Calendar
                onChange={onChange}
                className="black-selected-date"
                
                value={VoucherDetails.Voucher_Validity}
              />
              <Button fullWidth variant="contained" sx={{ mt: 4 }} style={{ background: "#03C04A", marginBottom: "10%" }} type="submit">
                Update
              </Button>
            </Box>
            <ToastContainer />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  
}

export default updateVouchers