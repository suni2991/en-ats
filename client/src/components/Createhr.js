import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Regform.css'
import { message } from 'antd';

const Createhr = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentLocation: '',
    qualification: '',
    role: '',
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
    const fullName = formData.firstName + ' ' + formData.lastName;
    if (!formData.email.endsWith('@enfuse-solutions.com')) {
      message.error('Email must end with "@enfuse-solutions.com"');
      return;
    }
  
    console.log('Form Data:', formData); // Debugging log
  
    try {
      const response = await axios.post('http://localhost:5040/register/candidate', {
        ...formData,
        password:password,
        createdAt:createdAt,
        confirmPassword: password,
        fullName: fullName,
      });
      message.success("User Created Successfully")
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        currentLocation: '',
        qualification: '',
        role: ''
      });
    } catch (error) {
      console.error('Error creating user:', error); 
    }
  };

  return (
    <div className='table-container'>
      <h1>Create User</h1>
      <form>
      <div className='formContainer'>
      <div className='block'>
      <div>
        <label htmlFor="firstName">First Name:</label><br />
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        </div>
        <div>
        <label htmlFor="firstName">Last Name:</label><br />
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        </div>
        <div>
        <label htmlFor="email">Email:</label><br />
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        </div>
        </div>
        <div className='block'>
        <div>
        <label htmlFor="currentLocation">Current Location:</label><br />
        <input
          type="text"
          id="currentLocation"
          name="currentLocation"
          value={formData.currentLocation}
          onChange={handleChange}
          required
        />
        </div>
        <div>
        <label htmlFor="qualification">Qualification:</label><br />
        <input
          type="text"
          id="qualification"
          name="qualification"
          value={formData.qualification}
          onChange={handleChange}
          required
        />
        </div>
        <div>
        <label htmlFor="role">Role:</label><br />
        <select id="roleSelect" name="role" value={formData.role} onChange={handleRoleChange}>
   <option>Choose Role</option>
    <option value="HR">HR</option>
    <option value="Admin">Admin</option>
    <option value="Enfusian">Enfusian</option>
</select>
</div>
</div>
</div>
<div id='btnWrapper'>
        <button type="submit" onClick={handleSubmit}>Create User</button>
        </div>
        </form>
    </div>
  );
};

export default Createhr;
