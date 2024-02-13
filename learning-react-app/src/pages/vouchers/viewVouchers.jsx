import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, Button, Grid, CardContent } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import http from '../../http';
import DescriptionIcon from '@mui/icons-material/Description';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

function ViewVouchers() {
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setID] = useState(null);
  const [user, setUser] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [userMobileNumber, setUserMobileNumber] = useState('');

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      http.get('/user/auth').then((res) => {
        console.log(res.data.user);
        setUser(res.data.user);
      });
    }
  }, []);

  const generateRandomCode = () => Math.floor(100000 + Math.random() * 900000);

  const sendEmailToUser = (userEmail, code) => {
    // Check if emailjs is initialized
    if (window.emailjs) {
      window.emailjs.send('service_qhtp69m', 'template_dflgof5', { user_email: userEmail, message: `Your redemption code is: ${code}` }, 'un_wt1KWNfUgrWWvA')
        .then(
          (response) => {
            console.log('Email sent:', response);
          },
          (error) => {
            console.error('Error sending email:', error);
          }
        );
    } else {
      console.error('emailjs is not initialized.');
    }
  };

  const handleYesClick = () => {
    const verificationCode = generateRandomCode();

    sendEmailToUser(user?.email, verificationCode);

    handleClose();
  };

  useEffect(() => {
    http.get("/Voucher")    //admin can only view and edit where vouchers for everyone
      .then((res) => {
        const modifiedData = res.data.map(item => ({
          ...item,
          voucher_Validity: new Date(item.voucher_Validity).toLocaleString(),
        }));
        setVouchers(modifiedData)
      })
    http.get(`Voucher/GetName/${-1}`)
      .then((res) => {
        // Assuming the response is an array of voucher names
        // Modify this part based on the actual response structure
        const voucherNames = res.data;

        // Update the state with the voucher names
        // This can be used for searching later
        setVoucherNames(voucherNames);
      });

  }, [])

  // Filter vouchers based on the search term
  const filteredVouchers = vouchers.filter((voucher) =>
    voucher.voucher_Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const claim = (id) => {
    console.log(user.id)
    http.put(`User/claim/${user.id}/${id}`).then(() => {
      toast.success("Successfully claimed")
    }).catch((err) => {
      toast.error(err)
    })
  }

  const handleOpen = (id) => {
    setID(id)
    console.log(id)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Typography variant="h4" sx={{ ml: 1, mt: 8, fontWeight: 'bold', color: '#E6533F' }}>
        All Vouchers
      </Typography>

      <Grid container spacing={2} style={{ marginTop: "1%", marginBottom: "5%" }}>
        {filteredVouchers.map((voucher, i) => (
          <Grid item xs={12} md={6} lg={4} key={voucher.id}>
            <Card>
              <Box style={{ marginTop: "5%" }}>
                {voucher.voucher_Image && (
                  <img
                    component="img"
                    alt="tutorial"
                    style={{
                      borderRadius: "150%",
                      height: "200px",
                      width: "200px",
                      margin: "auto",
                    }}
                    src={`${import.meta.env.VITE_FILE_BASE_URL}${voucher.voucher_Image}`}
                  />
                )}
              </Box>
              <CardContent style={{ margin: "auto" }}>

                <Box sx={{ display: 'flex', mb: 5, mt: 2 }}
                  color="text.secondary">
                  <Typography style={{ fontWeight: "bold", textAlign: "center", color: "black", fontSize: "1.2rem", flex: "3" }}>
                    {<div style={{ display: 'flex', alignItems: 'center' }}>
                      {voucher.voucher_Name}
                    </div>}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', mb: 1 }}
                  color="text.secondary">
                  <Typography style={{ textAlign: "center", color: "black", fontSize: "0.85rem", flex: "3" }}>
                    {<div style={{ display: 'flex', alignItems: 'center' }}>
                      <DriveFileRenameOutlineIcon style={{ marginRight: 8, fontSize: "18px" }} />
                      <span style={{ fontWeight: "bold" }}>Voucher Name:</span> &nbsp; {voucher.voucher_Name}
                    </div>}
                  </Typography>

                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                  color="text.secondary">
                  <Typography style={{ textAlign: "center", color: "black", fontSize: "0.85rem" }}>
                    {<div style={{ display: 'flex', alignItems: 'center' }}>
                      <DescriptionIcon style={{ marginRight: 8, fontSize: "18px" }} />
                      <span style={{ fontWeight: "bold" }}>Voucher Details:</span> &nbsp; {voucher.voucher_Details}

                    </div>}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                  color="text.secondary">
                  <Typography style={{ textAlign: "center", color: "black", fontSize: "0.85rem" }}>
                    {<div style={{ display: 'flex', alignItems: 'center' }}>
                      <AccessTimeIcon style={{ marginRight: 8, fontSize: "18px" }} />
                      <span style={{ fontWeight: "bold" }}>Valid Till:</span> &nbsp; {voucher.voucher_Validity}

                    </div>}
                  </Typography>
                </Box>

                <CardContent style={{ margin: "auto" }}>
                  <Button fullWidth variant="contained" sx={{ mt: 2 }}
                    style={{ backgroundColor: "#E6533F", padding: "10px", fontSize: "1rem", fontWeight: "bold" }}
                    onClick={() => handleOpen(voucher.id)} id={voucher.id}>
                    Claim Voucher
                  </Button>
                </CardContent>
              </CardContent>
            </Card>
          </Grid>

        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <div style={{ padding: '5%', width: '500px' }}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3588/3588294.png"
            style={{ height: "50px", width: "50px", margin: "auto" }}
            alt="warning"
            className="noti-icon"
          />
          <DialogTitle style={{ textAlign: 'center'}}>Would you like to redeem this voucher?</DialogTitle>
          <DialogContent>
            <DialogContentText style={{ textAlign: 'center' }}>A code will be sent to your phone number via SMS.</DialogContentText>
          </DialogContent>
          <DialogActions style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              fullWidth
              variant="contained"
              style={{
                width: "48%", // Adjust width as needed
                backgroundColor: "#03C04A",
                color: "white",
              }}
              onClick={(handleYesClick)}
            >
              Yes
            </Button>
            <Button
              variant="contained"
              color="inherit"
              style={{ width: "48%" }} // Adjust width as needed
              onClick={handleClose}
            >
              Cancel
            </Button>
          </DialogActions>
        </div>
      </Dialog>

      <ToastContainer />
    </div>
  )
}

export default ViewVouchers



