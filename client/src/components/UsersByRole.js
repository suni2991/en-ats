import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/UserRoles.css'; // Import CSS file for styling

const UsersByRole = () => {
  const [usersByRole, setUsersByRole] = useState([]);

  useEffect(() => {
    const fetchUsersByRole = async () => {
      try {
        const response = await axios.get('/users-by-role');
        setUsersByRole(response.data);
      } catch (error) {
        console.error('Error fetching users by role:', error);
      }
    };

    fetchUsersByRole();
  }, []);

  return (
    <div className="user-roles-container">
      <h2>Users </h2>
      <div className="role-boxes">
        {usersByRole.map((userRole) => (
          <div key={userRole._id} className="role-box">
            <h1>{userRole._id}</h1>
            <h2>{userRole.count}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersByRole;
