import React from 'react';
import Sidebar from '../components/Sidebar';
import UserRequests from '../components/UserRequests';
import '../styles/requests.css';

const RequestsPage = () => {
  return (
    <div className="requests-layout">
      <Sidebar />
      <div className="requests-main">
        <h1 className="section-title">Your Active Requests</h1>
        <div className="requests-content">
          <UserRequests />
        </div>
      </div>
    </div>
  );
};

export default RequestsPage;
