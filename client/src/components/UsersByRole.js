import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import '../styles/UserRoles.css'; // Import CSS file for styling

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

  const getCardColor = (index) => {
    const colors = ['#969596', '#1a2763', '#00B4D2', '#ba11a4']; // Define your colors here
    return colors[index % colors.length];
  };

  return (
    <div className="user-roles-container">
      
    <div className="role-boxes">
    {usersByRole.filter(userRole => userRole._id !== 'Admin').map((userRole, index) => (
      <div key={userRole._id} className="role-box" style={{ backgroundColor: getCardColor(index) }}>
        <h1>{userRole._id}</h1>
        <h1 style={{float:'right'}}>{userRole.count}</h1>
      </div>
    ))}
  </div>
    </div>
  );
};

export default UsersByRole;
