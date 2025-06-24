import React from 'react';
import ProfileImage from './ProfileAvatar';
import EditProfileDetails from './EditProfileDetails';

const EditProfileCard = ({ userData, onFieldChange }) => {
  return (
    <div className="profile-card">
      <ProfileImage src={userData.profileImage} />
      <EditProfileDetails 
        userData={userData} 
        onFieldChange={onFieldChange}
      />
    </div>
  );
};

export default EditProfileCard;