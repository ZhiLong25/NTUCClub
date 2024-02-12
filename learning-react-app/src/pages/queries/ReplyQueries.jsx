import React, { useState } from 'react';
import { Box, Typography, Card, TextField, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import http from '../../http';
import { useFormik } from 'formik';
import * as yup from 'yup';

import SendIcon from '@mui/icons-material/Send';

function ReplyQueries({ queryId, onClose }) {
  const formik = useFormik({
    initialValues: {
      QueryReply: '',
    },
    validationSchema: yup.object({
      QueryReply: yup.string().trim().required('Reply content is required'),
    }),
    onSubmit: (data) => {
      http.put(`/Query/QueryID/${queryId}`, { QueryReply: data.QueryReply })
        .then(() => {
          toast.success('Query replied successfully');
          onClose(); // Close the reply modal or navigate back to the queries list
        })
        .catch((err) => {
          console.error(err);
          toast.error('Failed to reply to query');
        });
    },
  });

  return (
    <Card style={{ marginTop: '8%', background: 'white', borderRadius: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '48em', position: 'relative' }}>
      <Typography variant="h5" sx={{ my: 2 }} style={{ marginTop: '5%' }}>
        Reply to Query
      </Typography>
      <Box component="form" sx={{ maxWidth: '500px' }} onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Query Reply"
          name="QueryReply"
          value={formik.values.QueryReply}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.QueryReply && Boolean(formik.errors.QueryReply)}
          helperText={formik.touched.QueryReply && formik.errors.QueryReply}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          style={{ background: '#03C04A' }}
          type="submit"
          startIcon={<SendIcon />}
        >
          Send Reply
        </Button>
      </Box>
      <ToastContainer />
    </Card>
  );
}

export default ReplyQueries;
