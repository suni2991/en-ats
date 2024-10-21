import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";

const UsersByRole = () => {
  const [usersByRole, setUsersByRole] = useState([]);
  const { token } = useAuth();
  const URL = process.env.REACT_APP_API_URL;
  
  useEffect(() => {
    const fetchUsersByRole = async () => {
      try {
        const response = await axios.get(`${URL}/users-by-role`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.warn("users-by-role ", response.data);
        setUsersByRole(response.data);
      } catch (error) {
        console.error("Error fetching users by role:", error);
      }
    };

    fetchUsersByRole();
  }, []);

  const getCardColor = (index) => {
    const colors = ["#969596", "#1a2763", "#00B4D2", "#ba11a4"];
    return colors[index % colors.length];
  };

  return (
    <div className="user-roles-container">
      <div className="role-boxes">
        {usersByRole
          .filter((userRole) => userRole._id !== "Admin")
          .map((userRole, index) => (
            <div
              key={userRole._id}
              className="role-box"
              style={{ backgroundColor: getCardColor(index) }}
            >
              <h1>{userRole._id}</h1>
              <h1 style={{ float: "right" }}>{userRole.count}</h1>
            </div>
          ))}
      </div>
    </div>
  );
};

export default UsersByRole;
