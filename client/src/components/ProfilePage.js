import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import { Drawer, Button, Form, Input, DatePicker, message } from "antd";
import "../styles/Profile.css";
import axios from "axios";
import userlogo from '../Assests/User.png';
import { useNavigate } from "react-router-dom";
import moment from 'moment';

const StyledFormItem = styled(Form.Item)`
  .ant-form-item-label > label {
    color: #00B4D2 !important;
    border-color: #00B4D2 !important;
  }
  .ant-picker {
    border-color: #00B4D2 !important;
    color: #00B4D2;
  }
`;

const ProfilePage = ({ open, onClose, auth, setAuth }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!editMode) {
      setEditedData(auth);
    }
  }, [editMode, auth]);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleClick = () => {
    setAuth({});
    onClose();
    navigate('/');
  };

  const handleClose = () => {
    setEditMode(false);
    onClose();
  };

  const handleUpdate = async (values) => {
    try {
      const formattedData = {
        ...values,
        dob: values.dob ? values.dob.toISOString() : null,
      };

      await axios.put(
        `http://localhost:5040/candidate/${auth._id}`,
        formattedData
      );

      setEditMode(false);
      const updatedResponse = await axios.get(
        `http://localhost:5040/candidate/${auth._id}`
      );
      setEditedData(updatedResponse.data);
      message.success("Your updates will be applied shortly after review.");
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Error updating profile");
    }
  };

  const handleDateChange = (date) => {
    setEditedData((prevData) => ({
      ...prevData,
      dob: date ? date.toISOString() : null,
    }));
  };

  const validateDate = (date) => {
    if (!date) return Promise.reject('Please select a date');
    const age = moment().diff(date, 'years');
    if (age < 18) return Promise.reject('Age must be above 18');
    if (age > 60) return Promise.reject('Age must be below 60');
    if (date.isAfter(moment())) return Promise.reject('Date cannot be in the future');
    return Promise.resolve();
  };

  return (
    <div className="profile-container">
      <Drawer
        placement="right"
        closable={false}
        onClose={handleClose}
        open={open}
        width={400}
      >
        {editMode ? (
          <Form layout="vertical" onFinish={handleUpdate} initialValues={{ ...auth, dob: null }}>
            <StyledFormItem label="DoB" name="dob" rules={[{ validator: (_, value) => validateDate(value) }]}>
              <DatePicker
                onChange={handleDateChange}
                format="DD-MM-YYYY"
                placeholder="Select Date"
              />
            </StyledFormItem>
            <StyledFormItem label="Qualification" name="qualification" rules={[{ pattern: /^[a-zA-Z,@-]*$/, message: "Invalid characters" }]}>
              <Input />
            </StyledFormItem>
            <StyledFormItem label="Experience" name="totalExperience" rules={[{ pattern: /^[a-zA-Z,@-]*$/, message: "Invalid characters" }]}>
              <Input />
            </StyledFormItem>
            <StyledFormItem label="Contact" name="contact" rules={[
              { pattern: /^\d{10}$/, message: "Contact number must be 10 digits" }
            ]}>
              <Input />
            </StyledFormItem>
            <StyledFormItem label="City" name="currentLocation" rules={[{ pattern: /^[a-zA-Z,@-]*$/, message: "Invalid characters" }]}>
              <Input />
            </StyledFormItem>
            <StyledFormItem label="District" name="district" rules={[{ pattern: /^[a-zA-Z,@-]*$/, message: "Invalid characters" }]}>
              <Input />
            </StyledFormItem>
            <StyledFormItem label="Manager Name" name="mgrName" rules={[{ pattern: /^[a-zA-Z,@-]*$/, message: "Invalid characters" }]}>
              <Input />
            </StyledFormItem>
            <Button type="primary" style={{ backgroundColor: '#00B4D2', borderColor: '#fff' }} htmlType="submit">
              Update
            </Button>
          </Form>
        ) : (
          <div className="profile-info">
            <div className="profile-header">
              <img src={userlogo} alt="User Logo" className="user-logo" width={70} />
              <h2>{auth.fullName}</h2>
            </div>
            <center><p>{auth.email}</p></center>
            <center><p>{auth.role}</p></center>
            <div style={{ alignContent: 'space-between' }}>
              <Button type="primary" style={{ backgroundColor: '#00B4D2', borderColor: '#fff' }} onClick={handleEditClick}>
                Edit Profile
              </Button>
              <Button type="primary" style={{ float: 'right', backgroundColor: '#A50707', borderColor: '#fff' }} onClick={handleClick}>
                Sign Out
              </Button>
            </div>
            <br />
            <div style={{ width: '100%' }}><hr /></div>
            <p><span>First Name: </span>{auth.firstName}</p>
            <p><span>Last Name: </span>{auth.lastName}</p>
            <p><span>DoB: </span>{auth.dob ? new Date(auth.dob).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}</p>
            <p><span>Qualification: </span> {auth.qualification}</p>
            <p><span>Experience: </span>{auth.totalExperience}</p>
            <p><span>Contact: </span>{auth.contact}</p>
            <p><span>City: </span>{auth.currentLocation}</p>
            <p><span>District: </span>{auth.district}</p>
            <p><span>Manager Name: </span>{auth.mgrName}</p>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ProfilePage;
