import React from 'react'
import { Telegram } from '@mui/icons-material';
import { Typography, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';


function TelegramCard() {
  const telegramChannel = "https://t.me/uplayassistant"

  return (
    <Link to={telegramChannel} target="_blank" rel="noopener noreferrer" className='link'>
      <CardActionArea className='telegramCTA' style={{ backgroundColor: "#229ED9", padding: "60px", borderRadius: "10px", color: "white" }}>
        <Telegram style={{ marginBottom: "5px", fontSize: "42px" }} />
        <Typography variant="h5" display={"block"} style={{ fontWeight: "bold", fontSize: "24px" }}>We're now on Telegram</Typography>
        <Typography variant="body">Click to join our channel to recieve exciting new activities, vouchers & promotions!</Typography>
      </CardActionArea>
    </Link>
  )
}

export default TelegramCard