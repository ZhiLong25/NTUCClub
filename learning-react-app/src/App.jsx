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
import Home from './pages/';

import AddCard from './pages/cards/addCard';
import ViewCard from './pages/cards/viewCard';
import UpdateCard from './pages/cards/updateCard';
import ManageCard from './pages/cards/manageCard';

import ProductDash from './pages/products/ProductDash';
import AddService from './pages/admin/AddService';
import GetService from './pages/admin/GetService';
import EditService from './pages/admin/EditService';
import ManageVendor from './pages/admin/ManageVendor';

import AddReviews from './pages/products/AddReviews';

import Products from './pages/products/Products'
import ProductsPage from './pages/products/ProductsPage';
import ViewWishlist from './pages/products/ViewWishlist';
import ExperienceNearMe from './pages/products/ExperienceNearMe';

import Cart from './pages/cart/cart';
import Payment from './pages/cart/payment';
import PaymentRecords from './pages/cart/paymentRecords';

import AddQueries from "./pages/queries/AddQueries";
import ViewQueries from "./pages/queries/ViewQueries";
import ReplyQueries from "./pages/queries/ReplyQueries";
import Addadmin from './pages/users/Addadmin';
import AdminDash from './pages/admin/AdminDash';
// import Adminaccounts from './pages/users/Adminaccounts';
// import Accounts from './pages/users/accounts';
import Accounts from './pages/users/Accounts';
import AddMerchant from './pages/users/AddMerchant';
import RegisterGoogle from "./pages/users/RegisterGoogle"

import AddServiceVendor from "./pages/vendor/AddServiceVendor"
import EditServiceVendor from "./pages/vendor/EditServiceVendor"
import GetServiceVendor from "./pages/vendor/GetServiceVendor"

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
    <ThemeProvider theme={MyTheme}>
      <UserContext.Provider value={{ user, setUser }}>
        <Router>
          <Container>
            {user ? (
              user && user.userType === "Admin" ? (
                <>
                  <AdminNav />
                  <Routes>
                    <Route path={"/"} element={<Home />} />
                    <Route path={"/voucherDashboard"} element={<VoucherDashboard />} />
                    <Route path={"/addVouchers"} element={<AddVouchers />} />
                    <Route path={"/updatevouchers/:id"} element={<UpdateVouchers />} />
                    <Route path={"/updateprofile/:id"} element={<UpdateProfile />} />
                    <Route path={"/Addadmin"} element={<Addadmin />} />
                    <Route path={"/Accounts"} element={<Accounts />} />
                    <Route path={"/ViewQueries"} element={<ViewQueries />} />
                    <Route path={"/replyqueries/:id"} element={<ReplyQueries />} />
                    <Route path={"/AddMerchant"} element={<AddMerchant />} />
                    <Route path={"/Faq"} element={<Faq />} />
                    <Route path={"/paymentRecords"} element={<PaymentRecords />} />
                    <Route path={"/admindash"} element={<AdminDash />} />
                    <Route path={"/addservice"} element={<AddService />} />

                    <Route path={"/expnearme"} element={< ExperienceNearMe />} />

                    <Route path={"/experiences/:id"} element={<Products />} />
                    <Route path={"/experiences"} element={< ProductsPage />} />

                    {/* Products/Vendors CRUD */}
                    <Route path={"/adminDash"} element={<AdminDash />} />
                    <Route path={"/addservice"} element={<AddService />} />
                    <Route path={"/getservice"} element={<GetService />} />
                    <Route path={"/editservice/:id"} element={<EditService />} />
                    <Route path={"/managevendor"} element={<ManageVendor />} />

                  </Routes>
                </>
              ) : user.userType === "Merchant" ? (
                <>
                  <MerchantNav />
                  <Routes>
                    <Route path={"/"} element={<Home />} />
                    <Route path={"/productdash"} element={<ProductDash />} />  {/*Reference */}
                    <Route path={"/getservice"} element={<GetService />} />
                    <Route path={"/editservice/:id"} element={<EditService />} />
                    <Route path={"/managevendor"} element={<ManageVendor />} />
                    <Route path={"/Faq"} element={<Faq />} />

                    <Route path={"/productdash"} element={<ProductDash />} />
                    <Route path={"/addservicevendor"} element={<AddServiceVendor />} />
                    <Route path={"/getservicevendor"} element={<GetServiceVendor />} />
                    <Route path={"/editservicevendor/:id"} element={<EditServiceVendor />} />

                    <Route path={"/expnearme"} element={< ExperienceNearMe />} />

                    <Route path={"/experiences/:id"} element={<Products />} />
                    <Route path={"/experiences"} element={< ProductsPage />} />
                  </Routes>
                </>
              ) : (
                <>
                  <UserNav />
                  <Routes>
                    <Route path={"/"} element={<Home />} />
                    <Route path={"/updateprofile/:id"} element={<UpdateProfile />} />
                    <Route path={"/viewVouchers"} element={<ViewVouchers />} />
                    <Route path={"/manageCard"} element={<ManageCard />} />
                    <Route path={"/addCard"} element={<AddCard />} />
                    <Route path={"/viewCard"} element={<ViewCard />} />
                    <Route path={"/updateCard/:id"} element={<UpdateCard />} />
                    <Route path={"/AddQueries"} element={<AddQueries />} />
                    <Route path={"/cart"} element={<Cart />} />
                    <Route path={"/payment"} element={<Payment />} />
                    <Route path={"/Faq"} element={<Faq />} />

                    <Route path={"/addreviews"} element={< AddReviews />} />
                    <Route path={"/wishlist"} element={< ViewWishlist />} />
                    <Route path={"/expnearme"} element={< ExperienceNearMe />} />

                    <Route path={"/experiences/:id"} element={<Products />} />
                    <Route path={"/experiences"} element={< ProductsPage />} />
                  </Routes>
                </>
              )
            ) : (
              <>
                {/* Guest navigation */}
                <GuestNav />
                <Routes>
                  <Route path={"/"} element={<Home />} />
                  <Route path={"/register"} element={<Register />} />
                  <Route path={"/login"} element={<Login />} />
                  <Route path={"/verification"} element={<Verification />} />
                  <Route path={"/AddQueries"} element={<AddQueries />} />
                  <Route path={"/RegisterGoogle"} element={<RegisterGoogle />} />

                  <Route path={"/productdash"} element={<ProductDash />} />
                  <Route path={"/addservice"} element={<AddService />} />
                  <Route path={"/getservice"} element={<GetService />} />
                  <Route path={"/editservice/:id"} element={<EditService />} />
                  <Route path={"/managevendor"} element={<ManageVendor />} />
                  
                  <Route path={"/experiences/:id"} element={<Products />} />
                  <Route path={"/experiences"} element={< ProductsPage />} />



        
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
    </ThemeProvider>
  );
}


export default App;
