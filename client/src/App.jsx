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
import CreateOpportunity from "./pages/CreateOpportunity.jsx";
import StoryForm from "./pages/forms/Story-form.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import { ToastProvider } from "./components/main components/ToastContext.jsx";
import VolunteerDashboard from "./pages/Volunteer-Dashboard.jsx";
import NGODashboard from "./pages/NGO-Dashboard.jsx";
import VolunteerProfileCompletion from "./pages/Volunteer-Profile-Completion.jsx";
import IndividualOpportunity from "./pages/Individual-Opportunity.jsx";
import ProviderProfileCompletion from "./pages/Provider-Profile-Completion.jsx";
import AllStories from "./pages/AllStories.jsx";
import IndividualStory from "./pages/IndividualStory.jsx";
import NGODashboardIndividualOpportunity from "./pages/NGO-Dashboard-Individual-Opportunity.jsx";
import NGODashBoardIndividualVolunteer from "./pages/NGO-DashBoard-Individual-Volunteer.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminDashBoardOrganisation from "./pages/AdminDashBoardOrganisation.jsx";
import AdminDashBoardVolunteer from "./pages/AdminDashBoardVolunteer.jsx";
import AdminDashBoardOpportunity from "./pages/AdminDashBoardOpportunity.jsx";
import AdminDashBoardStories from "./pages/AdminDashBoardStories.jsx";
import ChatWidget from "./components/ChatBot/ChatWidget.jsx";

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
          <Route path="/Story-form" element={<StoryForm />} />
          <Route path='/volunteer/dashboard' element={<VolunteerDashboard />}/>
          <Route path='/provider/dashboard' element={<NGODashboard />}/>
          <Route path='/create-opportunity' element={<CreateOpportunity />} />
          <Route path="/profile-completion" element={<VolunteerProfileCompletion />} />
          <Route path="/opportunities/:id" element={<IndividualOpportunity />} />
          <Route path="/provider/profile/edit" element={<ProviderProfileCompletion />} />
          <Route path="/stories" element={<AllStories />} />
          <Route path="/stories/:id" element={<IndividualStory />} />
          <Route path='provider/dashboard/opportunity/:id' element={<NGODashboardIndividualOpportunity />} />
          <Route path='provider/dashboard/volunteer/:id' element={<NGODashBoardIndividualVolunteer />} />
          <Route path='/admin/dashboard' element={<AdminDashboard />} />
          <Route path='/admin/dashboard/organizations' element={<AdminDashBoardOrganisation/>}/>
          <Route path='/admin/dashboard/volunteers' element={<AdminDashBoardVolunteer/>}/>
          <Route path='/admin/dashboard/opportunities' element={<AdminDashBoardOpportunity/>}/>
          <Route path='/admin/dashboard/stories' element={<AdminDashBoardStories/>}/>
        </Routes>
        <ChatWidget />
      </BrowserRouter>
    </ToastProvider>
  );
};

export default App;
