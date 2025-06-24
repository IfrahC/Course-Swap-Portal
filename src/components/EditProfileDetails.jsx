import React from 'react';
import EditableDetailItem from './EditableDetailItem.jsx';
import DetailItem from './DetailItem';

const EditProfileDetails = ({ userData, onFieldChange }) => {
  return (
    <div className="profile-details">
      {/* Name and Email are now non-editable, like the requests field */}
      <DetailItem title="Name" value={userData.name} />
      <DetailItem title="Email" value={userData.email} />
      
      {/* Phone Number remains editable */}
      <EditableDetailItem 
        title="Phone Number" 
        value={userData.phoneNumber} 
        onChange={(value) => onFieldChange('phoneNumber', value)} 
      />
      
      {/* Requests field is not editable */}
      <DetailItem title="Your requests" value={userData.requests} />
    </div>
  );
};

export default EditProfileDetails;