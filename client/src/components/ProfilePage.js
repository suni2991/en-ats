import React from 'react';
import { Drawer } from 'antd';
import '../styles/Profile.css';

const ProfilePage = ({ visible, onClose, auth }) => {
  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>{auth.fullName}</h2>
      </div>
      
      <Drawer
        title="Profile Details"
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        width={400}
      >
        <div className="profile-info">
          <p>First Name: {auth.firstName}</p>
          <p>Last Name: {auth.lastName}</p>
          <p>Email: {auth.email}</p>
          <p>DoB: {auth.dob}</p>
          <p>Qualification: {auth.qualification}</p>
          <p>Experience: {auth.totalExperience}</p>
          <p>Contact: {auth.contact}</p>
          <p>City: {auth.currentLocation}</p>
          <p>District: {auth.district}</p>
          <p>Manager Name: {auth.mgrName}</p>
        </div>
      </Drawer>
    </div>
  );
};

export default ProfilePage;
