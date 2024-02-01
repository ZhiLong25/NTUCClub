import React, { useEffect, useState } from 'react'
import { Box, Typography, Card, TextField, Button, InputAdornment } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import UserContext from '../../contexts/UserContext';
import http from '../../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Calendar from "react-calendar"


function AddCard() {

  const [user, setUser] = useState(null)
  const [date, setDate] = useState(new Date())

  const detectCardType = (cardNumber) => {
    const firstDigit = cardNumber.charAt(0);

    switch (firstDigit) {
      case '4':
        return 'Visa';
      case '5':
        return 'MasterCard';
      case '3':
        return 'American Express';
      // Add more cases based on your needs
      default:
        return 'Type';
    }
  };

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
      Cvv: "",
      First_Name: "",
      Last_Name: "",
      Voucher_Validity: ""
    },
    validationSchema: yup.object({
      Card_Number: yup.string().trim()
        .max(20, "Card number must be at most 20 characters")
        .required("Card number is required")
        .matches(/^\d{4} \d{4} \d{4} \d{4}$/,
          "Card number must be in the format xxxx xxxx xxxx xxxx"),
      Cvv: yup.string().trim()
        .min(3, 'Cvv must be at least 3 numbers')
        .max(3, 'Cvv must be at most 3 numbers')
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

    onSubmit: async (data) => {
      try {
        data.Card_Number = data.Card_Number.trim();
        data.Card_Name = detectCardType(data.Card_Number);
        data.Cvv = data.Cvv.trim();
        data.First_Name = data.First_Name.trim();
        data.Last_Name = data.Last_Name.trim();
        data.Card_Expiry = date.toISOString();

        if (date < new Date()) {
          toast.error("Invalid date")
        }
        else {
          const response = await http.post("/Card/AddCard", data);

          console.log(response.data);
          toast.success("Card Information Added");
        }
      } catch (error) {
        console.error("Error handling card information", error)
        toast.error("Failed to add card information");
      }
    }
  });

  const getCardIcon = (cardType) => {
    switch (cardType) {
      case 'Visa':
        return 
      case 'Mastercard':
        return "MC"
      case 'American Express':
        return 
      default:
        return null;
    }
  };

  const cardType = detectCardType(formik.values.Card_Number);


  return (
    <Card
      style={{
        marginTop: '8%',
        background: 'white',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2em',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h5" sx={{ my: 2 }}>
        Add Card - {cardType}
      </Typography>
      <Box
        component="form"
        sx={{ maxWidth: '500px', width: '100%' }}
        onSubmit={formik.handleSubmit}
      >
         <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Card Number"
          name="Card_Number"
          value={formik.values.Card_Number}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.Card_Number && Boolean(formik.errors.Card_Number)}
          helperText={formik.touched.Card_Number && formik.errors.Card_Number}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {getCardIcon(cardType)}
              </InputAdornment>
            ),
          }}
          sx={{ mt: 2 }}
        />
        {['Cvv', 'First_Name', 'Last_Name'].map(
          (fieldName) => (
            <TextField
              key={fieldName}
              fullWidth
              margin="dense"
              autoComplete="off"
              label={<div style={{ display: 'flex', alignItems: 'center' }}>{fieldName.replace('_', ' ')}</div>}
              name={fieldName}
              value={formik.values[fieldName]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched[fieldName] && Boolean(formik.errors[fieldName])}
              helperText={formik.touched[fieldName] && formik.errors[fieldName]}
              sx={{ mt: 2 }}
            />
          )
        )}
        <Typography variant="h6" sx={{ my: 2 }}>
        Expiry Date
        </Typography>
        <div >
          <Calendar  
            onChange={onChange} value={date}
          />
        </div>
        <Button fullWidth variant="contained" sx={{ mt: 2, background: '#03C04A' }} type="submit">
          Add Card
        </Button>
      </Box>
      <ToastContainer />
    </Card>
  );
}

export default AddCard