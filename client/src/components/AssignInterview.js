


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Drawer, Form, Button, Select, message, DatePicker,Modal, Radio, Input, Checkbox } from 'antd'; // Added Checkbox import
import PanelistDropdown from './PanelistDropdown';
import useAuth from '../hooks/useAuth';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;
const URL = process.env.REACT_APP_API_URL;

const AssignInterview = ({ open, onClose, candidateId, auth }) => {
  const defaultSkills = ['Communication', 'Teamwork', 'Problem Solving']; // Default static skills
  const [candidateData, setCandidateData] = useState({});
  const [formData, setFormData] = useState({
    round: {
      roundName: 'L1',
      panelistName: '',
      interviewDate: null,
      feedbackProvided: false,
      skills: [...defaultSkills.map(skill => ({ name: skill, rating: 0, comments: 'No comments' }))], // Initialize with default skills
      bookedSlot: '', // To store selected slot
    },
    note: '',
    
  });
  const [jobData, setJobData] = useState([]);
  const [childrenDrawer, setChildrenDrawer] = useState(false);
  const [isHRRound, setIsHRRound] = useState(false);
  const [isSkillsDrawerOpen, setIsSkillsDrawerOpen] = useState(false); // Separate state for skills drawer
  const [isSlotsDrawerOpen, setIsSlotsDrawerOpen] = useState(false);
  const [panelistSlots, setPanelistSlots] = useState([]);
  const [panelistEmail, setPanelistEmail] = useState([]) // To store panelist slots
  const { token } = useAuth();

  const fetchJobData = async () => {
    try {
      const response = await axios.get(`${URL}/viewjobs`);
      setJobData(response.data);
    } catch (error) {
      console.error('Error fetching job data:', error);
    }
  };

  const handleSubskillChange = (subskill, checked) => {
    setFormData((prevData) => {
      const updatedSkills = checked
        ? [...prevData.round.skills, { name: subskill, rating: 0, comments: 'No comments' }]
        : prevData.round.skills.filter((skill) => skill.name !== subskill);
      
      // Ensure default skills are always included
      const skillsWithDefaults = [...new Set([...defaultSkills, ...updatedSkills.map(skill => skill.name)])]
        .map(name => updatedSkills.find(skill => skill.name === name) || { name, rating: 0, comments: 'No comments' });
      
      return {
        ...prevData,
        round: {
          ...prevData.round,
          skills: skillsWithDefaults,
        }
      }});
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${URL}/candidate/profile/${candidateId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const data = response.data;
          if (data.status === 'SUCCESS') {
            const { fullName, position, status, rounds } = data.data;
            setCandidateData(data.data);
            setFormData((prevData) => ({
              ...prevData,
              fullName: fullName || '',
              position,
            }));
    
            // Check if any round is already assigned
            if (rounds && rounds.length > 0) {
              const assignedRounds = rounds.map(round => round.roundName);
              setAssignedRounds(assignedRounds); // Store the assigned rounds
            }
          } else {
            console.error('Failed to fetch candidate data:', data.message);
          }
        } catch (error) {
          console.error('Error fetching candidate data:', error);
        }
      };
    
      if (open && candidateId) {
        fetchData();
      }
    }, [open, candidateId, token]);

    const [assignedRounds, setAssignedRounds] = useState([]);


    const handleRoundChange = (value) => {
      // Ensure candidateData is available and rounds exist
      if (candidateData && Array.isArray(candidateData.round)) {
        const roundAlreadyAssigned = candidateData.round.find((round) => round.roundName === value);
    
        if (roundAlreadyAssigned) {
          // Show confirmation modal with round and panelist details
          Modal.confirm({
            title: 'Round Already Assigned',
            content: `${value} is already assigned with ${roundAlreadyAssigned.panelistName}. Do you want to reassign it to someone else?`,
            onOk: () => {
              console.log('Proceeding to reassign the round...');
              // Allow round reassignment
              setFormData((prevData) => ({
                ...prevData,
                round: { ...prevData.round, roundName: value },
              }));
              setIsHRRound(value === 'HR'); // Check if HR round is selected
            },
            onCancel() {
              console.log('Round assignment canceled');
              handleDrawerClose();
              // Optionally reset the roundName if the user cancels
              setFormData((prevData) => ({
                ...prevData,
                round: { ...prevData.round, roundName: 'L1' }, // Reset to a default value or previous round
              }));
            },
            okButtonProps: {
              style: { backgroundColor: '#00B4D2', borderColor: '#52c41a', color: 'white' }, // Custom OK button color
            },
            cancelButtonProps: {
              style: { backgroundColor: '#f5222d', borderColor: '#f5222d', color: 'white' }, // Custom Cancel button color
            },
          });
        } else {
          // No conflict, proceed as usual
          setFormData((prevData) => ({
            ...prevData,
            round: { ...prevData.round, roundName: value },
          }));
          setIsHRRound(value === 'HR'); // Check if HR round is selected
        }
      } else {
        console.error("Rounds data is not available or not an array");
        // Optionally, handle the case when rounds are not loaded
        Modal.error({
          title: 'Error',
          content: 'Rounds data is not available. Please try again later.',
        });
      }
    };
    
    
    


  const handleDrawerClose = () => {
    onClose();
    setFormData({
      round: {
        roundName: 'L1',
        panelistName: '',
        interviewDate: null,
        feedbackProvided: false,
        skills: [...defaultSkills.map(skill => ({ name: skill, rating: 0, comments: 'No comments' }))], // Reset with default skills
        bookedSlot: '', // Reset booked slot
      },
      note: '',
    });
  };

  const fetchPanelistSlots = async (panelistName) => {
    try {
      const response = await axios.get(`${URL}/panelists/enfusian`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const panelist = response.data.find(p => p.fullName === panelistName);
      if (panelist) {
        setPanelistSlots(panelist.availableSlots);
        setPanelistEmail(panelist.email)
      }
    } catch (error) {
      console.error('Error fetching panelist slots:', error);
      message.error('Failed to fetch panelist slots. Please try again later.');
    }
  };

  const handlePanelistSelect = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      round: {
        ...prevData.round,
        panelistName: value,
      },
    }));
    fetchPanelistSlots(value);
    setChildrenDrawer(true);
  };

  const handleSlotSelect = (slot) => { 
    // Format the date as "On 13th, September, 2024"
    const formattedDate = `On ${moment(slot.date).format('Do, MMMM, YYYY')}`;
  
    // Format the slot time as "3:00 PM - 4:00 PM"
    const formattedSlot = `from ${moment(slot.fromTime).format('h:mm A')} - ${moment(slot.toTime).format('h:mm A')}`;
    
    // Combine the formatted date and time
    const formattedInterviewDetails = `${formattedDate} ${formattedSlot}`;
  
    // Update the formData to include the formatted slot and interview details
    setFormData((prevData) => ({
      ...prevData,
      round: {
        ...prevData.round,
        bookedSlot: slot, // Store the actual slot object
        interviewDt: formattedInterviewDetails, // Store the formatted string for display
      },
    }));
  };
  
  
