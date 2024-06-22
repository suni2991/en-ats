import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, DatePicker, Rate, Input } from 'antd';
import moment from 'moment';

const Panelist = ({ candidateData, auth }) => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [rating, setRating] = useState({});
  const [formData, setFormData] = useState({
    position: '',
    fullName: '',
    totalExperience: '',
    noticePeriod: '',
    panelistName: '',
    round: '',
    feedback: '',
    joiningDate: null,
  });

  const [isFeedback, setIsFeedback] = useState(false);

  useEffect(() => {
    if (candidateData) {
      setFormData({
        position: candidateData.position,
        fullName: candidateData.fullName,
        totalExperience: candidateData.totalExperience,
        noticePeriod: candidateData.noticePeriod,
        panelistName: candidateData.panelistName,
        round: candidateData.round,
        feedback: '',
        joiningDate: null,
      });
      const skillsData = candidateData.skills.map(skill => skill.name);
      setSkills(skillsData);
      setRating(candidateData.skills.reduce((acc, skill) => {
        acc[skill.name.toLowerCase()] = skill.rating;
        return acc;
      }, {}));
    }
  }, [candidateData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date, dateString) => {
    setFormData((prevData) => ({
      ...prevData,
      joiningDate: dateString,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!candidateData || !candidateData._id) {
      Swal.fire({
        title: "Error",
        text: "Candidate data is missing or incomplete.",
        icon: "error",
      });
      return;
    }

    console.log('Submitting feedback for candidate ID:', candidateData._id);

    try {
      const skillsArray = skills.map(skill => {
        const lowercaseSkill = skill && skill.toLowerCase();
        return {
          name: skill,
          rating: rating[lowercaseSkill] || 0,
          comments: formData[`${lowercaseSkill}Comments`] || "No comments",
        };
      });

      const response = await axios.put(`http://localhost:5040/feedback/${candidateData._id}`, {
        skills: skillsArray,
        status: formData.feedback,
        evaluationDetails: true,
        joiningDate: formData.joiningDate,
      });

      Swal.fire({
        title: "Feedback Submitted!",
        text: response.data.message,
        icon: "success",
      });

      navigate('/feedbacks');
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: `Error submitting feedback: ${error}`,
        icon: "error",
      });
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className='modalContent'>
      <h1>Role: {candidateData.position}</h1>
      <p>Candidate Name: {candidateData.fullName}</p>
      <p>Total Experience: {candidateData.totalExperience}</p>
      <p>Availability / Notice Period: {candidateData.noticePeriod}</p>
      <p>Panelist Name: {candidateData.panelistName}</p>
      <p>Round: {candidateData.round}</p>
      
      <div className='two-btns'>
        <Button
          onClick={() => {
            setIsFeedback(false);
          }}
          style={{ float: 'left', background: '#00B4D2' }}
          type='text'
        >
          Evaluation
        </Button>
        <Button
          onClick={() => {
            setIsFeedback(true);
          }}
          style={{ float: 'right', background: '#00B4D2', marginLeft: '180px' }}
          type='text'
        >
          Feedback
        </Button>
      </div>
          <br/>
      {candidateData.status === 'Selected' || candidateData.status === 'Rejected' ? (
        <p style={{ color: 'red', marginTop: '10px' }}>Feedback is already given</p>
      ) : null}

      {!isFeedback && (
        <table className='panelistTable'>
          <thead>
            <tr>
              <th>Skills</th>
              <th>Rating out of 5</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill, index) => (
              <tr key={index}>
                <td>{skill}</td>
                <td>
                  <Rate
                    value={rating[skill.toLowerCase()] || 0}
                    onChange={(value) => setRating({
                      ...rating,
                      [skill.toLowerCase()]: value,
                    })}
                  />
                </td>
                <td>
                  <Input
                    type='text'
                    value={formData[`${skill.toLowerCase()}Comments`] || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [`${skill.toLowerCase()}Comments`]: e.target.value,
                      })
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isFeedback && (
        <div className='panelistTable'>
          {console.log('Rendering Feedback Form')}
          <label htmlFor='feedback'>Final Feedback:</label>
          <select name='feedback' value={formData.feedback} onChange={handleChange}>
            <option value=''>Select Feedback</option>
            <option value='L2'>Shortlisted for L2</option>
            <option value='HR'>Shortlist to HR</option>
            <option value='Rejected'>Rejected</option>
            <option value='Selected'>Selected</option>
          </select>
          {auth && auth.role === 'HR' && formData.feedback === 'Selected' && (
            <div>
              <label htmlFor='joiningDate'>Joining Date:</label>
              <DatePicker
                name='joiningDate'
                value={formData.joiningDate ? moment(formData.joiningDate) : null}
                onChange={handleDateChange}
                style={{ display: 'block', width:'50%', border:'1px #00B4D2' }}
              />
            </div>
          )}
        </div>
      )}
      
      <div id='panelistbtn' onClick={handleSubmit}><Button style={{background:'#A50707'}}>Submit</Button></div>
    </div>
  );
};

export default Panelist;
