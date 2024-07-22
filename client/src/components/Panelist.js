import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

import { Button, Rate, Input, Tabs } from 'antd';
import useAuth from '../hooks/useAuth';

const { TabPane } = Tabs;

const Panelist = ({ candidateData, auth }) => {

  const [rounds, setRounds] = useState([]);
  const [rating, setRating] = useState({});
  const [formData, setFormData] = useState({
    position: '',
    fullName: '',
    totalExperience: '',
    noticePeriod: '',
    panelistName: '',
    feedback: '',
    role: 'Applicant', 
  });
  const [isFeedbackGiven, setIsFeedbackGiven] = useState(false);
  const {token} = useAuth();

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

      if (candidateData.status === 'Selected' || candidateData.status === 'Rejected' || candidateData.round.some(round => round.feedbackProvided)) {
        setIsFeedbackGiven(true);
      }
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
        text: "Candidate data is not available.",
        icon: "error",
        confirmButtonText: "OK"
      });
      return;
    }

    const { feedback, panelistName } = formData;

    if (!feedback) {
      Swal.fire({
        title: "Error",
        text: "Feedback is required.",
        icon: "error",
        confirmButtonText: "OK"
      });
      return;
    }

    const updatedRounds = rounds.map((round, index) => {
      if (index === rounds.length - 1) { 
        return {
          ...round,
          feedbackProvided: true,
          panelistName: panelistName,
          skills: round.skills.map(skill => ({
            ...skill,
            rating: rating[skill.name.toLowerCase()] || 0,
            comments: formData[`${skill.name.toLowerCase()}Comments`] || skill.comments,
          })),
        };
      }
      return round;
    });

    const roundIndex = rounds.length - 1; 
    const requestBody = {
      roundIndex: roundIndex,
      feedback: feedback,
      feedbackProvided: true,
      skills: updatedRounds[roundIndex].skills,
    };

    try {
      
      const response = await axios.put(`http://localhost:5040/update-feedback/${candidateData._id}`, requestBody,
        {
          headers:{
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {

        let newStatus;
        switch (feedback) {
          case 'L2':
            newStatus = 'Shortlisted for L2';
            break;
          case 'HR':
            newStatus = 'Shortlist to HR';
            break;
          case 'Rejected':
            newStatus = 'Rejected';
            break;
          case 'Selected':
            newStatus = 'Selected';
            break;
          default:
            newStatus = 'Processing';
        }

        const historyUpdate = {
          updatedBy: auth.fullName,
          updatedAt: new Date(),
          note: `Status updated to ${newStatus} based on ${feedback} feedback.`
        };

        const statusUpdate = {
          status: newStatus,
          historyUpdate: historyUpdate
        };

        await axios.put(`http://localhost:5040/candidates/${candidateData._id}`, statusUpdate);

        
        Swal.fire({
          title: "Success",
          text: "Interview feedback updated successfully.",
          icon: "success",
          confirmButtonText: "OK"
        }).then(() => {
          
          setIsFeedbackGiven(true); 
        });
      } else {
        throw new Error("Failed to update feedback. Please try again later.");
      }
    } catch (error) {
      console.error("Error updating feedback:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to update feedback. Please try again later.",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  const handleRateChange = (value, name) => {
    setRating((prevRating) => ({
      ...prevRating,
      [name.toLowerCase()]: value
    }));
  };

  return (
    <div className='modalContent'>
      {candidateData && (
        <>
          <p style={{ fontWeight: 'bold', color: '#00B4D2' }}>Candidate Name: {candidateData.fullName} for the role {candidateData.position}</p>
          <p>Total Experience: {candidateData.totalExperience}</p>
          <p>Availability / Notice Period: {candidateData.noticePeriod}</p>

          {isFeedbackGiven && (
            <p style={{ color: 'red', marginTop: '10px' }}>Feedback is already given</p>
          )}
        </>
      )}

      <Tabs>
        {rounds.map((round, index) => (
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
                        onChange={(value) => handleRateChange(value, skill.name)}
                        disabled={index !== rounds.length - 1 || isFeedbackGiven}
                      />
                    </td>
                    <td>
                      <Input.TextArea
                        value={formData[`${skill.name.toLowerCase()}Comments`] || (skill.comments && skill.comments !== 'No comments' ? skill.comments : '')}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [`${skill.name.toLowerCase()}Comments`]: e.target.value,
                          })
                        }
                        disabled={index !== rounds.length - 1 || isFeedbackGiven}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {index === rounds.length - 1 && !isFeedbackGiven && (
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
            )}
          </TabPane>
        ))}
      </Tabs>

      {rounds.length > 0 && !isFeedbackGiven && (
        <div id='panelistbtn' onClick={handleSubmit}>
          <center><Button style={{ background: '#A50707' }} className='add-button'>Submit</Button></center>
        </div>
      )}
    </div>
  );
};

export default Panelist;
