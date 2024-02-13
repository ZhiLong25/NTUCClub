import { SearchRounded, AddRounded, StorefrontOutlined, SettingsOutlined, CategoryOutlined } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Chip, Card, CardContent, Input, IconButton, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import http from '../../http';
import '../styles/product.css';
import MUIDataTable from "mui-datatables";
import { Flex } from '@chakra-ui/react';
import { CheckIfDataIsArray } from '../constant';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


function ProductDash() {

  const [totalServices, setTotalServices] = useState(0);
  const [totalCategory, setTotalCategory] = useState(0);
  const [totalVendors, setTotalVendors] = useState(0);
  const [serviceList, setServiceList] = useState([]);

  useEffect(() => {
    http.get('/Product/getservice')
      .then((res) => {
        const data = CheckIfDataIsArray(res.data)
        setTotalServices(data.length);
      });
      console.log(serviceList)

    http.get('/Category/getcategory')
      .then((res) => {
        const data = CheckIfDataIsArray(res.data)
        setTotalCategory(data.length);
      });

    http.get('/Vendor/getvendor')
      .then((res) => {
        const data = CheckIfDataIsArray(res.data)
        setTotalVendors(data.length);
      });

    getServices();
  }, []);


  const getServices = () => {
    http.get('/Product/getservice')
      .then((res) => {
        const data = CheckIfDataIsArray(res.data)
        setServiceList(data);
      });
  };



  const options = { filterType: 'checkbox' };
  const columns = ['id', 'name', 'category', 'updatedAt'];

  return (
    <Box className="main-wrap admin-wrap" >
      <Typography variant="h5" className="main-title" style={{ marginTop: "20px", marginBottom: "10px" }}>Dashboard</Typography>

      {/* STATS */}
      <Flex gap={"10px"}>
        <CardContent className="statsCard" style={{ background: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)" }}>
          <Typography className="statsTitle" variant='subtitle'>Services</Typography>
          <Flex gap={"5px"} alignItems={"center"}>
            <SettingsOutlined fontSize='large' />
            <Typography className="statsData">{totalServices}</Typography>
          </Flex>
        </CardContent>
        {/* <CardContent className="statsCard" style={{ background: "linear-gradient(to top, #c1dfc4 0%, #deecdd 100%)" }}>
          <Typography className="statsTitle" variant='subtitle'>Category</Typography>
          <Flex gap={"5px"} alignItems={"center"}>
            <CategoryOutlined fontSize='large' />
            <Typography className="statsData">{totalCategory}</Typography>
          </Flex>
        </CardContent> */}
        <CardContent className="statsCard" style={{ background: "linear-gradient(to top, #feada6 0%, #f5efef 100%)" }}>
          <Typography className="statsTitle" variant='subtitle'>Vendors</Typography>
          <Flex gap={"5px"} alignItems={"center"}>
            <StorefrontOutlined fontSize='large' />
            <Typography className="statsData">{totalVendors}</Typography>
          </Flex>
        </CardContent>
      </Flex>

      {/* QUICK ACCESS */}
      <Box className="quickAccesChips" marginTop={"30px"}>
        <Typography variant="h6" style={{ marginBottom: "5px" }}>Quick Access</Typography>
        <Box display={'flex'} alignItems={'center'} gap={"10px"}>
          <Link to={"/getservice"}>
            <Chip icon={<SearchRounded />} label="Services" />
          </Link>
          <Link to={"/addservice"}>
            <Chip icon={<AddRounded />} label="Services" />
          </Link>
          <Link to={"/managevendor"}>
            <Chip icon={<SearchRounded />} label="Vendors" />
          </Link>

        </Box>
      </Box>

      {/* TABLE */}
      <Box marginTop={"30px"}>
        <Typography variant="h6" style={{ marginBottom: "5px" }}>Services List</Typography>
        <MUIDataTable data={serviceList} columns={columns} options={options} />
      </Box>
    </Box>
  )
}

export default ProductDash;
