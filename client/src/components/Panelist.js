import React, { useState, useEffect } from 'react';
import { Button, Rate, Input, Tabs, Table,message } from 'antd';
import Swal from 'sweetalert2';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

const { TabPane } = Tabs;
const URL = process.env.REACT_APP_API_URL;

const Panelist = ({ candidateData, auth, onClose }) => {
  const [rounds, setRounds] = useState([]);
  const [rating, setRating] = useState({});
  const [categoryScores, setCategoryScores] = useState([]);
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
  const { token } = useAuth();

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
  
      // Get the latest round for each of L1, L2, and HR
      const roundNames = ['L1', 'L2', 'HR'];
      const filteredRounds = roundNames.map(roundName => {
        const latestRound = candidateData.round
          .filter(round => round.roundName === roundName)
          .sort((a, b) => new Date(b.interviewDate) - new Date(a.interviewDate))[0]; // sort by date and get latest
        return latestRound;
      }).filter(Boolean); // Filter out undefined values
  
      setRounds(filteredRounds);
  
      // Initialize skill ratings
      const skillsData = filteredRounds.reduce((acc, round) => {
        round.skills.forEach(skill => {
          acc[skill.name.toLowerCase()] = skill.rating;
        });
        return acc;
      }, {});
      setRating(skillsData);
  
      // Check if feedback is already given for all rounds
      if (candidateData.status === 'Selected' || candidateData.status === 'Rejected' || filteredRounds.some(round => round.feedbackProvided)) {
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

  const sendEmail = async (emailDetails) => {
    try {
      await axios.post(`${URL}/panelist-feedback`, emailDetails, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });
      message.success('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      message.error('Failed to send email. Please try again later.');
    }
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
          panelistName: panelistName || auth.fullName,
          interviewDate: round.interviewDate || new Date(), // Include interview date
          skills: round.skills.map(skill => ({
            ...skill,
            rating: rating[skill.name.toLowerCase()] || 0,
            comments: formData[`${skill.name.toLowerCase()}Comments`] || skill.comments,
          })),
          feedback: feedback // Include feedback
        };
      }
      return round;
    });
  
    const roundIndex = rounds.length - 1;
    const requestBody = {
      roundIndex: roundIndex,
      feedback: updatedRounds[roundIndex].feedback, // Ensure feedback is included
      feedbackProvided: updatedRounds[roundIndex].feedbackProvided, // Ensure feedbackProvided is included
      roundDetails: {
        roundName: updatedRounds[roundIndex].roundName,
        panelistName: updatedRounds[roundIndex].panelistName,
        interviewDate: updatedRounds[roundIndex].interviewDate,
        feedback: updatedRounds[roundIndex].feedback,
        feedbackProvided: updatedRounds[roundIndex].feedbackProvided,
        skills: updatedRounds[roundIndex].skills, // Include updated skills with ratings and comments
      },
    };
  
    try {
      // Update feedback and round details
      const response = await axios.put(`${URL}/update-feedback/${candidateData._id}`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
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
  
        // Update candidate status
        await axios.put(`${URL}/candidates/${candidateData._id}`, statusUpdate, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        // Create emailDetails for sending feedback details to HR
        const emailDetails = {
          candidateName: candidateData.fullName,
          candidateEmail: candidateData.email,
          candidatePosition: candidateData.position,
          panelistName: formData.panelistName || auth.fullName,
          feedback: formData.feedback,
          roundName: updatedRounds[roundIndex].roundName,
          interviewDate: updatedRounds[roundIndex].interviewDate,
          skills: updatedRounds[roundIndex].skills.map(skill => ({
            name: skill.name,
            rating: skill.rating,
            comments: skill.comments || ''
          })),
          postedBy: auth.fullName,
          hrEmail: candidateData.mgrEmail,
          hrName : candidateData.mgrName,
          status: newStatus,
        };
  
        Swal.fire({
          title: "Success",
          text: "Interview feedback updated successfully.",
          icon: "success",
          confirmButtonText: "OK"
        }).then(() => {
          setIsFeedbackGiven(true);
          sendEmail(emailDetails);  // Send the email with feedback details
          onClose();  // Close the modal
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

  const scoreData = candidateData.selectedCategory === "Technical" ? [
    { name: 'Psychometric', score: candidateData.psychometric === -1 ? 0 : candidateData.psychometric },
    { name: 'Java', score: candidateData.java === -1 ? 0 : candidateData.java },
    { name: 'Quantitative Aptitude', score: candidateData.quantitative === -1 ? 0 : candidateData.quantitative },
    { name: 'Vocabulary', score: candidateData.vocabulary === -1 ? 0 : candidateData.vocabulary },
  ] : [
    { name: 'Psychometric', score: candidateData.psychometric === -1 ? 0 : candidateData.psychometric },
    { name: 'Excel', score: candidateData.excel === -1 ? 0 : candidateData.excel },
    { name: 'Accounts', score: candidateData.accounts === -1 ? 0 : candidateData.accounts },
    { name: 'Vocabulary', score: candidateData.vocabulary === -1 ? 0 : candidateData.vocabulary },
  ];
  
  const scoreColumns = [
    {
      title: 'Test Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
    },
  ];
  

  return (
    <div className='modalContent'>
      {candidateData && (
        <>
          <p style={{ fontWeight: 'bold', color: '#00B4D2' }}>Candidate Name: {candidateData.fullName} for the role {candidateData.position}</p>
          <p>Total Experience: {candidateData.totalExperience}</p>
          <p>Availability / Notice Period: {candidateData.noticePeriod}</p>
        </>
      )}
      <Tabs>
       <TabPane tab="Scores" key="scores">
          <Table
            columns={scoreColumns}
            dataSource={scoreData}
            pagination={false}
            rowKey="name"
          />
        </TabPane>
        {rounds.map((round, index) => (
          <TabPane tab={round.roundName} key={index}>
            <p>Interviewed by {round.panelistName} on {new Date(round.interviewDate).toLocaleDateString()}</p>

            {round.feedbackProvided && (
              <p style={{ color: 'red', marginTop: '10px' }}>Feedback is already given for this round</p>
            )}

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
                        disabled={round.feedbackProvided || index !== rounds.length - 1}
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
                        disabled={round.feedbackProvided || index !== rounds.length - 1}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {index === rounds.length - 1 && !round.feedbackProvided && (
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

            {index === rounds.length - 1 && !round.feedbackProvided && (
              <div id='panelistbtn' onClick={handleSubmit}>
                <center><Button style={{ background: '#A50707' }} className='add-button'>Submit</Button></center>
              </div>
            )}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default Panelist;
