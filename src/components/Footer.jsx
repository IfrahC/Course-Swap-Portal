import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <button className="action-btn edit-btn" aria-label="Edit Profile">
        ✏️ Edit Profile
      </button>
      <button
        className="action-btn settings-btn"
        id="goToSignup"
        aria-label="Logout"
      >
        🚪 Logout
      </button>
    </footer>
  );
};

export default Footer;
