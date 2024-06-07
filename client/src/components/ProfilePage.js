
import React, { useState, useEffect } from "react";
import { Drawer, Button, Form, Input, DatePicker, message } from "antd";
import "../styles/Profile.css";
import axios from "axios";


const ProfilePage = ({ open, onClose, auth }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState(auth);

  useEffect(() => {
    if (!editMode) {
      setEditedData(auth); 
    }
  }, [editMode, auth]);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleClose = () => {
    setEditMode(false); 
    onClose(); 
  };

  const handleUpdate = async () => {
    try {
      // Check if DOB is a valid date
      const dob = editedData.dob;
      const dobDate = dob ? new Date(dob) : null;
      if (dob && isNaN(dobDate.getTime())) {
        throw new Error('Invalid date of birth');
      }
  
      // Prepare formatted data for update
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
        title="Profile Details"
        placement="right"
        closable={false}
        onClose={handleClose} 
        open={open}
        width={400}
      >    
        {editMode ? (
          <Form layout="vertical" onFinish={handleUpdate} initialValues={auth}>           
          <Form.Item label="DoB">
          <DatePicker
            name="dob"
            onChange={(date, dateString) => handleInputChange({ target: { name: 'dob', value: dateString } })}
            format="DD-MM-YYYY"
          />
        </Form.Item>
            <Form.Item label="Qualification" >
              <Input name="qualification" onChange={handleInputChange} />
            </Form.Item>
            <Form.Item label="Experience" >
              <Input name="totalExperience" onChange={handleInputChange} />
            </Form.Item>
            <Form.Item label="Contact" >
              <Input name="contact" onChange={handleInputChange} />
            </Form.Item>
            <Form.Item label="City" >
              <Input name="currentLocation" onChange={handleInputChange} />
            </Form.Item>
            <Form.Item label="District" >
              <Input name="district" onChange={handleInputChange} />
            </Form.Item>
            <Form.Item label="Manager Name">
              <Input  name="mgrName" onChange={handleInputChange} />
            </Form.Item>
            <Button type="primary" style={{ backgroundColor: '#00B4D2', borderColor: '#fff' }} htmlType="submit">
              Update
            </Button>
          </Form>
        ) : (
          <div className="profile-info">
            <div className="profile-header">
              <h2>{auth.fullName}</h2>
            </div>       
            <p><span>First Name: </span>{auth.firstName}</p>
            <p><span>Last Name: </span>{auth.lastName}</p>
            <p><span>Email: </span>{auth.email}</p>
            <p><span>DoB: </span>{new Date(auth.dob).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            <p><span>Qualification: </span> {auth.qualification}</p>
            <p><span>Experience: </span>{auth.totalExperience}</p>
            <p><span>Contact: </span>{auth.contact}</p>
            <p><span>City: </span>{auth.currentLocation}</p>
            <p><span>District: </span>{auth.district}</p>
            <p><span>Manager Name: </span>{auth.mgrName}</p>
            <Button type="primary" style={{ backgroundColor: '#00B4D2', borderColor: '#fff' }} onClick={handleEditClick}>
              Edit
            </Button>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ProfilePage;