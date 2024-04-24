
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaTh, FaAdn , FaRegUser } from "react-icons/fa";
import { MdLogout } from 'react-icons/md';
import { TiBriefcase } from "react-icons/ti";
import { FaRegChartBar } from "react-icons/fa";
import { LuMonitorCheck } from "react-icons/lu";
import useAuth from "../hooks/useAuth";
import '../styles/Sidebar.css';
import logo from '../Assests/enfuse-logo.png'
import Swal from 'sweetalert2';
import { IoKeyOutline } from "react-icons/io5";

const Sidebar = ({ children }) => {
  const navigate = useNavigate();
  const [isOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  }

  const { auth, setAuth } = useAuth();
  const logout = () => {
    setAuth({})
    navigate('/')
        Swal.fire(
          'Logged out!',
          'You have successfully logged out.',
          'success'
        )
  
    console.log("Logged out");
  }

  const menuItem = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: <LuMonitorCheck />
    },
    {
      path: "/admins",
      name: "Admin",
      icon: <FaAdn />,
      
    },
    {
      path:"/jobs",
      name: "Jobs",
      icon: <TiBriefcase />
    },

    {
      path: "/hr",
      name: "Candidates",
      icon: <FaRegUser />

    },
   
    {
      path: "/reports",
      name: "Scores",
      icon: <FaTh />
    },
    {
      path: "/statistics",
      name: "Statistics",
      icon: <FaRegChartBar />,
    },
    {
      path: "/credentials",
      name: "Credentials",
      icon: <IoKeyOutline />,
    }
    
    
  ];
  


  return (
    <div>
      <div className='container'>
        {
          auth.role &&
          <div style={{ width: isOpen ? "180px" : "25px" }} className='sidebar'>
            <div className='top-section'>
            <button style={{ background: 'none', border: 'none', float: 'left' }} onClick={toggleDarkMode}><img src={logo} alt="EnFuse" /></button>
            {auth.role === 'Admin' || auth.role === 'HR' ? (
              <img style={{ width: "80%", borderRadius: "50%", background: "white" }} src={(auth.image !== "") ? `http://localhost:5040` + auth.image : require('../Assests/User.png')} alt='logo' />
            ) : null}<br />
            </div>

            {
              menuItem.map((item, index) => {
                if (auth.role === "Admin") {
                  return (
                    (item.name === "Admin" || item.name === "HR" || item.name === "Dashboard" || item.name === "Jobs" ||item.name === "Statistics") &&
                    <NavLink to={item.path} key={index} className="link" activeclassname="active">
                      <div className='icon'>{item.icon}</div>
                      <div className='link-text'>{item.name}</div>
                    </NavLink>
                  );
                } else if (auth.role === "Hr") {
                  return (
                    ( item.name === "Jobs" || item.name === "Candidates" || item.name === "Dashboard" || item.name === "Scores" || item.name === "Statistics" || item.name === "Credentials" ) &&
                    <NavLink to={item.path} key={index} className="link" activeclassname="active">
                      <div className='icon'>{item.icon}</div>
                      <div className='link-text'>{item.name}</div>
                    </NavLink>
                  );
                } else if (auth.role === item.name) {
                  return (
                    <NavLink to={item.path} key={index} className="link" activeclassname="active">
                      <div className='icon'>{item.icon}</div>
                      <div className='link-text'>{item.name}</div>
                    </NavLink>
                  );
                }  else {
                  return null;
                }
              })
            }

            {
              auth.role &&
              <button className="icon-button" onClick={logout}>
              <span className="icon-container"><MdLogout /></span> <span className="text">Logout</span></button>

          }
          </div>
        }
        <main className={`main-container ${isDarkMode ? 'dark-mode' : ''}`}>

        <p style={{ marginTop:'5px',fontWeight: 'bold', color: '#00B4D2' , marginLeft: '30px'}}>Welcome {auth.fullName}<br />{auth.currentLocation}<br /><br /> {auth.appliedPosition}</p>
          {children}</main>
      </div>
    </div>

  );
};

export default Sidebar;
