import React, { useState } from 'react';
import axios from 'axios';
import { Button } from 'antd';
import '../styles/ApplyForm.css'; // Importing the CSS file

const ApplyForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    totalExperience: '',
    relevantExperience: '',
    noticePeriod: '',
    qualification: '',
    contact: '',
    email: '',
    appliedPosition: '',
    resume: '',
    lwd: '',
    state: '',
    city: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Additional validation can be added here

    try {
      const response = await axios.post('/api/applicants', formData);
      console.log('Applicant submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting applicant:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="apply-form">
    <div className="form-row">
      <div className="form-group">
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          pattern="^[A-Za-z]+$"
          required
        />
        <div className='labelline'>First Name</div>
      </div>
      <div className="form-group">
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          pattern="^[A-Za-z]+$"
          required
        />
        <div className='labelline'>Last Name</div>
      </div>
    </div>
    <div className="form-row">
      <div className="form-group">
        <input
          type="text"
          name="totalExperience"
          value={formData.totalExperience}
          onChange={handleChange}
          pattern="^\d{0,5}(\.\d{0,2})?$"
          required
        />
        <div className='labelline'>Total Experience</div>
      </div>
      <div className="form-group">
        <input
          type="text"
          name="relevantExperience"
          value={formData.relevantExperience}
          onChange={handleChange}
          pattern="^\d{0,5}(\.\d{0,2})?$"
          required
        />
        <div className='labelline'>Relevant Experience</div>
      </div>
    </div>
    <div className="form-row">
      <div className="form-group">
        <select
          name="noticePeriod"
          value={formData.noticePeriod}
          onChange={handleChange}
          required
        >
          <option value="">Select Availability</option>
          <option value="Immediate">Immediate</option>
          <option value="30days">30 Days</option>
          <option value="45days">45 Days</option>
        </select>
      </div>
      <div className="form-group">
        <input
          type="text"
          name="qualification"
          value={formData.qualification}
          onChange={handleChange}
          required
        />
        <div className='labelline'>Qualification</div>
      </div>
    </div>
    <div className="form-row">
      <div className="form-group">
        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          pattern="^\d{10}$"
          required
        />
        <div className='labelline'>Contact</div>
      </div>
      <div className="form-group">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
          required
        />
        <div className='labelline'>Email</div>
      </div>
    </div>
    <div className="form-row">
      <div className="form-group">
        <input
          type="file"
          name="resume"
          value={formData.resume}
          onChange={handleChange}
          required
        />
        <div className='labelline'>Resume</div>
      </div>
      <div className="form-group">
        <input
          type="date"
          name="lwd"
          value={formData.lwd}
          onChange={handleChange}
        />
        <div className='labelline'>Last Working Day</div>
      </div>
    </div>
    <div className="form-row">
      <div className="form-group">
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          required
        />
        <div className='labelline'>State</div>
      </div>
      <div className="form-group">
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        />
        <div className='labelline'>City</div>
      </div>
    </div>
    <Button type="default" style={{marginTop:'15px'}}>Submit</Button>
  </form>
  );
};

export default ApplyForm;
