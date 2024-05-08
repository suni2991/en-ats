
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
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
import { Input, Button } from 'antd';
import ProfilePage from './ProfilePage';
import { VscFeedback } from "react-icons/vsc";
import axios from 'axios';

const Sidebar = ({ children }) => {
  const navigate = useNavigate();
  const [isOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [profileVisible, setProfileVisible] = useState(false);
  const { auth, setAuth } = useAuth();
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  }
  const handleSearch = async (email) => {
    setSearchValue(email);
    try {
      const response = await axios.get(`/candidates/${email}`);
      setFilteredMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };
 

 
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
    },
    {
      path: "/feedbacks",
      name: "Feedback",
      icon: <VscFeedback />,
    },
   
    
    
  ];
  const { pathname } = useLocation();

  // const getCurrentMenuItem = () => {
  //   return menuItem.find(item => item.path === pathname);
  // };
  
  const getCurrentMenuItem = () => {
    console.log("Current pathname:", pathname);
    return menuItem.find(item => item.path === pathname);
  };


  return (
    <div>
      <div className='container'>
      
        {
          auth.role &&
          <div style={{ width: isOpen ? "180px" : "25px" }} className='sidebar'>
            <div className='top-section'>
            <button style={{ background: 'none', border: 'none', float: 'left' }} onClick={toggleDarkMode}><img src={logo} alt="EnFuse" /></button>
            {auth.role === 'Admin' || auth.role === 'Enfusian' ? (
              <img style={{ width: "60%", borderRadius: "50%", background: "white" }} src={(auth.image !== "") ? `http://localhost:5040` + auth.image : require('../Assests/User.png')} alt='logo' />
            ) : null}<br />
            </div>

            {
              menuItem.map((item, index) => {
                if (auth.role === "Admin") {
                  return (
                    (item.name === "Admin" || item.name === "HR" || item.name === "Dashboard" || item.name === "Jobs" ||item.name === "Statistics" ) &&
                    <NavLink to={item.path} key={index} className="link" activeclassname="active">
                      <div className='icon'>{item.icon}</div>
                      <div className='link-text'>{item.name}</div>
                    </NavLink>
                  );
                } else if (auth.role === "HR") {
                  return (
                    ( item.name === "Jobs" || item.name === "Candidates" || item.name === "Dashboard" || item.name === "Scores" || item.name === "Statistics" || item.name === "Credentials"|| item.name === "Feedback" ) &&
                    <NavLink to={item.path} key={index} className="link" activeclassname="active">
                      <div className='icon'>{item.icon}</div>
                      <div className='link-text'>{item.name}</div>
                    </NavLink>
                  );
                } else if (auth.role === "Enfusian") {
                  return (
                    (item.name === "Feedback")&&
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
        {
          auth.role &&
        <nav className="navbar">
          <div className="breadcrumb">
          {getCurrentMenuItem()?.name}
          </div>
          <div className="navbar-center">
            <Input.Search
              placeholder="Search..."
              allowClear
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="navbar-right">
          <Button type="text" onClick={() => setProfileVisible(true)}>
          {auth.fullName}
        </Button>
          </div>
        </nav>}
        {auth && <ProfilePage visible={profileVisible} auth={auth} onClose={() => setProfileVisible(false)} />}
          
        {children}</main>
      </div>
    </div>

  );
};

export default Sidebar;
