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
import UpdateVouchers from './pages/vouchers/updateVouchers';
import VoucherDashboard from './pages/vouchers/voucherDashboard';
import ViewVouchers from './pages/vouchers/viewVouchers';

import ProductDash from './pages/products/ProductDash';
import AddService from './pages/products/AddService';
import GetService from './pages/products/GetService';
import EditService from './pages/products/EditService';
import ManageCategory from './pages/products/ManageCategories';

import Addadmin from './pages/users/Addadmin';
import Accounts from './pages/users/accounts';
import "./pages/styles/chatbot.css"
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

  const chatbotToggler = document.querySelector(".chatbot-toggler");
  const closeBtn = document.querySelector(".close-btn");
  const chatbox = document.querySelector(".chatbox");
  const chatInput = document.querySelector(".chat-input textarea");
  const sendChatBtn = document.querySelector(".chat-input span");

  let userMessage = null; // Variable to store user's message
  const API_KEY = "PASTE-YOUR-API-KEY"; // Paste your API key here
  const inputInitHeight = chatInput.scrollHeight;

  const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
  }

  const generateResponse = (chatElement) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = chatElement.querySelector("p");

    // Define the properties and message for the API request
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
      })
    }

    // Send POST request to API, get response and set the reponse as paragraph text
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
      messageElement.textContent = data.choices[0].message.content.trim();
    }).catch(() => {
      messageElement.classList.add("error");
      messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
  }

  const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if (!userMessage) return;

    // Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
      // Display "Thinking..." message while waiting for the response
      const incomingChatLi = createChatLi("Thinking...", "incoming");
      chatbox.appendChild(incomingChatLi);
      chatbox.scrollTo(0, chatbox.scrollHeight);
      generateResponse(incomingChatLi);
    }, 600);
  }

  chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
  });

  chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window 
    // width is greater than 800px, handle the chat
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
      e.preventDefault();
      handleChat();
    }
  });

  sendChatBtn.addEventListener("click", handleChat);
  closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
  chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));


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
                  <Route path={"/Accounts"} element={<Accounts />} />
                </Routes>
              </>
            ) : (
              <>
                <UserNav />
                <Routes>
                  <Route path={"/updateprofile/:id"} element={<UpdateProfile />} />
                  <Route path={"/viewVouchers"} element={<ViewVouchers />} />
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


                <Route path={"/productdash"} element={<ProductDash />} />  {/*Reference */}
                <Route path={"/addservice"} element={<AddService />} />
                <Route path={"/getservice"} element={<GetService />} />
                <Route path={"/editservice/:id"} element={<EditService />} />
                <Route path={"/managecategory"} element={<ManageCategory />} />
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
