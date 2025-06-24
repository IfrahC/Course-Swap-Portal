import React from 'react';
import logoImage from '../assets/logo.png';

const Logo = () => {
  return (
    <div className="logo-wrapper">
      <img src={logoImage} alt="Logo" className="sidebar-logo" />
    </div>
  );
};

export default Logo;
