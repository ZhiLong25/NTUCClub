import React from 'react'
import { Chip, Typography, Card, CardActionArea, CardHeader, CardMedia, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';


function EventCard(props) {
  // Destructure props to extract the data you need
  const { event, icon } = props;
  const HTMLRegex = /(<([^>]+)>)/ig;
  const finalURL = "/experiences/" + event.id
  var descriptionWithoutHTML = event.description.replace(/(<([^>]+)>)/ig, '');
  descriptionWithoutHTML = descriptionWithoutHTML.replace(/([.,!?])/g, '$1 ');

  return (
    <Link to={finalURL} className='link'>
      <Card variant="outlined" style={{ borderRadius: "10px", height: "100%" }}>
        <CardActionArea style={{ height: "100%" }}>
          <CardHeader subheader={event.vendor} action={icon} />
          <CardMedia style={{ height: 150 }} image={event.image} />
          <CardContent style={{ height: "100%" }}>
            <Typography className='eventTitle' gutterBottom style={{ fontWeight: "bold", fontSize: "large", lineHeight: "normal" }}>{event.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              <div className='eventDescription'>{descriptionWithoutHTML}</div>
              <div className='eventPrice'>
                <label style={{ display: "block", marginTop: "20px" }}>${event.price}</label>
                {event.memPrice != null ?
                  <><label>From</label><label style={{ fontWeight: "bolder", color: "black", marginLeft: "5px", fontSize: "18px" }}>${event.memPrice}</label></> : null
                }
              </div>
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>

  )
}

export default EventCard