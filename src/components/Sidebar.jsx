import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUserCircle, FaExchangeAlt, FaSignOutAlt } from 'react-icons/fa';
import { MdNotifications } from 'react-icons/md';
import Logo from './Logo';

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <Logo />
      <ul className="menu">
        <li onClick={() => navigate('/dashboard')}>
          <FaTachometerAlt /> Dashboard
        </li>
        <li onClick={() => navigate('/notifications')}>
          <MdNotifications /> Notifications
        </li>
        <li onClick={() => navigate('/my-requests')}>
          <FaExchangeAlt /> My Requests
        </li>
        <li onClick={() => navigate('/profile')}>
          <FaUserCircle /> Profile
        </li>
        <li onClick={() => navigate('/')}>
          <FaSignOutAlt /> Logout
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
