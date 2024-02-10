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
import { CheckIfDataIsArray } from './constant';


function Home() {
  const [services, setServices] = useState([]);
  const carouselItems = [
    {
      name: "Random Name #1",
      description: "Probably the most random thing you have ever seen!",
      img: "/assets/home/1.jpg"
    },
    {
      name: "Random Name #2",
      description: "Hello World!",
      img: "/assets/home/2.jpg"
    },
    {
      name: "Random Name #2",
      description: "Hello World!",
      img: "/assets/home/3.jpg"
    },
    {
      name: "Random Name #2",
      description: "Hello World!",
      img: "/assets/home/4.jpg"
    },
    {
      name: "Random Name #2",
      description: "Hello World!",
      img: "/assets/home/5.jpg"
    }
  ]

  const categoryItems = [
    {
      title: "Dine & Wine",
      icon: <LocalDiningRounded />,
      code: 'dinewine'
    },
    {
      title: "Family Bonding",
      icon: <FamilyRestroomRounded />,
      code: "familybonding"
    },
    {
      title: "Hobbies & Wellness",
      icon: <SpaRounded />,
      code: "hobbieswellness"
    },
    {
      title: "Sport & Advanture",
      icon: <SportsBasketballRounded />,
      code: "sportadvanture"
    },
    {
      title: "Travel",
      icon: <FlightRounded />,
      code: "travel"
    }
  ]

  const eventItems = [
    {
      "id": 1,
      "image": "https://avionrx.blob.core.windows.net/avalon/899e398c-dce7-4935-b3f8-934a9d76faa1?v=20240108052937",
      "name": "Good Old Days Asian Dinner Buffet (Adult)",
      "description": "Good Old Days Food Court will delight you and your loved ones with its diverse range of tantalising local favourites",
      "category": "Dine & Wine",
      "price": 25,
      "memPrice": 20,
      "timeSlots": "12:00",
      "slots": 12,
      "vendor": "Vendor1",
      "createdAt": "2024-02-01T23:53:51",
      "updatedAt": "2024-02-01T23:53:51",
      "categoryID": 4,
      "catName": null
    },
    {
      "id": 2,
      "image": "https://avionrx.blob.core.windows.net/avalon/831ab6d4-dbdf-431c-b737-f4163f42d6dd",
      "name": "4-Hour Guided Mangrove Kayaking Adventure",
      "description": "The journey begins with a short length of open sea kayaking before entering the mangroves. You will immediately notice a sharp difference between the choppy open sea waves and tranquil calm waters among the mangroves.",
      "category": "Hobbies & Wellness",
      "price": 105.84,
      "memPrice": 65,
      "timeSlots": "10:00",
      "slots": 10,
      "vendor": "Vendor2",
      "createdAt": "2024-02-01T23:53:28",
      "updatedAt": "2024-02-01T23:53:28",
      "categoryID": 5,
      "catName": null
    },
    {
      "id": 3,
      "image": "https://avionrx.blob.core.windows.net/avalon/49899df7-6dc8-4a1f-a8e9-73e61c9e3020",
      "name": "5D4N BALI Fairfield By Marriott Legian By Garuda Airlines (Special Dep 2024)",
      "description": "Discover a relaxed tropical getaway at Fairfield by Marriott Bali Legian with easy access to Bali's best nightlife like JA'AN, La Favela, Motel Mexicola, Cafe del Mar, and attractions, such as Double Six beach and Beachwalk Shopping Centers.",
      "category": "Travel",
      "price": 778,
      "memPrice": 728,
      "vendor": "Vendor2",
    },
    {
      "id": 4,
      "image": "https://avionrx.blob.core.windows.net/avalon/b27964ca-1400-44b5-8681-12ae21b8b171",
      "name": "Private Yacht Rental (inclusive of BBQ pit usage onboard)",
      "description": "Set off into the sparkling sea as you enjoy hours of fun under the sun with your private party.",
      "category": "Hobbies & Wellness",
      "price": 699,
      "memPrice": 529,
      "vendor": "Vendor2"
    },
    {
      "id": 5,
      "image": "https://avionrx.blob.core.windows.net/avalon/39969f1f9f404fcead7aa07736a0d5cb",
      "name": "Songkran Kids Festival Weekend Splash Pass!",
      "description": "Elephant Themed Inflatables, Dance Parties, DJ Tryouts, Water Fights, Splash Activities and more!",
      "category": "Travel",
      "price": 50,
      "memPrice": null,
      "vendor": "Vendor2"
    },
    {
      "id": 6,
      "image": "https://avionrx.blob.core.windows.net/avalon/2ec3d4af-a94c-488a-afb3-b2f3e10ebceb",
      "name": "Sentosa 4D AdventureLand 2-in-1 Special",
      "description": "Sentosa's high-tech interactive entertainment zone is home to a diverse and exciting collection of highly sensorial experiences at Imbiah Lookout.",
      "category": "Hobbies & Wellness",
      "price": 26.50,
      "memPrice": 25,
      "vendor": "Vendor2"
    },
    {
      "id": 7,
      "image": "https://avionrx.blob.core.windows.net/avalon/439e7272-987c-47a5-8092-37219efad251",
      "name": "2D1N Talula Hill Farm Stay",
      "description": "Embark on an enchanting journey to Kluang, a quaint town with a blend of modernity and tradition.",
      "category": "Travel",
      "price": 228,
      "memPrice": null,
      "vendor": "Vendor2"
    }
  ]

  useEffect(() => {
    http.get('/Product/getservice')
      .then((res) => {
        try {
          const data = CheckIfDataIsArray(res.data)
          setServices(data);
        }
        catch {
          setServices([])
        }
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
            {categoryItems.map((item, i) =>
              <Link to={"/experiences?category=" + item.code} key={i} className='link'>
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
        <Typography variant="h5" style={{ marginBottom: "5px", fontWeight: "bold", marginTop: "40px" }}>Sweet Experiences With Your Sweetheart</Typography>
        <div id='eventList' >
          {services.map((event, i) => {
            if (i < 7) {
              const icon = categoryItems.find((cat) => cat.title === event.category)?.icon
              return (<EventCard key={i} events={event} icon={icon} />)
            }
          })}
          <Link to={"/experiences"} className='link'>
            <Card>
              <CardActionArea style={{ textAlign: "center", display: "flex", placeContent: "center", alignItems: "center", height: "100%", fontWeight: "bold", backgroundColor: "black", color: "white" }}>
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