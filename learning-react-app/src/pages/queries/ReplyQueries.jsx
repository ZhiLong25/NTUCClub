import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, TextField, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import http from '../../http';
import { useFormik } from 'formik';
import { useParams, Link } from 'react-router-dom';
import * as yup from 'yup';

import SendIcon from '@mui/icons-material/Send';

function ReplyQueries({ onClose }) {
  const { id } = useParams();
  const [query, setQuery] = useState(null);

  useEffect(() => {
    http.get(`/Query/GetQueryID/${id}`).then((res) => {
      setQuery(res.data[0]);
    });
  }, [id]);

  const formik = useFormik({
    initialValues: {
      QueryReply: '',
    },
    validationSchema: yup.object({
      QueryReply: yup
      .string()
      .trim()
      .required('Reply content is required')
      .test('not-replied', 'Query has already been replied', function (value) {
        // Check if the query has already been replied
        return !query || query.queryReply === 'NotReplied';
      }),
    }),
    onSubmit: (data) => {
      data.Email = query.email;
      data.QueryDescription = query.queryDescription;
      data.QuerySubject = query.querySubject;
      data.id = id;

      http.put(`/Query/QueryID/${id}`, data)
        .then(() => {
          toast.success('Query replied successfully');
          onClose(); // Close the reply modal or navigate back to the queries list
        })
        .catch(function (err) {
          toast.error(`${err.response.data.message}`);
        });
    },
  });

  return (
    <Card style={{ marginTop: '8%', background: 'white', borderRadius: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '48em', position: 'relative' }}>

      <Link to="/ViewQueries" style={{ textDecoration: 'none', marginBottom: '10px' }}>
        <Button variant="outlined" style={{ color: '#03C04A', borderColor: '#03C04A', marginBottom: '10px' }}>
          Back to Queries
        </Button>
      </Link>
      <Typography variant="h5" sx={{ my: 2 }} style={{ marginTop: '5%' }}>
        Reply to Query
      </Typography>
      {query && (
        <Box component="form" sx={{ maxWidth: '500px' }} onSubmit={formik.handleSubmit}>
          <Typography variant="body1">
            <strong>Email:</strong> {query.email}
          </Typography>
          <Typography variant="body1">
            <strong>Subject:</strong> {query.querySubject}
          </Typography>
          <Typography variant="body1">
            <strong>Description:</strong> {query.queryDescription}
          </Typography>

          {/* Rest of the form */}
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
      )}
      <ToastContainer />
    </Card>
  );
}

export default ReplyQueries;