import React from 'react';
import { Drawer } from 'antd';
import '../styles/Profile.css';

const ProfilePage = ({ visible, onClose, auth }) => {
  return (
    <Drawer
      title="Profile Details"
      placement="right"
      closable={false}
      onClose={onClose}
      visible={visible}
      width={400}
    >
      <div className="profile-info">
        <p>Full Name: {auth.fullName}</p>
        <p>Email: {auth.email}</p>
        <p>Date of Birth: {auth.dob}</p>
        <p>Qualification: {auth.qualification}</p>
        <p>Total Experience: {auth.totalExperience}</p>
        <p>Contact: {auth.contact}</p>
        <p>City: {auth.currentLocation}</p>
        <p>District: {auth.district}</p>
        <p>Manager Name: {auth.mgrName}</p>
        {/* Add more fields as needed */}
      </div>
    </Drawer>
  );
};

export default ProfilePage;
