import { Search, Clear, MenuRounded, SearchOffRounded, CategoryRounded, ExpandLessRounded, ExpandMoreRounded, SwapVertRounded } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, IconButton, Divider, Paper, InputBase, Button, FormControl, InputLabel, Select, OutlinedInput, MenuItem, Checkbox, ListItemText, Chip, Alert, AlertTitle, Collapse, List, ListSubheader, ListItemButton, ListItemIcon, FormGroup, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import http from '../../http';
import '../styles/product.css';
import { CheckIfDataIsArray, sampleExperienceItems, sampleCategoryItems, sortList } from '../constant';
import EventCard from '../components/event';

function ProductsPage() {
  const [serviceList, setServiceList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [search, setSearch] = useState('');
  const [openSortFilter, setOpenSortFilter] = useState(false);
  const [openCategoryFilter, setOpenCategoryFilter] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedSort, setSelectedSort] = useState("recentlyadded");

  const onClickClear = () => {
    setSearch('');
    http.get('/Product/getservice')
      .then((res) => {
        const data = CheckIfDataIsArray(res.data)
        setServiceList(data);
      })
  }

  const searchServices = () => {
    http.get(`/Product/getservice?search=${search}&sort=${selectedSort}`)
      .then((res) => {
        const data = CheckIfDataIsArray(res.data)
        setServiceList(data);
      })
  };

  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      onClickSearch();
    }
  }

  const onClickSearch = () => {
    searchServices()
    console.log("selectedCategory:", selectedCategory)
    console.log("selectedSort:", selectedSort)
  }


  useEffect(() => {
    http.get('/Category/getcategory')
      .then((res) => {
        const data = CheckIfDataIsArray(res.data)
        setCategoryList(data);
        setCategoryList(sampleCategoryItems);
      })

    http.get('/Product/getservice')
      .then((res) => {
        const data = CheckIfDataIsArray(res.data)
        setServiceList(data);
        setServiceList(sampleExperienceItems)
      })
  }, []);



  const handleCategoryChange = (event) => {
    const { value } = event.target;
    if (selectedCategory.includes(value)) {
      const updatedCategory = selectedCategory.filter(category => category !== value);
      setSelectedCategory(updatedCategory);
    } else {
      setSelectedCategory([...selectedCategory, value]);
    }
  };

  return (
    <Box style={{ padding: "30px 0 20px" }}>
      {/* <Typography variant="h5" style={{ marginBottom: "20px", marginTop: '20px' }}>Experiences</Typography> */}
      <Box display={"grid"} gridTemplateColumns={"300px 1fr"} gap={"30px"}>
        <Box className="searchAndFilterSection">
          <Box position={"sticky"} top={"30px"}>
            {/* SEARCH BAR */}
            <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}>
              <InputBase style={{ marginLeft: "15px", padding: "5px 0" }} autoFocus fullWidth value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={onSearchKeyDown} placeholder="Search for Experiences" />
              {search.trim() != '' ? <IconButton color="button" onClick={onClickClear} style={{ padding: "10px" }}><Clear /></IconButton> : null}
              {search.trim() != '' ? <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" /> : null}
              <IconButton type="button" onClick={onClickSearch} style={{ padding: "10px" }}><Search /></IconButton>
            </Paper>

            {/* FILTER */}
            <Box className='filterSection' style={{ marginTop: "5px" }}>
              <List subheader={<ListSubheader>Filters</ListSubheader>}>
                <ListItemButton onClick={() => setOpenSortFilter(!openSortFilter)}>
                  <ListItemIcon><SwapVertRounded /></ListItemIcon>
                  <ListItemText primary="Sort" />
                  {openSortFilter ? <ExpandLessRounded /> : <ExpandMoreRounded />}
                </ListItemButton>
                <Collapse in={openSortFilter}>
                  <RadioGroup onChange={(e) => setSelectedSort(e.target.value)}>
                    <FormControl fullWidth>
                      {sortList.map((sort, i) => (
                        <>
                          <FormControlLabel fullWidth
                            control={
                              <MenuItem key={i} value={sort.title} style={{ width: "100%" }}>
                                <Radio value={sort.value} checked={sort.value == selectedSort} />
                                <ListItemText primary={sort.title} />
                              </MenuItem>
                            }
                          >
                          </FormControlLabel>
                        </>
                      ))}
                    </FormControl>
                  </RadioGroup>
                </Collapse>
                <ListItemButton onClick={() => setOpenCategoryFilter(!openCategoryFilter)}>
                  <ListItemIcon><CategoryRounded /></ListItemIcon>
                  <ListItemText primary="Category" />
                  {openCategoryFilter ? <ExpandLessRounded /> : <ExpandMoreRounded />}
                </ListItemButton>
                <Collapse in={openCategoryFilter}>
                  <FormControl fullWidth >
                    {categoryList.map((cat, i) => (
                      <FormControlLabel
                        control={
                          <MenuItem key={i} value={cat.title} style={{ width: "100%" }}>
                            <Checkbox onChange={handleCategoryChange} value={cat.title} />
                            <ListItemText primary={cat.title} />
                          </MenuItem>
                        } />
                    ))}
                  </FormControl>
                </Collapse>
              </List>
            </Box>
          </Box>
        </Box>

        <Box className="resultSection">
          {serviceList.length != 0 ?
            <Box>
              <Typography variant='subtitle1' textAlign={'right'}>Total Results: {serviceList.length}</Typography>
              <Grid gridTemplateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} display={"grid"} gap={"10px"} marginTop={"10px"}>
                {serviceList.map((services, i) => { return (<EventCard events={services} key={i} />) })}
              </Grid>
            </Box> :
            <Alert icon={<SearchOffRounded fontSize="inherit" />} severity="info">
              <AlertTitle style={{ fontWeight: "bold" }}>No results found</AlertTitle>
              Maybe try resetting the filters to get other results
            </Alert>
          }
        </Box>
      </Box>
    </Box >
  )
}

export default ProductsPage