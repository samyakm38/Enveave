import "./stylesheets/VisionMissionSection.css";

const VisionMissionSection = () => {
  return (
    <section className="vision-mission">
      <div className="content-block">
        <img
          src="/about-us-vision.png"
          alt="Hands holding plants"
          className="vision-image"
        />
        <div className="text-content">
          <h2>
            <span className="highlight"></span> Vision
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
      <div className="content-block reverse">
        <img
          src="/about-us-mission.png"
          alt="People planting trees"
          className="mission-image"
        />
        <div className="text-content">
          <h2>
            <span className="highlight"></span> Mission
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
