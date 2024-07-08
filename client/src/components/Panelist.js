import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Rate, Input, Tabs } from 'antd';

const { TabPane } = Tabs;

const Panelist = ({ candidateData }) => {
  const navigate = useNavigate();
  const [rounds, setRounds] = useState([]);
  const [rating, setRating] = useState({});
  const [formData, setFormData] = useState({
    position: '',
    fullName: '',
    totalExperience: '',
    noticePeriod: '',
    panelistName: '',
    feedback: '',
    role: 'Applicant', // Set default role as 'Applicant'
  });
  const [isFeedback, setIsFeedback] = useState(false);

  useEffect(() => {
    if (candidateData) {
      setFormData((prevData) => ({
        ...prevData,
        position: candidateData.position || '',
        fullName: candidateData.fullName || '',
        totalExperience: candidateData.totalExperience || '',
        noticePeriod: candidateData.noticePeriod || '',
        panelistName: candidateData.panelistName || '',
        feedback: '',
      }));

      setRounds(candidateData.round || []);
      const skillsData = candidateData.round.reduce((acc, round) => {
        round.skills.forEach(skill => {
          acc[skill.name.toLowerCase()] = skill.rating;
        });
        return acc;
      }, {});
      setRating(skillsData);
    }
  }, [candidateData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
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
  
    try {
      // Prepare updated round data
      const updatedRounds = rounds.map(round => ({
        ...round,
        skills: round.skills.map(skill => ({
          ...skill,
          rating: rating[skill.name.toLowerCase()] || 0,
          comments: formData[`${skill.name.toLowerCase()}Comments`] || "",
        })),
      }));
  
      // Update candidate data
      const response = await axios.put(`http://localhost:5040/evaluate/${candidateData._id}`, {
        round: updatedRounds,
        status: formData.feedback,
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
    {candidateData && (
      <><p style={{ fontWeight: 'bold', color: '#00B4D2' }}>Candidate Name: {candidateData.fullName} for the role {candidateData.position}</p>
        <p>Total Experience: {candidateData.totalExperience}</p>
        <p>Availability / Notice Period: {candidateData.noticePeriod}</p>
        
        
        {candidateData.status === 'Selected' || candidateData.status === 'Rejected' ? (
          <p style={{ color: 'red', marginTop: '10px' }}>Feedback is already given</p>
        ) : null}
      </>
    )}

    <Tabs>
      {candidateData.round.map((round, index) => (
        <TabPane tab={round.roundName} key={index}>
          <p>Interviewed by {round.panelistName} on {new Date(round.interviewDate).toLocaleDateString()}</p>
        
          <p>Feedback Provided: {round.feedbackProvided ? 'Yes' : 'Not yet'}</p>

          <table className='panelistTable'>
            <thead>
              <tr>
                <th>Skills</th>
                <th>Rating out of 5</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {round.skills.map((skill, idx) => (
                <tr key={idx}>
                  <td>{skill.name}</td>
                  <td>
                    <Rate
                      value={rating[skill.name.toLowerCase()] || 0}
                      onChange={(value) => setRating({
                        ...rating,
                        [skill.name.toLowerCase()]: value,
                      })}
                    />
                  </td>
                  <td>
                    <Input.TextArea
                      value={formData[`${skill.name.toLowerCase()}Comments`] || skill.comments}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [`${skill.name.toLowerCase()}Comments`]: e.target.value,
                        })
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className='panelistTable'>
            <label htmlFor='feedback'>Final Feedback:</label>
            <select name='feedback' value={formData.feedback} onChange={handleChange}>
              <option value=''>Select Feedback</option>
              <option value='L2'>Shortlisted for L2</option>
              <option value='HR'>Shortlist to HR</option>
              <option value='Rejected'>Rejected</option>
              <option value='Selected'>Selected</option>
            </select>
          </div>
        </TabPane>
      ))}
    </Tabs>

    <div id='panelistbtn' onClick={handleSubmit}>
      <center><Button style={{ background: '#A50707' }} className='add-button'>Submit</Button></center>
    </div>
  </div>
  );
};

export default Panelist;
