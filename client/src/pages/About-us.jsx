import React from "react";
import Header from "../components/main components/Header.jsx";
import Footer from "../components/main components/Footer.jsx";
import HeroSection from "../components/About-us/HeroSection.jsx";
import VisionMissionSection from "../components/About-us/VisionMissionSection.jsx";
import TeamSection from "../components/About-us/TeamSection.jsx";
import FAQSection from "../components/main components/FAQSection.jsx";
const AboutUs = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <VisionMissionSection />
      <TeamSection />
      <FAQSection />
      <Footer />
    </>
  );
};

export default AboutUs;
