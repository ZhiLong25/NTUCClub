import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, InputLabel, ListItemIcon, Select, MenuItem, Grid, Chip, ListItemText } from '@mui/material';
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
import CancelIcon from '@mui/icons-material/Cancel';
import { CheckIfDataIsArray, sampleCategoryItems, GetCategoryCodeName } from '../../pages/constant';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

function AddService() {
  const navigate = useNavigate();
  const [isMemberPriceVisible, setIsMemberPriceVisible] = useState(false);
  // const [categoryList, setCategoryList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  const [value, setValue] = useState(null);

  useEffect(() => {
    // http.get('/Category/getcategory').then((res) => {
    //   setCategoryList(res.data);
    // });

    http.get('/Vendor/getvendor').then((res) => {
      setVendorList(res.data);
    });

  }, []);

  const handleDeleteImage = (index) => {
    setImageFiles((prevImageFiles) => {
      const newImageFiles = [...prevImageFiles];
      newImageFiles.splice(index, 1);
      return newImageFiles;
    });
  };

  const onFileChange = (e) => {
    const files = e.target.files;
    if (files) {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        if (file.size > 1024 * 1024) {
          toast.error('Maximum file size is 1MB');
          return;
        }
        formData.append('files', file);
      });
      http.post('/file/upload-multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then((res) => {
          setImageFiles((prevImageFiles) => [...prevImageFiles, ...res.data.filenames]);
          console.log(imageFiles)
        })
        .catch((error) => {
          console.log(error);
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
      location: '',
      slots: null,
      vendor: '',
      category: ''

    },
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

      // location: yup.string().required('Location is required'),

      timeslots: yup.array().min(1, 'Timeslots is required').of(yup.string().required('Timeslot is required')),
      slots: yup.number().required('Slots amount is required'),

      vendor: yup.string().trim()
        .min(3, "Vendor must be at least 3 characters")
        .max(100, 'Vendor must be at most 100 characters')
        .required('Vendor is required'),

      category: yup.string().required('Category is required')

    }),

    onSubmit: (data) => {

      const imageFilesAsString = imageFiles.join(',');
      data.image = imageFilesAsString;

      data.timeslots = data.timeslots.join(', ');

      if (imageFilesAsString) {
        data.image = imageFilesAsString;
      }
      console.log("Submit button clicked");
      console.log(data)
      http.post("/Product/addservice", data)
        .then((res) => {
          console.log(res.data);
          // http.get("https://api.telegram.org/bot6933338568:AAFGiQqnJ1S5wQnowUebvVhnoOA-BlSSFSs/sendMessage?chat_id=-1002088213559&text=%3Cb%3EA%20new%20activities%20has%20been%20added!%3C/b%3E%20Click%20%3Ca%20href=%27google.com%27%3Ehere%3C/a%3E%20to%20see!&parse_mode=HTML")
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
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
  ];

  const theme = useTheme();

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

      <Box component="form" onSubmit={formik.handleSubmit}>

        <Grid container spacing={2}>
          <Grid item xs={4} md={4} lg={4} >
            <Box sx={{ textAlign: 'center', mt: 2 }} >
              {imageFiles.length > 0 ? (
                <Grid container spacing={2}>
                  {imageFiles.map((image, index) => (
                    <Grid item key={index}>
                      <Box sx={{ mt: 2, position: 'relative' }}>
                      <IconButton
                          onClick={() => handleDeleteImage(index)}
                          sx={{ position: 'absolute', top: '5px', right: '5px' }}
                        >
                          <DeleteIcon />
                        </IconButton>

                        <img
                          alt={`Image ${index + 1}`}
                          src={`${import.meta.env.VITE_FILE_BASE_URL}${image}`}
                          style={{ maxWidth: "100px", maxHeight: "100px" }}
                        />

                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <img src={placeholder} alt="placeholder" />
              )}
              <Button variant="contained" component="label" style={{ marginTop: "20px" }}>
                Upload Image
                <input hidden accept="image/*" multiple type="file" onChange={onFileChange} />
              </Button>
            </Box>
          </Grid>

          <Grid item xs={8} md={8} lg={8} >
            <InputLabel id="title">Title</InputLabel>

            <TextField
              fullWidth margin="normal" autoComplete="off"
              label="Title"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />

            <InputLabel id="description">Description</InputLabel>

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


            <InputLabel id="location-label">Location</InputLabel>

            <GooglePlacesAutocomplete
              placeholder="Type a place"
              apiKey="AIzaSyAqS06SaOm9qPZ25jGGECjCyAAbnKd_jLg"
              autocompletionRequest={{
                componentRestrictions: {
                  country: ['sg'] // Restrict to Singapore only
                }
              }}
              selectProps={{
                value,
                onChange: (newValue) => {
                  setValue(newValue);
                  // Set the location field in Formik form state
                  formik.setFieldValue('location', newValue.label);
                },
              }}

            />


            {/* Your existing code */}

            <InputLabel id="vendor-label">Vendor</InputLabel>

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


            <InputLabel id="timeslot">Timeslots</InputLabel>
            <Select
              style={{ width: "100%" }}
              labelId="demo-multiple-chip-label"
              id="timeslots"
              name="timeslots"
              multiple
              value={formik.values.timeslots || []}
              onChange={(event) => {
                const selectedValues = event.target.value;
                console.log('Timeslots', selectedValues);
                formik.setFieldValue('timeslots', Array.isArray(selectedValues) ? selectedValues : [selectedValues]); // Ensure it's always an array
              }}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => {
                if (Array.isArray(selected)) {
                  return (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          value={value}
                          onDelete={() => {
                            const newSelected = formik.values.timeslots.filter((item) => item !== value);
                            const newSelectedString = newSelected.join(','); // Convert array to string
                            formik.setFieldValue('timeslots', newSelectedString); // Update formik state with the string
                          }}
                          deleteIcon={<CancelIcon />}
                        />
                      ))}
                    </Box>
                  );
                } else {
                  return selected;
                }
              }}
            >
              {names.map((name) => (
                <MenuItem
                  key={name}
                  value={name}
                  style={getStyles(name, formik.values.timeslots || [], theme)}
                >
                  {name}
                </MenuItem>
              ))}
            </Select>


            <Grid container spacing={2}>

              <Grid item xs={4} md={4} lg={4} >
                <InputLabel id="price">Price</InputLabel>

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
                <InputLabel id="slots">Slots</InputLabel>

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
                <InputLabel id="category">Category</InputLabel>
                <Select
                  style={{ marginTop: "15px" }}
                  fullWidth margin="normal"
                  renderValue={(v) => v}
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
                  {sampleCategoryItems.map((category) => (
                    <MenuItem key={category.title} value={category.title}>

                      <ListItemIcon>{category.icon}

                      </ListItemIcon>
                      <ListItemText primary={category.title} />

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
                <InputLabel id="memprice">Member Price</InputLabel>

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