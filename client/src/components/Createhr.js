import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Login.css'

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

    if (!formData.email.endsWith('@enfuse-solutions.com')) {
      alert('Email must end with "@enfuse-solutions.com"');
      return;
    }
  
    console.log('Form Data:', formData); // Debugging log
  
    try {
      const response = await axios.post('http://localhost:5040/register/candidate', {
        ...formData,
        password:password,
        createdAt:createdAt,
        confirmPassword: password,
      });
      console.log('User created:', response.data);
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
    <div>
      <h2>Create HR User</h2>
      <form>
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <label htmlFor="firstName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <label htmlFor="currentLocation">Current Location:</label>
        <input
          type="text"
          id="currentLocation"
          name="currentLocation"
          value={formData.currentLocation}
          onChange={handleChange}
          required
        />
        <label htmlFor="qualification">Qualification:</label>
        <input
          type="text"
          id="qualification"
          name="qualification"
          value={formData.qualification}
          onChange={handleChange}
          required
        />
        <label htmlFor="role">Role:</label>
        <select id="roleSelect" name="role" value={formData.role} onChange={handleRoleChange}>
    <option value="Candidate">Candidate</option>
    <option value="HR">HR</option>
    <option value="Admin">Admin</option>
    <option value="Enfusian">Enfusian</option>
</select>
        <button type="submit" onClick={handleSubmit}>Create User</button>
      </form>
    </div>
  );
};

export default Createhr;
