import React from 'react'
import { Typography, Button, CardActionArea } from '@mui/material';
import { EmojiEventsRounded } from '@mui/icons-material';


function FriendsOfUPlayCard() {
  return (
    <CardActionArea className='telegramCTA' style={{ backgroundColor: "#588f2e", padding: "60px", borderRadius: "10px", color: "white" }}>
      <EmojiEventsRounded style={{ marginBottom: "5px", fontSize: "42px" }} />
      <Typography variant="h5" display={"block"} style={{ fontWeight: "bold", fontSize: "24px" }}>Unlock Exclusive Benefits</Typography>
      <Typography variant="body">All it takes is your first successful paid booking on UPlay to be a Friend of UPlay and start enjoying privileges!</Typography>
    </CardActionArea>
  )
}

export default FriendsOfUPlayCard