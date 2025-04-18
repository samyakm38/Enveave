import "./stylesheets/VisionMissionSection.css";

const VisionMissionSection = () => {
  return (
    <section className="about-us-vision-mission">
      <div className="about-us-content-block">
        <img
          src="/about-us-vision.png"
          alt="Hands holding plants"
          className="about-us-vision-image"
        />
        <div className="about-us-text-content">
          <h2>
            <span className="about-us-highlight"></span> Vision
          </h2>
          <p>
          Our vision is for Enveave to become the go-to platform for all organizational initiatives that aim to create positive change in society. We aspire to be the main forum for anyone who wants to contribute their time, skills, or passion toward the greater good.
          </p>
        </div>
      </div>
      {/* Mission Section */}
      <div className="about-us-content-block about-us-reverse">
        <img
          src="/about-us-mission.png"
          alt="People planting trees"
          className="about-us-mission-image"
        />
        <div className="about-us-text-content">
          <h2>
            <span className="about-us-highlight"></span> Mission
          </h2>
          <p>
          Our mission is to connect volunteers with organizations dedicated to non-commercial initiatives that benefit society. We strive to make it easier for individuals and groups to discover, engage with, and collaborate on meaningful opportunities that drive positive impact in India.
          </p>
        </div>
      </div>
    </section>
  );
};

export default VisionMissionSection;
