import "./stylesheets/TeamSection.css";

const teamMembers = [
  {
    name: "Olivia Rhye",
    role: "Founder & CEO",
    image: "/about-us-team-member-0.png",
  },
  {
    name: "Phoenix Baker",
    role: "Engineering Manager",
    image: "/about-us-team-member-1.png",
  },
  {
    name: "Lana Steiner",
    role: "Product Manager",
    image: "/about-us-team-member-2.png",
  },
  {
    name: "Demi Wilkinson",
    role: "Frontend Developer",
    image: "/about-us-team-member-3.png",
  },
  {
    name: "Candice Wu",
    role: "Backend Developer",
    image: "/about-us-team-member-4.png",
  },
  {
    name: "Natali Craig",
    role: "Product Designer",
    image: "/about-us-team-member-5.png",
  },
  {
    name: "Drew Cano",
    role: "UX Researcher",
    image: "/about-us-team-member-6.png",
  },
  {
    name: "Orlando Diggs",
    role: "Customer Success",
    image: "/about-us-team-member-7.png",
  },
];

function renderTeamList(teamMembers) {
  return teamMembers.map((member, index) => (
    <div key={index} className="team-member">
      <img src={member.image} alt={member.name} className="team-image" />
      <h3>{member.name}</h3>
      <p>{member.role}</p>
    </div>
  ));
}

const TeamSection = () => {
  return (
    <section className="team-section">
      <h2>Our Team</h2>
      <div className="team-grid">{renderTeamList(teamMembers)}</div>
    </section>
  );
};

export default TeamSection;
