
import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import { Drawer, Button, Form, Input, DatePicker, message } from "antd";
import "../styles/Profile.css";
import axios from "axios";
import userlogo from  '../Assests/User.png'
import { useNavigate } from "react-router-dom";

const StyledFormItem = styled(Form.Item)`
  .ant-form-item-label > label {
    color: #00B4D2 !important;
    border-color: #00B4D2 !important;
  }
  .ant-picker {
  border-color: #00B4D2 !important;
  color:#00B4D2;
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

  const handleClick = () =>{
    setAuth({});
    onClose();
    navigate('/');
    
  }

  const handleClose = () => {
    setEditMode(false); 
    onClose(); 
  };

  const handleUpdate = async () => {
    try {
      
      const dob = editedData.dob;
      const dobDate = dob ? new Date(dob) : null;
      if (dob && isNaN(dobDate.getTime())) {
        throw new Error('Invalid date of birth');
      }
  
      
      const formattedData = {
        ...editedData,
        dob: dobDate ? dobDate.toISOString() : null,
      };
  
   
      const response = await axios.put(
        `http://localhost:5040/candidate/${auth._id}`,
        formattedData
      );
  
      setEditMode(false);
      const updatedResponse = await axios.get(
        `http://localhost:5040/candidate/${auth._id}`
      );
      setEditedData(updatedResponse.data);
      message.success("Your updates will be applied shortly after review.")
     
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value; 
    
    if (name === 'dob') {
     
      formattedValue = new Date(value).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    }
  
    setEditedData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));
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
          <Form layout="vertical" onFinish={handleUpdate} initialValues={auth}>           
          <StyledFormItem label="DoB">
            <DatePicker
              name="dob"
              onChange={(date, dateString) => handleInputChange({ target: { name: 'dob', value: dateString } })}
              format="DD-MM-YYYY"
            />
          </StyledFormItem>
          <StyledFormItem label="Qualification">
            <Input name="qualification" onChange={handleInputChange} />
          </StyledFormItem>
          <StyledFormItem label="Experience">
            <Input name="totalExperience" onChange={handleInputChange} />
          </StyledFormItem>
          <StyledFormItem label="Contact">
            <Input name="contact" onChange={handleInputChange} />
          </StyledFormItem>
          <StyledFormItem label="City">
            <Input name="currentLocation" onChange={handleInputChange} />
          </StyledFormItem>
          <StyledFormItem label="District">
            <Input name="district" onChange={handleInputChange} />
          </StyledFormItem>
          <StyledFormItem label="Manager Name">
            <Input name="mgrName" onChange={handleInputChange} />
          </StyledFormItem>
          <Button type="primary" style={{ backgroundColor: '#00B4D2', borderColor: '#fff' }} htmlType="submit">
            Update
          </Button>
        </Form>
        ) : (
          <div className="profile-info">
            <div className="profile-header">
            <img src={userlogo} alt="User Logo" className="user-logo" width={70}/>
              <h2>{auth.fullName}</h2>
            </div>       
            
            <center><p>{auth.email}</p></center>
            <center><p>{auth.role}</p></center>
            <div style={{alignContent: 'space-between'}}>
            <Button type="primary" style={{ backgroundColor: '#00B4D2', borderColor: '#fff' }} onClick={handleEditClick}>
            Edit Profile
          </Button>
          <Button type="primary" style={{ float:'right', backgroundColor: '#A50707', borderColor: '#fff' }} onClick={handleClick}>
            Sign Out
          </Button>
          </div>
          <br />
          <div style={{width:'100%'}}><hr/></div>
          <p><span>First Name: </span>{auth.firstName}</p>
          <p><span>Last Name: </span>{auth.lastName}</p>
            <p><span>DoB: </span>{new Date(auth.dob).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
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