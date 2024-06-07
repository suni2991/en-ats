import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FaTh, FaAdn, FaRegUser } from 'react-icons/fa';
import { MdLogout } from 'react-icons/md';
import { TiBriefcase } from 'react-icons/ti';
import { FaRegChartBar } from 'react-icons/fa';
import { LuMonitorCheck } from 'react-icons/lu';
import useAuth from '../hooks/useAuth';
import '../styles/Sidebar.css';
import logo from '../Assests/enfuse-logo.png';

import { HomeOutlined} from '@ant-design/icons';
import { Input, Button, AutoComplete, Modal,Tooltip, Breadcrumb } from 'antd';
import ProfilePage from './ProfilePage';
import { VscFeedback } from 'react-icons/vsc';
import axios from 'axios';
import Swal from 'sweetalert2';

const Sidebar = ({ children }) => {
  const navigate = useNavigate();
  const [isOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [profileVisible, setProfileVisible] = useState(false);
  const { auth, setAuth } = useAuth();

  const [suggestions, setSuggestions] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [selectedCandidateDetails, setSelectedCandidateDetails] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  const handleSearch = async (value) => {
    setSearchValue(value);
    try {
      const response = await axios.get(`/candidates/search/${value}`);
      setSuggestions(response.data.map(candidate => ({ value: candidate.firstName })));
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  const onSelect = async (value) => {
    setSelectedEmail(value);
    try {
      const response = await axios.get(`http://localhost:5040/candidates/search/${value}`);
      console.log('API response:', response.data); // Add this line for debugging
      setSelectedCandidateDetails(response.data[0]); // Assuming the API returns a single candidate based on email
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching candidate details:', error);
    }
  };



  const handleCancel = () => {
    setModalVisible(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const logout = () => {
    setAuth({});
    navigate('/');
    Swal.fire("You have been successfullY logged out!!")
    
    

  };

  const menuItem = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: <LuMonitorCheck />,
    },
    {
      path: '/admins',
      name: 'User Managment',
      icon: <FaAdn />,
    },
    {
      path: '/jobs',
      name: 'Jobs',
      icon: <TiBriefcase />,
    },
    {
      path: '/hr',
      name: 'Candidates',
      icon: <FaRegUser />,
    },
    {
      path: '/reports',
      name: 'Scores',
      icon: <FaTh />,
    },
    {
      path: '/statistics',
      name: 'Statistics',
      icon: <FaRegChartBar />,
    },
    
    {
      path: '/feedbacks',
      name: 'Feedback',
      icon: <VscFeedback />,
    },
  ];

  const { pathname } = useLocation();

  const getCurrentMenuItem = () => {
    
    return menuItem.find(item => item.path === pathname);
  };

  return (
    <div>
      <div className="container">
        {auth.role && (
          <div style={{ width: isOpen ? '180px' : '25px' }} className="sidebar">
            <div className="top-section">
              <button style={{ background: 'none', border: 'none', float: 'left' }} onClick={toggleDarkMode}>
                <img src={logo} alt="EnFuse" />
              </button>
              {auth.role === 'Admin' || auth.role === 'Enfusian' ? (
                <img
                  style={{ width: '60%', borderRadius: '50%', background: 'white' }}
                  src={auth.image !== '' ? `http://localhost:5040${auth.image}` : require('../Assests/User.png')}
                  alt="logo"
                />
              ) : null}
              <br />
            </div>

            {menuItem.map((item, index) => {
              if (auth.role === 'Admin') {
                return (
                  (item.name === 'User Managment' || item.name === 'HR' || item.name === 'Dashboard' || item.name === 'Statistics') && (
                    <NavLink to={item.path} key={index} className="link" activeclassname="active">
                      <div className="icon">{item.icon}</div>
                      <div className="link-text">{item.name}</div>
                    </NavLink>
                  )
                );
              } else if (auth.role === 'HR') {
                return (
                  (item.name === 'Jobs' ||
                    item.name === 'Candidates' ||
                    item.name === 'Dashboard' ||
                    item.name === 'Scores' ||
                    item.name === 'Statistics' ||
                   
                    item.name === 'Feedback') && (
                    <NavLink to={item.path} key={index} className="link" activeclassname="active">
                      <div className="icon">{item.icon}</div>
                      <div className="link-text">{item.name}</div>
                    </NavLink>
                  )
                );
              } else if (auth.role === 'Enfusian') {
                return (
                  item.name === 'Feedback' && (
                    <NavLink to={item.path} key={index} className="link" activeclassname="active">
                      <div className="icon">{item.icon}</div>
                      <div className="link-text">{item.name}</div>
                    </NavLink>
                  )
                );
              } else {
                return null;
              }
            })}

            
          </div>
        )}
        <main className={`main-container ${isDarkMode ? 'dark-mode' : ''}`}>
          {(auth.role === 'HR' || auth.role === 'Admin' || auth.role === 'Enfusian')&& (
            <nav className="navbar">
          
   
        
              <div className="navbar-right">
              <Tooltip title="View & Update Profile" color='cyan'>
                <Button type="text"  onClick={() => setProfileVisible(true)} style={{color: '#00B4D2'}}>
                  Welcome, {auth.fullName} |
                </Button></Tooltip>
              </div>

              {auth.role && (
                <button className="icon-button" onClick={logout}>
                  <span className="icon-container">
                    <MdLogout />
                  </span>{' '}
                  <span className="text">Logout</span>
                </button>
              )}
            </nav>
          )}
          {auth && <ProfilePage open={profileVisible} auth={auth} onClose={() => setProfileVisible(false)} />}

          {children}
        </main>
      </div>
    </div>
  );
};

export default Sidebar;
