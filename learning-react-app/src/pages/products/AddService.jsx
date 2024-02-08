import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, InputLabel, Select, MenuItem, Grid, Chip } from '@mui/material';
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

import OutlinedInput from '@mui/material/OutlinedInput';
import { useTheme } from '@mui/material/styles';



function AddService() {
  const navigate = useNavigate();
  const [isMemberPriceVisible, setIsMemberPriceVisible] = useState(false);
  const [imageFile, setImageFile] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [timeslotsList, setTimeslots] = useState([]);


  useEffect(() => {
    http.get('/Category/getcategory').then((res) => {
      setCategoryList(res.data);
    });

    http.get('/Vendor/getvendor').then((res) => {
      setVendorList(res.data);
    });

    http.get('/Timeslot/gettimeslots').then((res) => {
      setTimeslots(res.data);
      console.log(res.data.length)
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
      image: 'placeholder.png',
      name: '',
      description: '',
      price: null,
      timeInterval: '',
      starttime: '',
      endtime: '',
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


      timeslots : yup.string().required('Timeslots is required'),
      // timeInterval: yup.string().required('Time interval is required'),
      // starttime: yup.string().required('Start Time is required'),
      // endtime: yup.string().required('End Time is required'),

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
            http.get("https://api.telegram.org/bot6933338568:AAFGiQqnJ1S5wQnowUebvVhnoOA-BlSSFSs/sendMessage?chat_id=-1002088213559&text=%3Cb%3EA%20new%20activities%20has%20been%20added!%3C/b%3E%20Click%20%3Ca%20href=%27google.com%27%3Ehere%3C/a%3E%20to%20see!&parse_mode=HTML")
          navigate("/productdash");

        })
    }
  });


  const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

const [personName, setPersonName] = React.useState([]);
const theme = useTheme();

const handleChange = (event) => {
  const {
    target: { value },
  } = event;
  setPersonName(
    // On autofill we get a stringified value.
    typeof value === 'string' ? value.split(',') : value,
  );
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

  return (
    <Container>
      <Typography variant='h5' sx={{ my: 2 }} style={{ marginTop: "5%" }}>
        Add Events / Services
      </Typography>


    <InputLabel id="demo-multiple-chip-label">Title</InputLabel>
    <Select
        style={{ width: "100%"}}
        labelId="demo-multiple-chip-label" // <- Specify labelId
        id="demo-multiple-chip"
        multiple
        value={personName}
        onChange={handleChange}
        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {names.map((name) => (
          <MenuItem
            key={name}
            value={name}
            style={getStyles(name, personName, theme)}
          >
            {name}
          </MenuItem>
        ))}
      </Select>
      

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

            {/* <Grid container spacing={2}>

              <Grid item xs={4} md={4} lg={4} >

                <TimePicker
                  label="Duration Time"
                  value={formik.values.timeInterval}
                  onChange={(value) => formik.setFieldValue('timeInterval', value)}
                  error={formik.touched.timeInterval && Boolean(formik.errors.timeInterval)}
                  helperText={formik.touched.timeInterval && formik.errors.timeInterval}
                />



              </Grid>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['TimePicker', 'TimePicker']}>
                  <Grid item xs={4} md={4} lg={4} >

                    <TimePicker
                      label="Start Time"
                      value={formik.values.starttime}
                      onChange={(value) => formik.setFieldValue('starttime', value)}
                      error={formik.touched.starttime && Boolean(formik.errors.starttime)}
                      helperText={formik.touched.starttime && formik.errors.starttime}
                    />
                  </Grid>


                  <Grid item xs={4} md={4} lg={4} >

                    <TimePicker
                      label="End Time"
                      value={formik.values.endtime}
                      onChange={(value) => formik.setFieldValue('endtime', value)}
                      error={formik.touched.endtime && Boolean(formik.errors.endtime)}
                      helperText={formik.touched.endtime && formik.errors.endtime}
                    />
                  </Grid>

                </DemoContainer>
              </LocalizationProvider>
            </Grid> */}


            <Select
                    style={{ marginTop: "15px" }}
                    fullWidth margin="normal"
                    labelId="timeslots-label"
                    id="timeslots"
                    name="timeslots"
                    value={formik.values.timeslots}
                    onChange={formik.handleChange}
                    error={formik.touched.timeslots && Boolean(formik.errors.timeslots)}
                    helperText={formik.touched.timeslots && formik.errors.timeslots}
                    >

                    <MenuItem value="" disabled>
                        Select a timeslot
                    </MenuItem>
                    {timeslotsList.map((timeslot) => (
                        <MenuItem key={timeslot.id} value={timeslot.timeslot}>
                            {timeslot.timeslot}
                        </MenuItem>
                    ))}
                    </Select>

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