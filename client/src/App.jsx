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
import NgoForm1 from "./pages/forms/Ngo-form-1.jsx";
import NgoForm2 from "./pages/forms/Ngo-form-2.jsx";
import VolunteerForm1 from "./pages/forms/Volunteer-form-1.jsx";
import VolunteerForm2 from "./pages/forms/Volunteer-form-2.jsx";
import VolunteerForm3 from "./pages/forms/Volunteer-form-3.jsx";
import OpportunityForm1 from "./pages/forms/Opportunity-form-1.jsx";
import OpportunityForm2 from "./pages/forms/Opportunity-form-2.jsx";
import OpportunityForm3 from "./pages/forms/Opportunity-form-3.jsx";
import OpportunityForm4 from "./pages/forms/Opportunity-form-4.jsx";
import StoryForm from "./pages/forms/Story-form.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import { ToastProvider } from "./components/main components/ToastContext.jsx";

const App = () => {
  return (
    <ToastProvider>
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
          <Route path="/Ngo-form-1" element={<NgoForm1 />} />
          <Route path="/Ngo-form-2" element={<NgoForm2 />} />
          <Route path="/Volunteer-form-1" element={<VolunteerForm1 />} />
          <Route path="/Volunteer-form-2" element={<VolunteerForm2 />} />
          <Route path="/Volunteer-form-3" element={<VolunteerForm3 />} />
          <Route path="/Opportunity-form-1" element={<OpportunityForm1 />} />
          <Route path="/Opportunity-form-2" element={<OpportunityForm2 />} />
          <Route path="/Opportunity-form-3" element={<OpportunityForm3 />} />
          <Route path="/Opportunity-form-4" element={<OpportunityForm4 />} />
          <Route path="/Story-form" element={<StoryForm />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
};

export default App;
