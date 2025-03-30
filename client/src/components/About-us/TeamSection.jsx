import "./stylesheets/TeamSection.css";

const teamMembers = [
  {
    name: "Olivia Rhye",
    role: "Founder & CEO",
    image: "/Team_member_images/about-us-team-member-0.png",
  },
  {
    name: "Phoenix Baker",
    role: "Engineering Manager",
    image: "/Team_member_images/about-us-team-member-1.png",
  },
  {
    name: "Lana Steiner",
    role: "Product Manager",
    image: "/Team_member_images/about-us-team-member-2.png",
  },
  {
    name: "Demi Wilkinson",
    role: "Frontend Developer",
    image: "/Team_member_images/about-us-team-member-3.png",
  },
  {
    name: "Candice Wu",
    role: "Backend Developer",
    image: "/Team_member_images/about-us-team-member-4.png",
  },
  {
    name: "Natali Craig",
    role: "Product Designer",
    image: "/Team_member_images/about-us-team-member-5.png",
  },
  {
    name: "Drew Cano",
    role: "UX Researcher",
    image: "/Team_member_images/about-us-team-member-6.png",
  },
  {
    name: "Orlando Diggs",
    role: "Customer Success",
    image: "/Team_member_images/about-us-team-member-7.png",
  },
];

function renderTeamList(teamMembers) {
  return teamMembers.map((member, index) => (
    <div key={index} className="about-us-team-member">
      <img src={member.image} alt={member.name} className="about-us-team-image" />
      <h3>{member.name}</h3>
      <p>{member.role}</p>
    </div>
  ));
}

const TeamSection = () => {
  return (
    <section className="about-us-team-section">
      <h2>Our Team</h2>
      <div className="about-us-team-grid">{renderTeamList(teamMembers)}</div>
    </section>
  );
};

export default TeamSection;
