import { Search, Clear, MenuRounded } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, IconButton, Divider, Paper, InputBase, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField } from '@mui/material';
import http from '../../http';
import '../styles/product.css';
import TelegramCard from '../components/telegram';
import { CheckIfDataIsArray } from '../constant';
import EventCard from '../components/event';

function ProductsPage() {
  const [imageFile, setImageFile] = useState('');
  const [serviceList, setServiceList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [totalService, setTotalService] = useState('');
  const [search, setSearch] = useState('');
  const [openFilterDialog, setOpenFilterDialog] = useState(false);


  const onClickClear = () => {
    setSearch('');
    http.get('/Product/getservice')
      .then((res) => {
        const data = CheckIfDataIsArray(res.data)
        setServiceList(data);
        setTotalService(data.length);

      })

    // setSelectedCategories([]);
  }

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const searchServices = () => {
    http.get(`/Product/getservice?search=${search}`)
      .then((res) => {
        const data = CheckIfDataIsArray(res.data)
        setServiceList(data);
      })
  };

  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      searchServices();
    }
  }

  const onClickSearch = () => {
    searchServices();
  }

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
    http.get('/Category/getcategory')
      .then((res) => {
        const data = CheckIfDataIsArray(res.data)
        setCategoryList(data);
      })

    http.get('/Product/getservice')
      .then((res) => {
        const data = CheckIfDataIsArray(res.data)
        setServiceList(data);
        setTotalService(data.length);
        // setServiceList(eventItems)
      })
  }, []);


  return (
    <Box style={{ marginBottom: "60px" }}>
      <Typography variant="h5" style={{ marginBottom: "20px", marginTop: '20px' }}>Events</Typography>

      {/* Filter input */}
      <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', marginTop: "30px" }}>
        <IconButton sx={{ p: '10px' }} onClick={() => setOpenFilterDialog(!openFilterDialog)}><MenuRounded /></IconButton>
        <InputBase autoFocus value={search} onChange={onSearchChange} onKeyDown={onSearchKeyDown} sx={{ ml: 1, flex: 1 }} placeholder="Search for Events" inputProps={{ 'aria-label': 'search events' }} />
        {search.trim() != '' ? <IconButton color="button" onClick={onClickClear} sx={{ p: '10px' }} aria-label="clear"><Clear /></IconButton> : null}
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton type="button" onClick={onClickSearch} sx={{ p: '10px' }} aria-label="search"><Search /></IconButton>
      </Paper>
      <Dialog
        fullWidth={true}
        open={openFilterDialog}
        onClose={() => setOpenFilterDialog(false)}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData).entries());
            console.log(formJson);
            setOpenFilterDialog(false);
          },
        }}

      >
        <DialogTitle style={{ padding: "30px 20px 0px", fontWeight: "bold" }}>Filter</DialogTitle>
        <DialogContent style={{ padding: "0 20px" }}>
          <DialogContentText>Adjust to your needs</DialogContentText>
          <TextField name="email" label="Email Address" type="email" variant="standard" autoFocus required fullWidth />
        </DialogContent>
        <DialogActions style={{ padding: "20px" }}>
          <Button onClick={() => setOpenFilterDialog(false)}>Cancel</Button>
          <Button variant='contained' type='submit' autoFocus>Apply</Button>
        </DialogActions>
      </Dialog>

      {/* Category checkboxes */}
      {serviceList.length != 0 ?
        <Grid gridTemplateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} display={"grid"} marginTop={"20px"} gap={"10px"}>
          {serviceList.map((services, i) => {
            return (<EventCard events={services} key={i} />);
          })}
        </Grid>
        : null}


      {/* TELEGRAM CTA */}
      <TelegramCard />
    </Box>
  )
}

export default ProductsPage