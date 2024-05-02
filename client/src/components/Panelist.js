import React, { useState } from 'react';

const Panelist = () => {
  const [formData, setFormData] = useState({
    position: '',
    skills: '',
    rating: '',
    notes: '',
    fullName: '',
    experience: '',
    availability: '',
    panelistName: '',
    round: '',
    evaluationDetails: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
  
    console.log(formData);
    
    setFormData({
      position: '',
      skills: '',
      rating: '',
      notes: '',
      candidateName: '',
      experience: '',
      availability: '',
      panelistName: '',
      round: '',
      evaluationDetails: '',
    });
  };

  return (
    <div>
      <h1>Interview Feedback Form</h1>
      <form onSubmit={handleSubmit}>
     
        <label htmlFor="position">Role:</label>
        <select id="position" name="position" value={formData.position} onChange={handleChange} required>
          <option value="">Select Role</option>
          <option value="AEM Developer">AEM Developer</option>
          <option value="NodeJS Developer">NodeJS Developer</option>
          <option value="HTML/CSS/UI Development">HTML/CSS/UI Development</option>
        </select>

        <label htmlFor="skills">Skills:</label>
        <input type="text" id="skills" name="skills" value={formData.skills} onChange={handleChange} required />
        <label htmlFor="rating">Rating out of 5:</label>
        <input type="number" id="rating" name="rating" min="1" max="5" value={formData.rating} onChange={handleChange} required />
        <label htmlFor="notes">Notes:</label>
        <textarea id="notes" name="notes" rows="4" value={formData.notes} onChange={handleChange} required></textarea>

   
        <label htmlFor="candidateName">Candidate Name:</label>
        <input type="text" id="candidateName" name="candidateName" value={formData.candidateName} onChange={handleChange} required />
        <label htmlFor="experience">Experience:</label>
        <input type="text" id="experience" name="experience" value={formData.experience} onChange={handleChange} required />
        <label htmlFor="availability">Availability/Notice Period:</label>
        <input type="text" id="availability" name="availability" value={formData.availability} onChange={handleChange} required />

   
        <label htmlFor="panelistName">Panelist Name:</label>
        <input type="text" id="panelistName" name="panelistName" value={formData.panelistName} onChange={handleChange} required />
        <label htmlFor="round">Round:</label>
        <input type="text" id="round" name="round" value={formData.round} onChange={handleChange} required />

        <label htmlFor="evaluationDetails">Evaluation Details:</label>
        <textarea id="evaluationDetails" name="evaluationDetails" rows="4" value={formData.evaluationDetails} onChange={handleChange} required></textarea>

        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default Panelist;
