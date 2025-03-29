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
            Enveave strives to be the leading platform for environmental
            initiatives in India, uniting individuals, communities, and
            organizations to drive meaningful change. We aim to be the central
            hub where anyone passionate about the environment can connect,
            collaborate, and contribute to a sustainable future.
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
            Enveave aims to get together civil society, individuals, expert
            groups, academia, the research community, and industry on a common
            platform and provide a single place to collaborate on various
            projects related to Ecology and Environment. We aim to ease the
            launch and execution of such projects, large or small, and
            <strong> "Let a Million Environment Flowers Bloom".</strong>
          </p>
        </div>
      </div>
    </section>
  );
};

export default VisionMissionSection;
