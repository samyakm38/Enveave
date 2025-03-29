import "./stylesheets/HeroSection.css";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="about-us-hero">
      <h1>
        We Empower Actions for a{" "}
        <span className="about-us-break">Sustainable Tomorrow</span>
      </h1>
      <p className="about-us-subheading">
        Creating a way to connect people ready to work, with people
        <span className="break"></span> who need work done
      </p>
      <Link to="/Contact-us">
        <button className="about-us-cta-button">Contact Us</button>
      </Link>
      <p className="about-us-description">
        Enveave is a collaborative platform dedicated to empowering individuals,
        communities, and organizations<span className="about-us-break"></span> to drive
        environmental change. We bring together volunteers, funders, and experts

        to launch and support<span className="break"></span> impactful
        initiatives. Whether it&#39;s conservation, sustainability, or research,
        Enveave makes it easy to<span className="break"></span> connect,
        collaborate, and create a greener future.
      </p>
      <div className="about-us-stats">
        <div className="about-us-stat">
          <h2>280+</h2>
          <p>Volunteers</p>
        </div>
        <div className="about-us-stat">
          <h2>60+</h2>
          <p>Organizations</p>
        </div>
        <div className="about-us-stat">
          <h2>200+</h2>
          <p>Activities</p>
        </div>
        <div className="about-us-stat">
          <h2>50+</h2>
          <p>Projects</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
