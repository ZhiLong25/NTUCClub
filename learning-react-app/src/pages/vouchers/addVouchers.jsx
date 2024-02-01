import React, { useEffect, useState } from 'react'
import { Box, Typography, Card, TextField, Button } from '@mui/material';
import { Select, MenuItem, InputLabel, FormControl} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import UserContext from '../../contexts/UserContext';
import http from '../../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import DescriptionIcon from '@mui/icons-material/Description';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Calendar from "react-calendar";


function addVouchers() {
  const [user, setUser] = useState(null);
  const [date, setDate] = useState(new Date());
  const [imageFile, setImageFile] = useState(null);

  const onChange = (date) => {
    setDate(date);
  };

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/user/auth').then((res) => {
        console.log(res.data.user);
        setUser(res.data.user);
      });
    }
  }, []);

  const DropdownCounter = ({ value, onChange, style }) => {
    return (
      <FormControl fullWidth style={style}>
        <InputLabel> Voucher Quantity</InputLabel>
        <Select value={value} onChange={onChange}>
          {[...Array(101).keys()].map((num) => (
            <MenuItem key={num} value={num}>
              {num}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  const formik = useFormik({
    initialValues: {
      Voucher_Name: "",
      Voucher_Details: "",
      Voucher_Quantity: "",
      Voucher_Validity: "",
      Voucher_Image: null,
    },
    validationSchema: yup.object({
      Voucher_Details: yup.string().trim()
        .min(3, "Description must be at least 3 characters")
        .max(450, 'Description must be at most 50 characters')
        .required('Description is required'),
      Voucher_Quantity: yup.string().trim()
        .required("Voucher Quantity is required")
        .min(0, "Voucher Quantity must be at least 7 characters")
        .matches(/^[0-9]+$/, "Voucher Quantity can only be numbers"),
      Voucher_Name: yup.string().trim()
        .min(3, 'Name must be at least 3 characters')
        .max(100, 'Name must be at most 50 characters')
        .required('Name is required')
        .matches(/^[a-zA-Z]+$/, "Only letter input accepted"),
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

        // Create FormData to handle file upload
        if (imageFile) {
          data.Voucher_Image = imageFile;
        }

        const formData = new FormData();
        formData.append('Voucher_Details', data.Voucher_Details);
        formData.append('Voucher_Name', data.Voucher_Name);
        formData.append('Voucher_Validity', data.Voucher_Validity);
        formData.append('Voucher_Quantity', data.Voucher_Quantity);
        formData.append('Activity_ID', data.Activity_ID);
        formData.append('VoucherImage', data.Voucher_Image);
        console.log(formData)
        http.post("/Voucher/Addvoucher", formData)
        http.post("/Voucher/Addvoucher", data)
          .then((res) => {
            toast.success("Voucher Added");
          })
          .catch(function (err) {
            console.error('Error:', err);
            toast.error(`${err.response.data.message}`);
          });
      }
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
          console.log("Image Uploaded");
          setImageFile(res.data.filename);
        })
        .catch(function (error) {
          console.log(error.response);
        });
    }
  };

  useEffect(() => {
    if (formik.values.Voucher_Image) {
      setImageFile(formik.values.Voucher_Image);
    }
  }, [formik.values.Voucher_Image]);

  return (
    <Box>
      <Card className='pfp-container'>
                    <Box component="form" onSubmit={formik.handleSubmit}style={{width:"80%",height:"100%",margin:"auto"}}> 

                        <Box style={{ marginBottom: "30px", marginTop: "30px", height: "5rem",textAlign:"center" }} >
                            {
                                imageFile && (
                                    <img
                                    alt="tutorial"
                                    className="voucherImg"
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
      <Card style={{
        marginTop: "8%",
        background: "white",
        borderRadius: "50px",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: "auto", // Change to "auto" to allow dynamic height based on content
        position: 'relative'
      }}>
        <Typography variant="h5" sx={{ my: 2, marginTop: "5%" }}>
          Add Voucher
        </Typography>
        <Box component="form" sx={{ maxWidth: '500px', width: '100%' }} onSubmit={formik.handleSubmit}>
          {/* <Box mb={2}>
            <input
              type="file"
              accept="image/*"
              onChange={onImageChange}
              style={{ display: 'none' }}
              id="imageInput"  // Assign a unique id to the file input
            />
            {!uploadedImage ? (
              <label htmlFor="imageInput">
                <Button component="span" fullWidth variant="contained" sx={{ background: "#03C04A" }}>
                  Upload Image
                </Button>
              </label>
            ) : (
              <Box mt={2} mb={2} sx={{ width: '200px', height: '200px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <Button
                  variant="contained"
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    background: "#03C04A",
                  }}
                  onClick={onEditImage}
                >
                  Edit Image
                </Button>
              </Box>
            )}
            {image && <Typography variant="subtitle1">{image.name}</Typography>}
          </Box> */}
          <TextField
            fullWidth margin="dense" autoComplete="off"
            label={<div style={{ display: 'flex', alignItems: 'center' }}>
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
                Details
              </div>
            }
            name="Voucher_Details"
            value={formik.values.Voucher_Details}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.Voucher_Details && Boolean(formik.errors.Voucher_Details)}
            helperText={formik.touched.Voucher_Details && formik.errors.Voucher_Details}
          />
          <DropdownCounter
            style={{ marginTop: "8px" }}
            value={formik.values.Voucher_Quantity}
            onChange={(e) => formik.setFieldValue('Voucher_Quantity', e.target.value)}
          />

          <div style={{ marginTop: "8px" }}><p>Select Expiry Date</p></div>
          <div style={{ marginTop: "8px" }}>
            <Calendar onChange={onChange} value={date} />
          </div>
          <Button fullWidth variant="contained" sx={{ mt: 2 }} style={{ background: "#03C04A" }} type="submit">
            Add
          </Button>
        </Box>
        <ToastContainer />
      </Card>
    </Box>
  );
}

export default addVouchers
