import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, InputLabel, Select, MenuItem, Grid } from '@mui/material';
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
import '../styles/product.css'

function AddService() {
  const navigate = useNavigate();
  const [isMemberPriceVisible, setIsMemberPriceVisible] = useState(false);
  const [imageFile, setImageFile] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [vendorList, setVendorList] = useState([]);


  useEffect(() => {
    http.get('/Category/getcategory').then((res) => {
      setCategoryList(res.data);
    });

    http.get('/Vendor/getvendor').then((res) => {
      setVendorList(res.data);
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
    initialValues: {
      image: '',
      name: '',
      description: '',
      price: null,
      timeslots: '',
      slots: null,
      vendor: '',
      category: ''

    },

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

      timeslots: yup.string().required('Timeslots is required'),

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
      http.post("/Product/addservice", data)
        .then((res) => {
          console.log(res.data);
          navigate("/productdash");
        })
    }
  });


  return (
    <Container>
      <Typography variant='h5' sx={{ my: 2 }} style={{ marginTop: "5%" }}>
        Add Events / Services
      </Typography>

      <Box component="form" onSubmit={formik.handleSubmit}>

        <Grid container spacing={2}>
          <Grid item xs={4} md={4} lg={4} >
            <Box sx={{ textAlign: 'center', mt: 2 }} >
              {
                imageFile ? (
                  <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                    <img alt="product" src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`} className='image-insert' />
                  </Box>
                ) : (
                  <img src={placeholder} alt="placeholder" className='image-insert' />
                )
              }

              <Button variant="contained" component="label" style={{ marginTop: "20px" }}>
                Upload Image
                <input hidden accept="image/*" multiple type="file" onChange={onFileChange} />
              </Button>
            </Box>
          </Grid>

          <Grid item xs={8} md={8} lg={8} >
            <InputLabel>Title</InputLabel>
            <TextField
              fullWidth margin="normal" autoComplete="off"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <InputLabel>Description</InputLabel>
            <ReactQuill
              style={{ borderRadius: "5px", marginBottom: "10px" }}
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

            <InputLabel>Vendors</InputLabel>
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

            <InputLabel>TimeSlots</InputLabel>
            <TextField
              fullWidth margin='normal' autoComplete='off'
              name='timeslots'
              value={formik.values.timeslots}
              onChange={formik.handleChange}
              error={formik.touched.timeslots && Boolean(formik.errors.timeslots)}
              helperText={formik.touched.timeslots && formik.errors.timeslots}
            />

            <Grid container spacing={2}>
              <Grid item xs={4} md={4} lg={4} >
              <InputLabel>Price</InputLabel>
                <TextField
                  fullWidth margin='normal' autoComplete='off'
                  name='price'
                  type="number"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                />

              </Grid>

              <Grid item xs={4} md={4} lg={4} >
              <InputLabel>Slots</InputLabel>
                <TextField
                  fullWidth margin='normal' autoComplete='off'
                  name='slots'
                  type="number"
                  value={formik.values.slots}
                  onChange={formik.handleChange}
                  error={formik.touched.slots && Boolean(formik.errors.slots)}
                  helperText={formik.touched.slots && formik.errors.slots}
                />

              </Grid>

              <Grid item xs={4} md={4} lg={4} >
              <InputLabel>Category</InputLabel>
                <Select
                  style={{ marginTop: "15px", marginBottom: "10px" }}
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
                  name="memPrice"
                  type="number"
                  value={formik.values.memPrice}
                  onChange={formik.handleChange}
                  error={formik.touched.memPrice && Boolean(formik.errors.memPrice)}
                  helperText={formik.touched.memPrice && formik.errors.memPrice}
                />
              </Grid>
            )}

            <Box sx={{ mt: 2 }}>
              <Button variant="contained" type="submit" className='addbtn'>
                Add
              </Button>
            </Box>

          </Grid>
        </Grid>

      </Box>

    </Container>
  );
}
export default AddService;