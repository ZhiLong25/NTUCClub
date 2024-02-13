import Carousel from 'react-material-ui-carousel'
import "../index.css";
import { Card, CardActionArea, Typography, ListItem, ListItemIcon, ListItemButton, ListItemText, List } from '@mui/material';
import { FamilyRestroomRounded, FlightRounded, LocalDiningRounded, SpaRounded, SportsBasketballRounded } from '@mui/icons-material';
import TelegramCard from './components/telegram';
import FriendsOfUPlayCard from './components/friends_of_uplay';
import EventCard from './components/event';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import http from '../http';
import { CheckIfDataIsArray, sampleCategoryItems, GetCategoryCodeName, sampleExperienceItems } from './constant';


function Home() {
  const [services, setServices] = useState([]);
  const carouselItems = [
    { img: "/assets/home/1.jpg" },
    { img: "/assets/home/2.jpg" },
    { img: "/assets/home/3.jpg" },
    { img: "/assets/home/4.jpg" },
    { img: "/assets/home/5.jpg" }
  ]

  useEffect(() => {
    http.get('/Product/getservice')
      .then((res) => {
        const data = CheckIfDataIsArray(res.data)
        setServices(data);
      })
      .catch((err) => {
        console.log(err)
      })
  }, []);


  return (
    <div id='homepage'>
      {/* DOC: https://github.com/Learus/react-material-ui-carousel/blob/master/README.md */}
      <Carousel className="carouselBanner" indicators={false} animation={"slide"} duration={750} navButtonsAlwaysVisible={true}>
        {carouselItems.map((item, i) => <img key={i} src={item.img} className='carouselImg' />)}
      </Carousel>

      {/* GRID VIEW */}
      <div className='gridCTA'>
        <div className='gridTwoCTA'>
          <FriendsOfUPlayCard />
          <TelegramCard />
        </div>
        <div id="categoryList">
          <List id="categoryListItem" subheader={<label id='categoryListTitle'>Category</label>}>
            {sampleCategoryItems.map((item, i) =>
              <Link to={"/experiences?category=" + GetCategoryCodeName(item.title)} key={i} className='link'>
                <ListItem disablePadding disableGutters >
                  <ListItemButton>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.title} />
                  </ListItemButton>
                </ListItem>
              </Link>
            )}
          </List>
        </div>
      </div>

      {/* EVENTS */}
      <div id='eventShowcase'>
        <Typography variant="h5" style={{ marginBottom: "5px", fontWeight: "bold", marginTop: "40px" }}>
          Sweet Experiences With Your Sweetheart
        </Typography>
        <div id='eventList' >
          {services.map((event, i) => { if (i < 7) { return (<EventCard key={i} events={event} />) } })}
          <Link to={"/experiences"} className='link'>
            <Card>
              <CardActionArea style={{ padding: "20px", textAlign: "center", display: "flex", placeContent: "center", alignItems: "center", height: "100%", fontWeight: "bold", backgroundColor: "black", color: "white" }}>
                Explore More<br />Experiences
              </CardActionArea>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home