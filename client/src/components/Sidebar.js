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
import { IoKeyOutline } from 'react-icons/io5';
import { Input, Button, AutoComplete, Modal, message, Tooltip } from 'antd';
import ProfilePage from './ProfilePage';
import { VscFeedback } from 'react-icons/vsc';
import axios from 'axios';

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

  const renderOption = (item) => {
    return (
      <AutoComplete.Option key={item.value} value={item.value}>
        {item.value}
      </AutoComplete.Option>
    );
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
    message.success('Logged out!', 'You have successfully logged out.', 'success');
    

  };

  const menuItem = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: <LuMonitorCheck />,
    },
    {
      path: '/admins',
      name: 'Admin',
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
      path: '/credentials',
      name: 'Assign Test',
      icon: <IoKeyOutline />,
    },
    {
      path: '/feedbacks',
      name: 'Feedback',
      icon: <VscFeedback />,
    },
  ];

  const { pathname } = useLocation();

  const getCurrentMenuItem = () => {
    console.log('Current pathname:', pathname);
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
                  (item.name === 'Admin' || item.name === 'HR' || item.name === 'Dashboard' || item.name === 'Jobs' || item.name === 'Statistics') && (
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
                    item.name === 'Assign Test' ||
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

            {auth.role && (
              <button className="icon-button" onClick={logout}>
                <span className="icon-container">
                  <MdLogout />
                </span>{' '}
                <span className="text">Logout</span>
              </button>
            )}
          </div>
        )}
        <main className={`main-container ${isDarkMode ? 'dark-mode' : ''}`}>
          {auth.role && (
            <nav className="navbar">
            <div className="breadcrumb">/{getCurrentMenuItem()?.name}</div> 
              <div className="navbar-center">
              <AutoComplete
              value={searchValue}
              options={suggestions}
              onSelect={onSelect}
              onChange={handleSearch}
              style={{ width: '100%'}}
              placeholder="Search by Name... "
              filterOption={(inputValue, option) =>
                option && option.value && option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
            >
              <Input.Search allowClear />
            </AutoComplete>

                <Modal className= 'modal-container' title="User Details" visible={modalVisible} onCancel={handleCancel} footer={null}>
                 
                  {selectedCandidateDetails && (
                    <div>
                      <p>Name: {selectedCandidateDetails.fullName}</p>
                      <p>Email: {selectedCandidateDetails.email}</p>
                      <p>Role: {selectedCandidateDetails.role}</p>
                      <p>Contact: {selectedCandidateDetails.contact}</p>
                      <p>Qualification: {selectedCandidateDetails.qualification}</p>
                      <p>Experience: {selectedCandidateDetails.totalExperience}</p>
                      {auth.role === 'Candidate' && (
                        <>
                          
                        <p>Relevant Experience: {selectedCandidateDetails.relevantExperience}</p>
                          <p>Position: {selectedCandidateDetails.position}</p>
                          <p>Notice Period: {selectedCandidateDetails.noticePeriod}</p>
                          <p>Status: {selectedCandidateDetails.status}</p>
                        </>
                      )}
                    </div>
                  )}
                </Modal>
              </div>
              <div className="navbar-right">
              <Tooltip title="View & Update Profile">
                <Button type="text"  onClick={() => setProfileVisible(true)} style={{color: '#00B4D2'}}>
                  Hello, {auth.fullName}
                </Button></Tooltip>
              </div>
            </nav>
          )}
          {auth && <ProfilePage visible={profileVisible} auth={auth} onClose={() => setProfileVisible(false)} />}

          {children}
        </main>
      </div>
    </div>
  );
};

export default Sidebar;