const sendEmailToPanelist = async (emailDetails) => {
    try {
      await axios.post(`${URL}/interview-slot-booked`, emailDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success('Email sent successfully to Panelist');
    } catch (error) {
      console.error('Error sending email:', error);
      message.error('Failed to send email. Please try again later.');
    }
  };

  const sendEmailToCandidate = async (emailDetails) => {
    try {
      await axios.post(`${URL}/interview-scheduled`, emailDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success('Email sent successfully to Candidate');
    } catch (error) {
      console.error('Error sending email:', error);
      message.error('Failed to send email. Please try again later.');
    }
  };
  
  const handleSubmit = async () => {
    try {
      const { round, note } = formData;
      const status = round.roundName;
      const panelistName = round.panelistName;
      const historyNote = note || `${status} assigned to Applicant and the panelist is ${panelistName}`;
      const historyUpdate = {
        updatedBy: auth.fullName,
        updatedAt: new Date(),
        note: historyNote,
      };
  
      const requestBody = { 
        round, 
        status, 
        history: [historyUpdate], 
      };
  
      // First, update the candidate details
      const candidateResponse = await axios.put(`${URL}/evaluate/${candidateId}`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // If candidate details update is successful, book the slot
      if (candidateResponse.status === 200) {
        // Book the slot
        await axios.put(`${URL}/panelists/slot/${panelistEmail}`, {
          slotId: formData.round.bookedSlot._id,  // Pass the slot ID
          booked: true
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
  
        message.success('Interview assigned and slot booked successfully');
        onClose();
  
        // Prepare email details with slot timings
        const emailDetails = {
          candidateName: candidateData.fullName,
          candidateEmail: candidateData.email,
          candidatePosition: candidateData.position,
          panelistName: round.panelistName,
          panelistEmail: panelistEmail,
          roundName: round.roundName,
         interviewDt: formData.round.interviewDt,
          postedBy: auth.fullName,
          hrEmail: auth.email,
        };
  
        // Send email to both panelist and candidate
        sendEmailToPanelist(emailDetails);
        sendEmailToCandidate(emailDetails);
      } else {
        throw new Error('Failed to assign interview. Please try again later.');
      }
    } catch (error) {
      console.error('Error updating interview details:', error);
      message.error(error.message || 'Failed to assign interview. Please try again later.');
    }
  };
  


  const handleNoteChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      note: e.target.value,
    }));
  };

  const showChildrenDrawer = () => {
    setChildrenDrawer(true);
  };

  const onChildrenDrawerClose = () => {
    setChildrenDrawer(false);
  };

  const showSkillsDrawer = () => {
    setIsSkillsDrawerOpen(true); // Open the skills drawer
  };

  const onSkillsDrawerClose = () => {
    setIsSkillsDrawerOpen(false); // Close the skills drawer
  };

  const getCandidateSkills = () => {
    const candidateJob = jobData.find((job) => job.position === candidateData.position);
    if (candidateJob) {
      return [...candidateJob.primarySkills, ...candidateJob.secondarySkills];
    }
    return [];
  };

  return (
    <Drawer title="Assign Interview" open={open} onClose={handleDrawerClose} width={600}>
      <div>
        <h1>Full Name: {candidateData.fullName}</h1>
        <h2>Position: {candidateData.position}</h2>
      </div>
      <br/>
      <br/>
      <Form layout="vertical" onFinish={handleSubmit}>
        <PanelistDropdown onSelect={handlePanelistSelect} />
        <Form.Item label="Round" name="round">
          <Select onChange={handleRoundChange} value={formData.round.roundName}>
            <Option value="L1">L1 Round</Option>
            <Option value="L2">L2 Round</Option>
            <Option value="HR">HR Round</Option>
          </Select>
        </Form.Item>
      
      {formData.round.bookedSlot && (
        <Form.Item label="Selected Slot as Interview Date">
          <Input value={moment(formData.round.bookedSlot).format('MMMM Do YYYY, h:mm:ss a')} disabled />
        </Form.Item>
      )}
        {isHRRound && (
          <Form.Item label="Note" name="note">
            <TextArea
              onChange={handleNoteChange}
              value={formData.note}
              placeholder="Enter note for assigning HR round. Mention if the Applicant is referred by any Enfusian"
            />
          </Form.Item>
        )}
        <Button type="primary" style={{ backgroundColor: '#00B4D2', borderColor: '#fff' }} htmlType="submit">
          Assign Interview
        </Button>
        <Button type="primary" style={{ backgroundColor: '#00B4D2', borderColor: '#fff' }} onClick={showSkillsDrawer}>
          + Skills
        </Button>
        <Drawer title="Choose Skills" width={320} closable={false} onClose={onSkillsDrawerClose} open={isSkillsDrawerOpen}>
        <div>
          <h4>Select Subskills:</h4>
          {getCandidateSkills().map((subskill) => (
            <Checkbox key={subskill} onChange={(e) => handleSubskillChange(subskill, e.target.checked)}>
              {subskill}
            </Checkbox>
          ))}
        </div>
        <div style={{ marginTop: 16 }}>
          <Button type="primary" style={{ background: '#00B4D2' }} onClick={onSkillsDrawerClose}>
            Submit
          </Button>
        </div>
      </Drawer>
      <Drawer title="Select Slot" width={350} closable={false} onClose={onChildrenDrawerClose} open={childrenDrawer}>
      <div>
        <h4>Select an Available Slot:</h4>
        <Radio.Group value={formData.round.bookedSlot} onChange={(e) => handleSlotSelect(e.target.value)}>
        {panelistSlots
          .filter(slot => !slot.booked) // Filter out already booked slots
          .slice(0, 6) // Limit to the first 6 available slots
          .map((slot) => (
            <Radio.Button key={slot._id} value={slot}>
              {moment(slot.fromTime).format('MMMM Do YYYY, h:mm a')} - {moment(slot.toTime).format('h:mm a')}
            </Radio.Button>
          ))}
      </Radio.Group>
      </div>
      <div style={{ marginTop: 16 }}>
        <Button type="primary" style={{background:'#00B4D2'}} onClick={onChildrenDrawerClose}>
          Submit
        </Button>
      </div>
    </Drawer>
    
      </Form>
    </Drawer>
  );

};
export default AssignInterview;
