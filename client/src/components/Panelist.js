import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Tooltip, Button, Rate, Input, Tabs, Table, message } from 'antd';
import Swal from 'sweetalert2';
import { MdComputer, MdGraphicEq, MdGrading, MdGrade } from "react-icons/md";
import axios from 'axios';
import useAuth from '../hooks/useAuth';

const { TabPane } = Tabs;
const URL = process.env.REACT_APP_API_URL;

const Panelist = () => {
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
    comments: '',
    role: 'Applicant',
  });
  const [isFeedbackGiven, setIsFeedbackGiven] = useState(false);
  const { token } = useAuth();

  const navigateTo = useNavigate();
  const location = useLocation();
  const auth = location.state.auth;
  const candidateData = location.state.passCandidate;

  const handleBackButton = (e) => {
    // e.preventDefault();
    navigateTo("/feedbacks")
  }

  useEffect(() => {
    console.log('formData', formData);
  }, [formData])

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
      const roundNames = ['L1-HR', 'L2', 'L3', 'L4'];
      const filteredRounds = roundNames.map(roundName => {
        const latestRound = candidateData.round
          .filter(round => round.roundName === roundName)
          .sort((a, b) => new Date(b.interviewDate) - new Date(a.interviewDate))[0]; // sort by date and get latest
        console.log("Latest Round: ");
        console.log(latestRound);
        return latestRound;
      }).filter(Boolean); // Filter out undefined values
      console.log("Filtered Rounds:");
      console.log(filteredRounds);

      setRounds(filteredRounds);

      // Initialize skill ratings
      const skillsData = filteredRounds.reduce((acc, round) => {
        round.skills.forEach(skill => {
          acc[skill.name.toLowerCase()] = skill.rating;
        });
        return acc;
      }, {});
      console.log("Skills Data: ");
      console.log(skillsData);
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

  const sendRejectionEmail = async (emailDetails) => {
    try {
      await axios.post(`${URL}/api/send-rejection-email`, emailDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success('Rejection email sent successfully');
    } catch (error) {
      console.error('Error sending rejection email:', error);
      message.error('Failed to send rejection email. Please try again later.');
    }
  };

  const sendSelectionEmail = async (emailDetails) => {
    try {
      await axios.post(`${URL}/api/send-selection-email`, emailDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success('Selection email sent successfully');
    } catch (error) {
      console.error('Error sending selection email:', error);
      message.error('Failed to send selection email. Please try again later.');
    }
  };


  const sendEmail = async (emailDetails) => {
    try {
      await axios.post(`${URL}/api/panelist-feedback`, emailDetails, {
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

    // Loop through rounds
    const isInvalid = rounds.some((round) => {
      return round.skills.some((skill) => {
        if (!formData[`${skill.name.toLowerCase()}Comments`]?.trim()) {
          message.error("Comments field is required!");
          return true; // Stops execution immediately
        }

        if (!rating[skill.name.toLowerCase()]) {
          message.error("Rating out of 5 field is required!");
          return true; // Stops execution immediately
        }

        return false;
      });
    });

    if (isInvalid) {
      return; // Stop form submission if validation fails
    }

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

    // console.log('rating', rating);


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
            rating: rating[skill.name.toLowerCase()],
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
      panelistName: updatedRounds[roundIndex].panelistName, // Include panelistName
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
      const response = await axios.put(`${URL}/api/update-feedback/${candidateData._id}`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        let newStatus;
        switch (feedback) {
          case 'L1 Interview Cleared':
            newStatus = 'L1 Interview Cleared';
            break;
          case 'L2 Interview Cleared':
            newStatus = 'L2 Interview Cleared';
            break;

          case 'L1 Interview Rejected':
            newStatus = 'L1 Interview Rejected';
            break;
          case 'L2 Interview Rejected':
            newStatus = 'L2 Interview Rejected';
            break;
          case 'HR Interview Rejected':
            newStatus = 'HR Interview Rejected';
            break;
          case 'HR Interview Cleared':
            newStatus = 'HR Interview Cleared';
            break;
          case 'L3 Interview Rejected':
            newStatus = 'L3 Interview Rejected';
            break;
          case 'L3 Interview Cleared':
            newStatus = 'L3 Interview Cleared';
            break;
          case 'L3 Interview Hold':
            newStatus = 'L3 Interview Hold';
            break;

          case 'L2 Interview Hold':
            newStatus = 'L2 Interview Hold';
            break;
          case 'L1 Interview Hold':
            newStatus = 'L1 Interview Hold';
            break;
          case 'L4 Interview Rejected':
            newStatus = 'L4 Interview Rejected';
            break;
          case 'L4 Interview Cleared':
            newStatus = 'L4 Interview Cleared';
            break;
          case 'L4 Interview Hold':
            newStatus = 'L4 Interview Hold';
            break;
          default:
            newStatus = 'Processing';
        }

        const historyUpdate = {
          status: newStatus,
          updatedBy: auth.fullName,
          updatedAt: new Date(),
          note: `Status updated to ${newStatus} based on ${feedback} feedback.`
        };

        const statusUpdate = {
          status: newStatus,
          requestBody: requestBody,
          historyUpdate: historyUpdate
        };

        // Update candidate status
        await axios.put(`${URL}/api/candidates/${candidateData._id}`, statusUpdate, {
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
          hrName: candidateData.mgrName,
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
          // onClose();  // Close the modal
        });

        if (feedback.includes('Rejected')) {
          // Send Rejection email if the feedback includes 'Rejected'
          await sendRejectionEmail(emailDetails);
        } else if (feedback.includes('Cleared')) {
          // Send Selection email if the feedback includes 'Cleared'
          await sendSelectionEmail(emailDetails);
        }
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
          <strong>
            <p style={{ fontWeight: 'bold', fontSize: 18, color: '#00B4D2' }}>Candidate Name: {candidateData.fullName} for the role {candidateData.position}</p><br />
            <p style={{ fontWeight: 'bold', fontSize: 16 }}>Total Experience: {candidateData.totalExperience}</p>
            <p style={{ fontWeight: 'bold', fontSize: 16 }}>Availability / Notice Period: {candidateData.noticePeriod}</p><br />
          </strong>
        </>
      )}
      <Tabs style={{ backgroundColor: 'white', padding: '10px', borderRadius: '8px' }}>
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
            {/* <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center", justifyContent: 'space-between' }}> */}
            <p style={{ fontWeight: 'bold', fontSize: 14 }}>Interviewed by {round.panelistName} on {new Date(round.interviewDate).toLocaleDateString()}</p>

            {
              round.feedbackProvided && (
                <p style={{ color: 'red', fontWeight: 'bold', fontSize: 14 }}>Feedback is already given for this round</p>
              )
            }
            <p style={{ fontWeight: 'bold', fontSize: 14 }}> Feedback Provided: {round.feedbackProvided ? 'Yes' : 'Not yet'}</p>
            <br />

            <table className='panelistTable'>
              <thead>
                <tr>
                  <th>Questions</th>
                  <th>Rating out of 5<span style={{ color: 'red' }}> *</span></th>
                  <th>Comments<span style={{ color: 'red' }}> *</span></th>
                  {/* <th>Extra Comments</th> */}
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
                    {/* <td>
                      <Input.TextArea
                        name = {`${skill.name.toLowerCase()}panelistFeedback`}
                        // name = {skill.panelistFeedback}
                        // value = {skill.panelistFeedback}
                        value={formData[`${skill.name.toLowerCase()}panelistFeedback`] || (skill.panelistFeedback && skill.panelistFeedback !== 'No Feedback' ? skill.panelistFeedback : '')}
                        onChange={(e) => {
                          console.log('skill.name', skill.name.slice(0, 19));
                          console.log('e.target.name', e.target.name);  
                          console.log('e.target.value', e.target.value);
                          
                          // setFormData({
                          //     ...formData,
                          //     [e.target.name]: e.target.value,
                          //   })

                          setFormData({
                            ...formData,
                            [`${skill.name.toLowerCase()}panelistFeedback`]: e.target.value,
                          })
                        }
                        }
                        disabled={round.feedbackProvided || index !== rounds.length - 1}
                        required
                      />
                    </td> */}
                    <td>
                      <Input.TextArea
                        required={true}
                        value={formData[`${skill.name.toLowerCase()}Comments`] || (skill.comments && skill.comments !== 'No comments' ? skill.comments : '')}
                        onChange={(e) => {

                          console.log('e.target.valuecomments', e.target.value);

                          setFormData({
                            ...formData,
                            [`${skill.name.toLowerCase()}Comments`]: e.target.value,
                          })
                        }}
                        disabled={round.feedbackProvided || index !== rounds.length - 1}
                      />
                    </td>
                    {/* <td>
                      <Input.TextArea
                        value={formData[`${skill.name.toLowerCase()}extraComments`] || (skill.extraComments && skill.extraComments !== 'No comments' ? skill.extraComments : '')}
                        onChange={(e) => {

                          console.log('e.target.valueExtraComments', e.target.value);

                          setFormData({
                            ...formData,
                            [`${skill.name.toLowerCase()}extraComments`]: e.target.value,
                          })
                        }
                        }
                        disabled={round.feedbackProvided || index !== rounds.length - 1}
                      />
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>

            {index === rounds.length - 1 && !round.feedbackProvided && (
              <div className='panelistTable'>
                <label htmlFor='extraComments'>Extra Comments:</label>
                <Input.TextArea name='extraComments' value={formData.extraComments} onChange={handleChange}/>
                <label htmlFor='feedback'>Final Feedback:</label>
                <select name='feedback' value={formData.feedback} onChange={handleChange}>
                  <option value=''>Select Feedback</option>
                  {round.roundName === 'L1' && (
                    <>
                      <option value='L1 Interview Cleared'>L1 Interview Cleared</option>
                      <option value='L1 Interview Rejected'>L1 Interview Rejected</option>
                      <option value='L1 Interview Hold'>L1 Interview Hold</option>

                    </>
                  )}
                  {round.roundName === 'L2' && (
                    <>
                      <option value='L2 Interview Cleared'>L2 Interview Cleared</option>
                      <option value='L2 Interview Rejected'>L2 Interview Rejected</option>
                      <option value='L2 Interview Hold'>L2 Interview Hold</option>
                    </>
                  )}
                  {round.roundName === 'L3' && (
                    <>
                      <option value='L3 Interview Cleared'>L3 Interview Cleared</option>
                      <option value='L3 Interview Rejected'>L3 Interview Rejected</option>
                      <option value='L3 Interview Hold'>L3 Interview Hold</option>
                    </>
                  )}
                  {round.roundName === 'L4' && (
                    <>
                      <option value='L4 Interview Cleared'>L4 Interview Cleared</option>
                      <option value='L4 Interview Rejected'>L4 Interview Rejected</option>
                      <option value='L4 Interview Hold'>L4 Interview Hold</option>
                    </>
                  )}
                </select>
              </div>
            )}

            {index === rounds.length - 1 && !round.feedbackProvided && (
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <div id='panelistbtn' onClick={handleBackButton}>
                  <center><Button type='button' style={{ background: '#A50707' }} className='add-button'>Back</Button></center>
                </div>
                <div id='panelistbtn' onClick={handleSubmit}>
                  <center><Button style={{ background: '#1677ff', marginLeft: 30 }} className='add-button'>Submit</Button></center>
                </div>
              </div>
            )}
          </TabPane>
        ))
        }
      </Tabs >
    </div >
  );
};

export default Panelist;
