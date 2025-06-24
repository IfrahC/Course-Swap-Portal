import React from 'react';
import ProfileImage from './ProfileAvatar';
import ProfileDetails from './ProfileInfo';

const ProfileCard = ({ userData, showRequests = true  }) => {
  return (
    <div className="profile-card">
      <ProfileImage src={userData.profileImage} />
      <ProfileDetails userData={userData} showRequests={showRequests} />
    </div>
  );
};

export default ProfileCard;