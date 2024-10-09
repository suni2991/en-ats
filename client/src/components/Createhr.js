import React, { useState } from "react";
import axios from "axios";
import "../styles/Regform.css";
import { Tooltip, message, Button } from "antd";
import useAuth from "../hooks/useAuth";

const URL = process.env.REACT_APP_API_URL;
const Createhr = ({ closeModal }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    role: "",
    empCount: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRoleChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      role: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const password = Math.random().toString(36).slice(-8);
    const createdAt = new Date();
    const fullName = `${formData.firstName} ${formData.lastName}`;

    if (!formData.email.endsWith("@enfuse-solutions.com")) {
      message.error('Email must end with "@enfuse-solutions.com"');
      return;
    }

    console.log("Form Data:", formData);

    try {
      const response = await axios.post(
`${URL}/register/candidate`,
        {
          ...formData,
          password: password,
          createdAt: createdAt,
          confirmPassword: password,
          fullName: fullName,
        }
      );

      if (response.status === 201) {
        const data = response.data;

        const emailData = {
          role: data.role,
          confirmPassword: data.confirmPassword,
          email: data.email,
          fullName: data.fullName,
        };

        const emailResponse = await axios.post(
          `${URL}/user/credentials`,
          emailData,
          {
              headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        message.success("User Created Successfully");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          currentLocation: "",
          qualification: "",
          role: "",
          empCount: 0,
        });
        closeModal();
      }
    } catch (error) {
      console.error("Error creating user:", error);
      message.error("Error creating user");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="formContainer">
          <div className="block">
            <div>
              <label htmlFor="firstName">First Name:</label>
              <br />
              <input
                type="text"
                id="firstName"
                placeholder="Enter First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="lastName">Last Name:</label>
              <br />
              <input
                type="text"
                id="lastName"
                placeholder="Enter Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <br />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Please enter Enfuse Email Id only"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="block">
            <div>
              <label htmlFor="currentLocation">Current Location:</label>
              <br />
              <input
                type="text"
                id="currentLocation"
                name="currentLocation"
                placeholder="Enter Current Location"
                value={formData.currentLocation}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="department">Department:</label>
              <br />
              <input
                type="text"
                id="department"
                name="department"
                placeholder="Choose Department"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="role">Role:</label>
              <br />
              <select
                id="roleSelect"
                name="role"
                value={formData.role}
                onChange={handleRoleChange}
              >
                <option>Choose Role</option>
                <option value="HR">HR</option>
                <option value="Admin">Admin</option>
                <option value="Panelist">Panelist</option>
                <option value="Ops-Manager">Ops-Manager</option>
              </select>
            </div>
          </div>
        </div>
        <div id="btnWrapper">
          <Tooltip title="Submit" color="red">
            <Button
              type="submit"
              className="add-button"
              style={{ backgroundColor: "#A50707" }}
              onClick={handleSubmit}
            >
              Create User
            </Button>
          </Tooltip>
        </div>
      </form>
    </div>
  );
};

export default Createhr;
