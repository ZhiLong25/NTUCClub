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
import ViewCard from './pages/cards/viewCard';
import UpdateCard from './pages/cards/updateCard';
import ManageCard from './pages/cards/manageCard';

import ProductDash from './pages/products/ProductDash';
import AddService from './pages/products/AddService';
import GetService from './pages/products/GetService';
import EditService from './pages/products/EditService';
import ManageCategory from './pages/products/ManageCategories';
import ManageVendor from './pages/products/ManageVendor';
import ManageTimeslots from './pages/products/ManageTimeslots';


import Products from './pages/products/Products'
import ProductsPage from './pages/products/ProductsPage';

import AddQueries from "./pages/queries/AddQueries";
import ViewQueries from "./pages/queries/ViewQueries";
import Addadmin from './pages/users/Addadmin';
// import Adminaccounts from './pages/users/Adminaccounts';
import Accounts from './pages/users/Accounts';
import Cart from './pages/cart/cart';
import Payment from './pages/cart/payment';
import RegisterGoogle from "./pages/users/RegisterGoogle"
import "./pages/styles/chatbot.css"
// import "./script"
import Faq from './pages/Faq';
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
        <Route path={"/Accounts"} element={<Accounts />} />
        <Route path={"/ViewQueries"} element={<ViewQueries/>} />
        <Route path={"/Faq"} element={<Faq />} />
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
      <Route path={"/Faq"} element={<Faq />} /> 
      </Routes>
    </>
  ) : (
    <>
      <UserNav />
      <Routes>
        <Route path={"/updateprofile/:id"} element={<UpdateProfile />} />
        <Route path={"/viewVouchers"} element={<ViewVouchers/>} />
        <Route path={"/manageCard"} element={<ManageCard/>} />
        <Route path={"/addCard"} element={<AddCard/>} />
        <Route path={"/viewCard"} element={<ViewCard/>} />
        <Route path={"/updateCard/:id"} element={<UpdateCard/>} />
        <Route path={"/AddQueries"} element={<AddQueries/>} />
        <Route path={"/cart"} element={<Cart />} />
        <Route path={"/payment"} element={<Payment />} />
        <Route path={"/Faq"} element={<Faq/>} />
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
      <Route path={"/RegisterGoogle"} element={<RegisterGoogle />} />
      
      <Route path={"/productdash"} element={<ProductDash />} />  {/*Reference */}
      <Route path={"/addservice"} element={<AddService />} /> 
      <Route path={"/getservice"} element={<GetService />} /> 
      <Route path={"/editservice/:id"} element={<EditService />} />
      <Route path={"/managecategory"} element={<ManageCategory />} /> 
      <Route path={"/managevendor"} element={<ManageVendor />} /> 
      <Route path={"/manageTimeslots"} element={<ManageTimeslots />} /> 


      <Route path={"/products/:id"} element={<Products />} />
      <Route path={"/productspage"} element={< ProductsPage/>} />

 
      <Route path={"/addquery"} element={<addQuery />} />
      <Route path={"/Faq"} element={<Faq />} />
    </Routes>
  </>
)}

    </Container>
  </Router>
  <button className="chatbot-toggler">
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-outlined">close</span>
      </button>
      <div className="chatbot">
        <header>
          <h2>Chatbot</h2>
          <span className="close-btn material-symbols-outlined">close</span>
        </header>
        <ul className="chatbox">
          <li className="chat incoming">
            <span className="material-symbols-outlined">smart_toy</span>
            <p>Hi there 👋<br />How can I help you today?</p>
          </li>
        </ul>
        <div className="chat-input">
          <textarea placeholder="Enter a message..." spellCheck="false" required></textarea>
          <span id="send-btn" className="material-symbols-rounded">send</span>
        </div>
      </div>
</UserContext.Provider>
  );
}


export default App;
