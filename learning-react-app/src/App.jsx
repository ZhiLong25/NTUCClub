import './App.css';
import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import Tutorials from './pages/Tutorials';
import MyForm from './pages/MyForm';
import Register from './pages/users/Register';
import Login from './pages/users/Login';
import http from './http';
import UserContext from './contexts/UserContext';
import Verification from './pages/verification';
import UpdateProfile from './pages/users/UpdateProfile';
import AddVouchers from './pages/vouchers/addVouchers';
import AdminNav from "./AdminNav"
import GuestNav from './GuestNav';
import UserNav from './UserNav';
import MerchantNav from './MerchantNav'
import UpdateVouchers from './pages/vouchers/updateVouchers';
import VoucherDashboard from './pages/vouchers/voucherDashboard';
import ViewVouchers from './pages/vouchers/viewVouchers';

import AddCard from './pages/cards/addCard';

import ProductDash from './pages/products/ProductDash';
import AddService from './pages/products/AddService';
import GetService from './pages/products/GetService';
import EditService from './pages/products/EditService';
import ManageCategory from './pages/products/ManageCategories';
import ManageVendor from './pages/products/ManageVendor';
import AddQueries from "./pages/queries/AddQueries"
import Addadmin from './pages/users/Addadmin';
import Adminaccounts from './pages/users/Adminaccounts';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/user/auth').then((res) => {
        console.log(res.data.user)
        setUser(res.data.user);
      });
    }
  }, []);


  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
  <Router>
    <Container>
    {user ? (
  user && user.userType === "Admin" ? (
    <>
      <AdminNav />
      <Routes>
        <Route path={"/voucherDashboard"} element={<VoucherDashboard />} />
        <Route path={"/addVouchers"} element={<AddVouchers />} />
        <Route path={"/updatevouchers/:id"} element={<UpdateVouchers />} />
        <Route path={"/updateprofile/:id"} element={<UpdateProfile />} />
        <Route path={"/Addadmin"} element={<Addadmin />} />
        <Route path={"/Adminaccounts"} element={<Adminaccounts />} />
      </Routes>
    </>
  ) : user.userType === "Merchant" ? (
    <>
      <MerchantNav />
      <Routes>
      <Route path={"/productdash"} element={<ProductDash />} />  {/*Reference */}
      <Route path={"/addservice"} element={<AddService />} /> 
      <Route path={"/getservice"} element={<GetService />} /> 
      <Route path={"/editservice/:id"} element={<EditService />} />
      <Route path={"/managecategory"} element={<ManageCategory />} /> 
      <Route path={"/managevendor"} element={<ManageVendor />} /> 
      </Routes>
    </>
  ) : (
    <>
      <UserNav />
      <Routes>
        <Route path={"/updateprofile/:id"} element={<UpdateProfile />} />
        <Route path={"/viewVouchers"} element={<ViewVouchers/>} />
        <Route path={"/addcard"} element={<AddCard/>} />
        <Route path={"/AddQueries"} element={<AddQueries/>} />
      </Routes>
    </>
  )
) : (
  <>
    {/* Guest navigation */}
    <GuestNav />
    <Routes>
      <Route path={"/register"} element={<Register />} />
      <Route path={"/login"} element={<Login />} />
      <Route path={"/verification"} element={<Verification />} />
      <Route path={"/AddQueries"} element={<AddQueries />} />
      
      <Route path={"/productdash"} element={<ProductDash />} />  {/*Reference */}
      <Route path={"/addservice"} element={<AddService />} /> 
      <Route path={"/getservice"} element={<GetService />} /> 
      <Route path={"/editservice/:id"} element={<EditService />} />
      <Route path={"/managecategory"} element={<ManageCategory />} /> 
      <Route path={"/managevendor"} element={<ManageVendor />} /> 

 
      <Route path={"/productdash"} element={<ProductDash />} />  {/*Reference */}
      <Route path={"/addservice"} element={<AddService />} /> 
      <Route path={"/getservice"} element={<GetService />} /> 
      <Route path={"/editservice/:id"} element={<EditService />} />
      <Route path={"/managecategory"} element={<ManageCategory />} /> 
      <Route path={"/addquery"} element={<addQuery />} />
    </Routes>
  </>
)}

    </Container>
  </Router>
</UserContext.Provider>
  );
}


export default App;
