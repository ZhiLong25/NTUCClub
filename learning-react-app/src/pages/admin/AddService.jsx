import { useNavigate } from 'react-router-dom';
import { Container, OutlinedInput, Box, Card, CardMedia, CardHeader, IconButton, Typography, TextField, Button, InputLabel, ListItemIcon, Select, MenuItem, Grid, Chip, ListItemText } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput';
import * as yup from 'yup';
import http from '../../http';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/product.css'
import { useTheme } from '@mui/material/styles';
import { CheckIfDataIsArray, sampleCategoryItems, GetCategoryCodeName } from '../constant';
import { DeleteRounded, CancelRounded, UploadRounded, AddRounded } from '@mui/icons-material';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';


function AddService() {
  const navigate = useNavigate();
  const [isMemberPriceVisible, setIsMemberPriceVisible] = useState(false);
  const [vendorList, setVendorList] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [blobImage, setBlobImage] = useState('');
  const [value, setValue] = useState(null);
  const formOptions = { headers: { 'Content-Type': 'multipart/form-data' } }

  useEffect(() => {
    http.get('/Vendor/getvendor')
      .then((res) => {
        const data = CheckIfDataIsArray(res.data)
        setVendorList(data);
      });
  }, []);

  const handleDeleteImage = (index) => {
    setImageFiles((prevImageFiles) => {
      const newImageFiles = [...prevImageFiles];
      newImageFiles.splice(index, 1);
      return newImageFiles;
    });
  };

  const converImageToBlob = (files) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Image = event.target.result.split(',')[1];
      const binaryImage = atob(base64Image);
      const arrayBuffer = new ArrayBuffer(binaryImage.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < binaryImage.length; i++) {
        uint8Array[i] = binaryImage.charCodeAt(i);
      }

      const blob = new Blob([uint8Array], { type: 'image/jpeg' });
      setBlobImage(blob)
    };
    reader.readAsDataURL(files[0]);
  }

  const sendImageToTelegram = (title, description) => {
    const removeHTMLDescription = description.replace(/<[^>]*>?/gm, '')
    const caption = `<b>${title}</b>\n\n${removeHTMLDescription}`;
    const formData = new FormData();
    formData.append('photo', blobImage, 'image.jpg');
    formData.append('chat_id', '-1002088213559');
    formData.append('caption', caption);
    formData.append('parse_mode', 'HTML');
    http.post("https://api.telegram.org/bot6933338568:AAFGiQqnJ1S5wQnowUebvVhnoOA-BlSSFSs/sendPhoto", formData, formOptions)
  }

  const onFileChange = (e) => {

    const files = e.target.files;
    converImageToBlob(files)
    if (files) {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        if (file.size > 1024 * 1024) {
          toast.error('Maximum file size is 1MB');
          return;
        }
        formData.append('files', file);
      });

      http.post('/file/upload-multiple', formData, formOptions)
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
          sendImageToTelegram(data.name, data.description);

          navigate("/admindash");

        })
    }
  });


  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = { PaperProps: { style: { maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP, width: 250 } } };
  const names = ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
  const theme = useTheme();
  const uploadImgPaddingValue = imageFiles.length === 0 ? "16px" : "";
  const uploadImgMarginValue = imageFiles.length === 0 ? "0" : "20px 0 0 0"

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
      <Typography variant='h5' style={{ marginTop: "20px", marginBottom: "10px" }}>Add Experience</Typography>

      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          {/* FORM FIELDS */}
          <Grid item display={"grid"} gap={"15px"}>
            <TextField
              fullWidth
              autoComplete="off"
              label="Title"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />

            <ReactQuill
              placeholder='Description'
              style={{ borderRadius: "10px" }}
              value={formik.values.description}
              onChange={(value) => formik.setFieldValue('description', value)}
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                  [{ list: 'ordered' }, { list: 'bullet' }], ['link', 'image'], ['clean']
                ],
              }}
              formats={['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'link', 'image']}
            />
            {formik.touched.description && formik.errors.description && (
              <div class="css-1wc848c-MuiFormHelperText-root" style={{ color: '#D32F2F' }}>{formik.errors.description}</div>
            )}

            <GooglePlacesAutocomplete
              apiKey="AIzaSyB_BVhLtxQ5o8igWibtI9aEtlXjHntnSf0"
              autocompletionRequest={{ componentRestrictions: { country: ['sg'] } }}
              selectProps={{
                value,
                placeholder: 'Location',
                onChange: (newValue) => {
                  setValue(newValue);
                  formik.setFieldValue('location', newValue.label);
                },
              }}
            />

            <Select
              displayEmpty
              fullWidth
              id="vendor"
              name="vendor"
              value={formik.values.vendor}
              onChange={formik.handleChange}
              error={formik.touched.vendor && Boolean(formik.errors.vendor)}
              helperText={formik.touched.vendor && formik.errors.vendor}
            >
              <MenuItem value="" disabled>Vendor</MenuItem>
              {vendorList.map((vendor) => (<MenuItem key={vendor.id} value={vendor.name}>{vendor.name}</MenuItem>))}
            </Select>

            <Select
              multiple
              displayEmpty
              fullWidth
              id="timeslots"
              name="timeslots"
              placeholder='Select a Timeslot'
              value={formik.values.timeslots || []}
              onChange={(event) => {
                const selectedValues = event.target.value;
                formik.setFieldValue('timeslots', Array.isArray(selectedValues) ? selectedValues : [selectedValues]);
              }}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <label>Timeslot</label>;
                }
                else {
                  if (Array.isArray(selected)) {
                    return (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: "5px" }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} value={value} deleteIcon={<CancelRounded />}
                            onDelete={() => {
                              const newSelected = formik.values.timeslots.filter((item) => item !== value);
                              const newSelectedString = newSelected.join(','); // Convert array to string
                              formik.setFieldValue('timeslots', newSelectedString); // Update formik state with the string
                            }}
                          />
                        ))}
                      </Box>
                    );
                  } else {
                    return selected;
                  }
                }
              }}
            >
              <MenuItem value="" disabled>Select a Timeslot</MenuItem>
              {names.map((name) => (
                <MenuItem key={name} value={name} style={getStyles(name, formik.values.timeslots || [], theme)}>
                  {name}
                </MenuItem>
              ))}
            </Select>


            <Grid container spacing={2}>
              <Grid item xs={4} md={4} lg={4} >
                <TextField
                  fullWidth
                  autoComplete='off'
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
                {/* <InputLabel id="slots">Slots</InputLabel> */}
                <TextField
                  fullWidth
                  autoComplete='off'
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
                {/* <InputLabel id="category">Category</InputLabel> */}
                <Select
                  fullWidth
                  displayEmpty
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  error={formik.touched.category && Boolean(formik.errors.category)}
                  helperText={formik.touched.category && formik.errors.category}
                  renderValue={(v) => {
                    if (v.length === 0) {
                      return <label>Category</label>;
                    }
                    return v
                  }}
                >
                  <MenuItem value="" disabled>Category</MenuItem>
                  {sampleCategoryItems.map((category) => (
                    <MenuItem key={category.title} value={category.title}>
                      <ListItemIcon>{category.icon}</ListItemIcon>
                      <ListItemText primary={category.title} />
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>


            <FormControlLabel control={<Switch onChange={(e) => setIsMemberPriceVisible(e.target.checked)} />} label="Member Price" />

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


            {/* ADD BTN */}
            <Box sx={{ mt: 2 }} textAlign={'right'}>
              <Button startIcon={<AddRounded />} variant="contained" type="submit">Add</Button>
            </Box>
          </Grid>

          {/* IMAGE PREVIEW */}
          <Grid item xs={4} md={4} lg={4} >
            <Box sx={{ textAlign: 'center' }} >
              {imageFiles.length > 0 ? (
                <Grid container spacing={2}>
                  {imageFiles.map((image, index) => (
                    <Grid item key={index}>
                      <Box sx={{ mt: 2, position: 'relative' }}>
                        <Card>
                          <CardHeader action={<IconButton onClick={() => handleDeleteImage(index)} sx={{ position: 'absolute', top: '5px', right: '5px' }}><DeleteRounded /></IconButton>} />
                          <CardMedia component="img" image={`${import.meta.env.VITE_FILE_BASE_URL}${image}`} alt={`Image ${index + 1}`} style={{ objectFit: "contain", width: "150px", height: "150px" }} />
                        </Card>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : null}
              <Button startIcon={<UploadRounded />} fullWidth variant='outlined' component='label' style={{ margin: uploadImgMarginValue, padding: uploadImgPaddingValue }}>
                Upload Images
                <input hidden accept="image/*" multiple type="file" onChange={onFileChange} />
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container >
  );
}
export default AddService;