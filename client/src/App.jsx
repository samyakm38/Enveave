import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AboutUs from "./pages/About-us.jsx";
import Header from "./components/main components/Header.jsx";
import ContactUs from "./pages/Contact-us.jsx";
import Volunteers from "./pages/Volunteers.jsx";
import NGOs from "./pages/NGOs.jsx";
import Opportunities from "./pages/Opportunities.jsx";
import SignUpOption from "./pages/Sign-up-option.jsx";
import SignUpVolunteer from "./pages/Sign-up-Volunteer.jsx";
import SignUpNgo from "./pages/Sign-up-NGO.jsx";
import Login from "./pages/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/volunteers" element={<Volunteers />} />
        <Route path="/ngos" element={<NGOs />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/sign-up-option" element={<SignUpOption />} />
        <Route path="/sign-up/volunteer" element={<SignUpVolunteer />} />
        <Route path="/sign-up/ngo" element={<SignUpNgo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
