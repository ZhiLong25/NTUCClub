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
  import "../styles/updateProfile.css"

  function updateVouchers() {
    const {id} = useParams()
    const [user, setUser] = useState(null)
    const [date,setDate] = useState()
    const [imageFile,setImageFile] = useState()
    
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
        setImageFile(res.data[0].voucher_Image)
        setVoucherDetails(formattedData)
        console.log(res.data[0])
      })
    },[])
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
            console.log("Image Uploaded");
            setImageFile(res.data.filename);
          })
          .catch(function (error) {
            console.log(error.response);
          });
      }
    };
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
          .matches(/^[a-zA-Z0-9\s]+$/, "Only letter and numbers input accepted"),
      }),

      onSubmit: (data) => {
        const formData = new FormData();
        
        // if (imageFile) {
        //   data.voucher_Image = imageFile;
        // }
        data.Voucher_Details = data.Voucher_Details.trim()
        data.Voucher_Name = data.Voucher_Name.trim();
        data.Voucher_Validity = date.toISOString();
        formData.append('Voucher_Details', data.Voucher_Details);
        formData.append('Voucher_Name', data.Voucher_Name);
        formData.append('Voucher_Validity', data.Voucher_Validity);
        formData.append('Voucher_Quantity', data.Voucher_Quantity);
        formData.append('VoucherImage', imageFile);
        // console.log(date.toISOString())
        
      if (date< new Date()){
          toast.error("Date should not be in the past")
      }
        if (user.userType === "Admin") {
          data.Activity_ID = -1
        }
        console.log(data)
        http.put(`/Voucher/${id}`, formData)
          .then((res) => {
            toast.success("Voucher Updated");
            setTimeout(() => {
                window.location.reload();
            }, 2000);
          })
          .catch(function (err) {
            console.log("Error")
            toast.error(`${err.response.data.message}`);
          });
      }

    });

  return (
    <Box >
      <div className='main-container'>
                <Card className='pfp-container'>
                <Box style={{ width: "80%", height: "100%", margin: "auto" }}>
        <Box style={{ marginBottom: "30px", marginTop: "30px", height: "5rem", textAlign: "center" }} >
          {
            imageFile && (
              <img
                alt="tutorial"
                className="voucherImg"
                style={{
                  height: "150px",
                  width: "150px",
                  objectFit: 'cover', // Adjust based on your requirements
                  marginTop: "5%",
                  margin: "auto"
                }}
                src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
              />
            )
          }
          <Button variant="contained" component="label" style={{ marginTop: "25px" }}>
            Update Image
            <input hidden accept="image/*" multiple type="file"
              onChange={onFileChange} />              
              </Button>
        </Box>
      </Box>
      </Card>
      <Card className='information-container' >

      <Typography variant="h5" sx={{ my: 2 }} style={{ marginTop: "5%",textAlign:"center" }}>
        Update Voucher
      </Typography>
      <Box component="form" sx={{ maxWidth: '500px',margin:"auto" }} onSubmit={formik.handleSubmit}>
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
            onChange={onChange} 
            value={date ?? VoucherDetails.Voucher_Validity}
        />
  
        <Button fullWidth variant="contained" sx={{ mt: 2 }} style={{ background: "#03C04A",marginBottom:"5%" }} type="submit">
          Update
        </Button>
      </Box>
      <ToastContainer />
      </Card>
      </div>
    </Box>
  );  
}

  export default updateVouchers