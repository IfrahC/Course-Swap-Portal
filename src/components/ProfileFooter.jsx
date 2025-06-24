import React from 'react';

const Footer = ({ onEditProfile, onLogout }) => {
  return (
    <div className="footer">
      <button className="action-btn edit-btn" onClick={onEditProfile}>
        Edit Profile
      </button>
      <button className="action-btn settings-btn" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
};

export default Footer;