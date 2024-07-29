import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaTh, FaAdn, FaRegUser } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { TiBriefcase } from "react-icons/ti";
import { LuMonitorCheck } from "react-icons/lu";
import useAuth from "../hooks/useAuth";
import "../styles/Sidebar.css";
import logo from "../Assests/enfuse-logo.png";
import { Tooltip, Button } from "antd";
import ProfilePage from "./ProfilePage";
import { VscFeedback } from "react-icons/vsc";
import {message} from 'antd';

const URL = process.env.REACT_APP_API_URL;

const Sidebar = ({ children }) => {
  const navigate = useNavigate();
  const [isOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const { auth, setAuth, token, setToken } = useAuth();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const logout = () => {
    setAuth({});
    navigate("/");
    if (token) {
      setToken(null);
    }
    message.success("You have been successfully logged out!!");
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
      name: "EnFusians",
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
      icon: <FaRegUser />,
    },
    {
      path: "/applicants",
      name: "Statistics",
      icon: <FaRegUser />,
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
    <div className="container">
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
              (item.name === "EnFusians" ||
                item.name === "Statistics" ||
                item.name === "Dashboard") && (
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
                item.name === "Feedback") && (
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
              item.name === "Feedback" && (
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
          } else if (auth.role === "Ops-Manager") {
            return (
              (item.name === "Dashboard" || item.name === "Feedback") && (
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
      </div>
      <div className="main-container">
        <main>
          <div>
            {(auth.role === "HR" ||
              auth.role === "Admin" ||
              auth.role === "Panelist" ||
              auth.role === "Ops-Manager") && (
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
          <div className="main-content">{children}</div>

          {auth.role && (
            <div className="footer">
              @ 2024 EnFuse Solutions. All rights Reserved
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Sidebar;
