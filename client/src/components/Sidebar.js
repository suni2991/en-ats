import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaTh, FaAdn, FaRegUser } from "react-icons/fa";
import { MdLogout, MdMoreTime } from "react-icons/md";
import { GiThreeFriends } from "react-icons/gi";
import { TiBriefcase } from "react-icons/ti";
import { LuMonitorCheck } from "react-icons/lu";
import { BiSitemap } from 'react-icons/bi'
import useAuth from "../hooks/useAuth";
import "../styles/Sidebar.css";
import logo from "../Assests/enfuse-logo.png";
import { Tooltip, Button, Modal } from "antd";
import ProfilePage from "./ProfilePage";
import { VscFeedback } from "react-icons/vsc";
import {message} from 'antd';
import { SlCalender } from "react-icons/sl";
import ImageCarousel from './ImageCarousel';

const URL = process.env.REACT_APP_API_URL;

const Sidebar = ({ children }) => {
  const navigate = useNavigate();
  const [isOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const { auth, setAuth, token, setToken } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const logout = () => {
    setAuth({});
    navigate("/login");
    if (token) {
      setToken(null);
    }
    message.success("You have been successfully logged out!!");
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  // Function to handle modal close
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const menuItem = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: <LuMonitorCheck />,
    },
    {
      path: "/jobdashboard",
      name: "Job Dashboard",
      icon: <LuMonitorCheck />,
    },
    {
      path: "/admins",
      name: "Role management",
      icon: <FaAdn />,
    },
    {
      path: "/jobs",
      name: "Jobs",
      icon: <TiBriefcase />,
    },
    {
      path: "/hr",
      name: "ATS",
      icon: <GiThreeFriends />,
    },
    {
      path: "/applicants",
      name: "Statistics",
      icon: <FaRegUser />,
    },
    {
      path: "/schedule",
      name: "Schedule",
      icon: <SlCalender />,
    },
    {
      path: "/slots",
      name: "My Slot",
      icon: <MdMoreTime />,
    },
    {
      path: "/reports",
      name: "Scores",
      icon: <FaTh />,
    },
    {
      path: "/feedbacks",
      name: "Feedback",
      icon: <VscFeedback />,
    },
  ];

  if (!auth.role) {
    return null;
  }

  return (
    <><div className="container">
      <div style={{ width: isOpen ? "180px" : "25px" }} className="sidebar">
        <div className="top-section">
          <button
            style={{ background: "none", border: "none", float: "left" }}
            onClick={toggleDarkMode}
          >
            <img src={logo} alt="EnFuse" />
          </button>
          {auth.role === "Admin" || auth.role === "Enfusian" ? (
            <img
              style={{
                width: "45%",
                borderRadius: "50%",
                background: "white",
              }}
              src={
                auth.image !== ""
                  ? `${URL}${auth.image}`
                  : require("../Assests/User.png")
              }
              alt="logo"
            />
          ) : null}
          <br />
        </div>

        {menuItem.map((item, index) => {
          if (auth.role === "Admin") {
            return (
              (item.name === "Role management" ||
                item.name === "Statistics" ||
                item.name === "ATS" ||
                item.name === "Dashboard" ||
                item.name === "Feedback" ||
                item.name === "Schedule" 
              ) && (
                <NavLink
                  to={item.path}
                  key={index}
                  className="link"
                  activeclassname="active"
                >
                  <div className="icon">{item.icon}</div>
                  <div className="link-text">{item.name}</div>
                </NavLink>
              )
            );
          } else if (auth.role === "HR") {
            return (
              (item.name === "ATS" ||
                item.name === "Dashboard" ||
                item.name === "Scores" ||
                item.name === "Statistics" ||
                item.name === "Feedback" ||
                item.name === "My Slot" ||
                item.name === "Schedule" 
              ) && (
                <NavLink
                  to={item.path}
                  key={index}
                  className="link"
                  activeclassname="active"
                >
                  <div className="icon">{item.icon}</div>
                  <div className="link-text">{item.name}</div>
                </NavLink>
              )
            );
          } else if (auth.role === "Panelist") {
            return (
              item.name === "Feedback" ||  item.name === "My Slot") && (
                <NavLink
                  to={item.path}
                  key={index}
                  className="link"
                  activeclassname="active"
                >
                  <div className="icon">{item.icon}</div>
                  <div className="link-text">{item.name}</div>
                </NavLink>
              )
            } else if (auth.role === "HiringManager") {
            return (
              (item.name === "Dashboard" || item.name === "Feedback" || item.name === "My Slot") && (
                <NavLink
                  to={item.path}
                  key={index}
                  className="link"
                  activeclassname="active"
                >
                  <div className="icon">{item.icon}</div>
                  <div className="link-text">{item.name}</div>
                </NavLink>
              )
            );
          } else {
            return null;
          }
        })}

<div className="help-icon">
{(auth.role === "HR" || auth.role === "Admin") && ( 
          <Tooltip title="Process">
            <Button
              type="text"
              onClick={showModal}
              style={{ color: "#00B4D2", margin: "5px 5px 15px 50px", padding:'10px', borderRadius:'30px' }}
            >
              <BiSitemap size={30}/> 
            </Button>
          </Tooltip>
)}
        </div>
      </div>

      {/* Modal for Image Carousel */}
      <Modal
        title="Process Flow"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <ImageCarousel />
      </Modal>


      </div>
      <div className="main-container">
        <main>
          <div>
            {(auth.role === "HR" ||
              auth.role === "Admin" ||
              auth.role === "Panelist" ||
              auth.role === "HiringManager") && (
              <nav className="navbar">
                <div className="navbar-right">

                  <Tooltip title="View & Update Profile" color="cyan">
                    <Button
                      type="text"
                      onClick={() => setProfileVisible(true)}
                      style={{ color: "#00B4D2" }}
                    >
                      Welcome, {auth.fullName} |

                    </Button>
                  </Tooltip>
                </div>

                {auth.role && (
                  <button className="logout-button" onClick={logout}>
                    <span className="icon-container">
                      <MdLogout />
                    </span>{" "}
                  
                    <span className="text">Logout</span>

                  </button>
                )}
              </nav>
            )}
            {auth && (
              <ProfilePage
                open={profileVisible}
                auth={auth}
                setAuth={setAuth}
                onClose={() => setProfileVisible(false)}
              />
            )}
          </div>
          <div className="main-content">
         
          {children}</div>

          {auth.role && (
            <div className="footer">
              @ 2024 EnFuse Solutions. All rights Reserved
            </div>
          )}
        </main>
      </div>
    </>
  
  );
};


export default Sidebar;
