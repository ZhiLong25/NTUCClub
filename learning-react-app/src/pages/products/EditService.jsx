import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { AccessTime, Search, Clear, Edit } from '@mui/icons-material';

import { Container, Box, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton,InputLabel, Select, MenuItem, Grid } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput';
import * as yup from 'yup';
import http from '../../http';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import placeholder from './media/placeholder.png';


function EditService() {

  const [isMemberPriceVisible, setIsMemberPriceVisible] = useState(false);
  const [imageFile, setImageFile] = useState('');
  const [vendorList, setVendorList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);


  const { id } = useParams();
  const navigate = useNavigate();

  const [services, setServices] = useState({
    name: "",
    description: "",
    price: "",
    timeSlots: "",
    vendor: "",
    slots: "",
    category: ""
  });

  useEffect(() => {
    http.get(`/Product/getservice/${id}`).then((res) => {
      console.log(res.data);
      setServices(res.data);
    });

    http.get('/Vendor/getvendor').then((res) => {
      setVendorList(res.data);
    });

    http.get('/Category/getcategory').then((res) => {
      setCategoryList(res.data);
    });
  }, []);


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
          setImageFile(res.data.filename);
        })
        .catch(function (error) {
          console.log(error.response);
        });
    }
  };

  const formik = useFormik({
    initialValues: services,
    enableReinitialize: true,


    validationSchema: yup.object().shape({
      name: yup.string().trim()
        .min(3, "Name must be at least 3 characters")
        .max(100, 'Name must be at most 100 characters')
        .required('Name is required'),

      description: yup.string().trim()
        .min(3, "Description must be at least 3 characters")
        .max(100, 'Description must be at most 100 characters')
        .required('Description is required'),

      price: yup.number().required('Price is required'),

      timeSlots: yup.string().required('Timeslots is required'),

      slots: yup.number().required('Slots amount is required'),

      vendor: yup.string().trim()
        .min(3, "Vendor must be at least 3 characters")
        .max(100, 'Vendor must be at most 100 characters')
        .required('Vendor is required'),

      category: yup.string().required('Category is required')

    }),

    onSubmit: (data) => {
      if (imageFile) {
        data.image = imageFile;
      }
      console.log("Submit button clicked");
      http.put(`/Product/updateservice/${id}`, data)
        .then((res) => {
          console.log(res.data);

          navigate("/productdash");
        })
    }
  });

  const [isDeleted, setIsDeleted] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setIsDeleted(false);
  };

  const deleteService = () => {
    http.delete(`/Product/deleteservice/${id}`)
      .then((res) => {
        console.log(res.data);
        setIsDeleted(true);
        setOpen(false);

        setTimeout(() => {
          navigate("");
        }, 2000);

      });
  };

  return (
    <Container>
      <Typography variant='h5' sx={{ my: 2 }} style={{ marginTop: "5%" }}>
        Edit Events / Services
      </Typography>

      <Box component="form" onSubmit={formik.handleSubmit}>

        <Grid container spacing={2}>
          <Grid item xs={4} md={4} lg={4} >
            <Box sx={{ textAlign: 'center', mt: 2 }} >

              {
                imageFile ? (
                  <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                    <img alt="tutorial" src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`} />
                  </Box>
                ) : (
                  <img src={placeholder} alt="placeholder" />
                )
              }

              <Button variant="contained" component="label" style={{ marginTop: "20px" }}>
                Upload Image
                <input hidden accept="image/*" multiple type="file" onChange={onFileChange} />
              </Button>
            </Box>
          </Grid>
            
          <Grid item xs={8} md={8} lg={8} >

          <Link onClick={handleOpen} style={{float:"right"}}>
                        <IconButton color="primary" sx={{ padding: '4px' }}>
                          <Clear />
                        </IconButton>
                      </Link>

            <TextField
              fullWidth margin="normal" autoComplete="off"
              label="Title"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />

            <ReactQuill
              style={{ borderRadius: "5px" }}
              value={formik.values.description}
              onChange={(value) => formik.setFieldValue('description', value)}
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['link', 'image'],
                  ['clean'],
                ],
              }}
              formats={[
                'header',
                'bold', 'italic', 'underline', 'strike', 'blockquote',
                'list', 'bullet',
                'link', 'image',
              ]}
              placeholder='Enter description here...'
            />
            {formik.touched.description && formik.errors.description && (
              <div class="css-1wc848c-MuiFormHelperText-root" style={{ color: '#D32F2F' }}>{formik.errors.description}</div>
            )}


            <Select
              style={{ marginTop: "15px" }}
              fullWidth margin="normal"
              labelId="vendor-label"
              id="vendor"
              name="vendor"
              value={formik.values.vendor}
              onChange={formik.handleChange}
              error={formik.touched.vendor && Boolean(formik.errors.vendor)}
              helperText={formik.touched.vendor && formik.errors.vendor}
            >
              <MenuItem value="" disabled>
                Select a Vendor
              </MenuItem>
              {vendorList.map((vendor) => (
                <MenuItem key={vendor.id} value={vendor.name}>
                  {vendor.name}
                </MenuItem>
              ))}
            </Select>

            <TextField
              fullWidth margin='normal' autoComplete='off'
              label='Timeslots'
              name='timeSlots'
              value={formik.values.timeSlots}
              onChange={formik.handleChange}
              error={formik.touched.timeSlots && Boolean(formik.errors.timeSlots)}
              helperText={formik.touched.timeSlots && formik.errors.timeSlots}
            />
            <Grid container spacing={2}>

              <Grid item xs={4} md={4} lg={4} >
                <TextField
                  fullWidth margin='normal' autoComplete='off'
                  label="Price"
                  name='price'
                  type="number"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                />

              </Grid>

              <Grid item xs={4} md={4} lg={4} >
                <TextField
                  fullWidth margin='normal' autoComplete='off'
                  label="Slots"
                  name='slots'
                  type="number"
                  value={formik.values.slots}
                  onChange={formik.handleChange}
                  error={formik.touched.slots && Boolean(formik.errors.slots)}
                  helperText={formik.touched.slots && formik.errors.slots}
                />

              </Grid>



              <Grid item xs={4} md={4} lg={4} >
                <Select
                  style={{ marginTop: "15px" }}
                  fullWidth margin="normal"
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  error={formik.touched.category && Boolean(formik.errors.category)}
                  helperText={formik.touched.category && formik.errors.category}
                >
                  <MenuItem value="" disabled>
                    Select a Category
                  </MenuItem>
                  {categoryList.map((category) => (
                    <MenuItem key={category.id} value={category.name}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>

              </Grid>
            </Grid>


            <FormControlLabel
              control={<Switch onChange={(e) => setIsMemberPriceVisible(e.target.checked)} />}
              label="Member Price"
            />

            {isMemberPriceVisible && (
              <Grid item xs={4} md={4} lg={4}>
                <TextField
                  fullWidth
                  margin="normal"
                  autoComplete="off"
                  label="Member Price"
                  name="memprice"
                  type="number"
                  value={formik.values.memprice}
                  onChange={formik.handleChange}
                  error={formik.touched.memprice && Boolean(formik.errors.memprice)}
                  helperText={formik.touched.memprice && formik.errors.memprice}
                />
              </Grid>
            )}


            <Box sx={{ mt: 2 }}>



              <Button variant="contained" type="submit" className='addbtn'>
                Make Changes
              </Button>
            </Box>

          </Grid>
        </Grid>


        <Dialog open={open} onClose={handleClose} >
        <img src='https://cdn-icons-png.flaticon.com/512/3588/3588294.png' style={{ minWidth: "20%" }} alt="warning" className='noti-icon' />

        <DialogTitle>
          Delete Service
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this service?
          </DialogContentText>
        </DialogContent>
        <DialogActions>

          <Button variant="contained" color="error" className='noti-btn'
            onClick={deleteService}>
            Delete
          </Button>

        </DialogActions>
        <DialogActions>
          <Button variant="contained" color="inherit" className='noti-btn'
            onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>

      </Dialog>

      <Dialog open={isDeleted} onClose={handleClose}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flat_tick_icon.svg/768px-Flat_tick_icon.svg.png" className='noti-icon' />

        <DialogTitle>
          Service has been deleted
        </DialogTitle>
      </Dialog>



      </Box>

    </Container>
  );
}
export default EditService;