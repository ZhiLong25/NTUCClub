import React from 'react'
import { Chip, Typography, Card, CardActionArea, CardHeader, CardMedia, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import { sampleCategoryItems } from '../constant';

function EventCard(props) {
  // Destructure props to extract the data you need
  const { events } = props;
  const finalURL = "/experiences/" + events.id
  var descriptionWithoutHTML = events.description.replace(/(<([^>]+)>)/ig, '');
  descriptionWithoutHTML = descriptionWithoutHTML.replace(/([.,!?])/g, '$1 ');
  var imagelink = import.meta.env.VITE_FILE_BASE_URL + events.image.split(',')[0];
  const categoryIcon = sampleCategoryItems.find((c) => c.title == events.category).icon

  // imagelink = events.image;

  return (
    <Link to={finalURL} className='link'>
      <Card variant="outlined" style={{ height: "100%" }}>
        <CardActionArea>
          <CardHeader subheader={events.vendor} action={categoryIcon} />
          <CardMedia style={{ height: 150 }} image={imagelink} />

          <CardContent style={{ height: "100%" }}>
            <Typography className='eventTitle' gutterBottom style={{ fontWeight: "bold", fontSize: "large", lineHeight: "normal" }}>{events.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              <div className='eventDescription'>{descriptionWithoutHTML}</div>
              <div className='eventPrice'>
                <label style={{ display: "block", marginTop: "20px" }}>${events.price}</label>
                {events.memPrice != null ?
                  <><label>From</label><label style={{ fontWeight: "bolder", color: "black", marginLeft: "5px", fontSize: "18px" }}>${events.memPrice}</label></> : null
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