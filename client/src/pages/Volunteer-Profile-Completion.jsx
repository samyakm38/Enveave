import React from 'react';
import Header from '../components/main components/Header';
import Footer from '../components/main components/Footer';
import ProfileCompletionForm from '../components/ProfileForms/ProfileCompletionForm';
import '../stylesheet/ProfileForms.css';

const VolunteerProfileCompletion = () => {
  return (
    <div className="volunteer-profile-completion-page">
      <Header />
      <div className="page-content">
        <div className="page-header">
          <h1>Complete Your Volunteer Profile</h1>
          <p>
            Completing your profile helps us match you with the right environmental opportunities
            and enhances your volunteering experience.
          </p>
        </div>
        <ProfileCompletionForm />
      </div>
      <Footer />
    </div>
  );
};

export default VolunteerProfileCompletion;