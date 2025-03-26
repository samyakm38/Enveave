import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import AboutUs from './pages/About-us.jsx'
// import Header from './components/main components/Header.jsx'
import ContactUs from "./pages/Contact-us.jsx";
import Volunteers from "./pages/Volunteers.jsx";
import NGOs from "./pages/NGOs.jsx";
import Opportunities from "./pages/Opportunities.jsx";

const App=() => {
    return (
        <BrowserRouter>

            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/about-us" element={<AboutUs/>}/>
                <Route path="/contact-us" element={<ContactUs/>}/>
                <Route path="/volunteers" element={<Volunteers/>}/>
                <Route path='/ngos' element={<NGOs/>}/>
                <Route path='/opportunities' element={<Opportunities/>}/>
            </Routes>

        </BrowserRouter>
    )
}

export default App