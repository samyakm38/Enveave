import React from 'react';
import Header from '../components/main components/Header';
import Footer from '../components/main components/Footer';
import ProviderProfileCompletionForm from '../components/ProfileForms/ProviderProfileCompletionForm';
import '../stylesheet/ProfileForms.css';

const ProviderProfileCompletion = () => {
  return (
    <div className="provider-profile-completion-page">
      <Header />
      <div className="page-content">
        <div className="page-header">
          <h1>Complete Your Organization Profile</h1>
          <p>
            Completing your organization profile helps volunteers understand your mission
            and the environmental work you do. This will help attract the right volunteers
            for your opportunities.
          </p>
        </div>
        <ProviderProfileCompletionForm />
      </div>
      <Footer />
    </div>
  );
};

export default ProviderProfileCompletion;