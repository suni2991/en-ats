import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Drawer, Form, Button, Select, message, DatePicker, Checkbox, Input } from 'antd';
import PanelistDropdown from './PanelistDropdown';

const { Option } = Select;
const { TextArea } = Input;

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
    },
    note: '',
  });

  const [jobData, setJobData] = useState([]);
  const [childrenDrawer, setChildrenDrawer] = useState(false);
  const [isHRRound, setIsHRRound] = useState(false);

  const fetchJobData = async () => {
    try {
      const response = await axios.get('http://localhost:5040/viewjobs');
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
        },
      };
    });
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
      },
      note: '',
    });
  };

  useEffect(() => {
    fetchJobData();

    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5040/candidate/profile/${candidateId}`);
        const data = response.data;
        if (data.status === 'SUCCESS') {
          const { fullName, position, status } = data.data;
          setCandidateData(data.data);
          setFormData((prevData) => ({
            ...prevData,
            fullName: fullName || '',
            position,
          }));
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
  }, [open, candidateId]);

  const handlePanelistSelect = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      round: {
        ...prevData.round,
        panelistName: value,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      const { round, note } = formData;
      const status = round.roundName;
      const historyNote = note || `${status} assigned to Applicant`;
      const historyUpdate = {
        updatedBy: auth.fullName,
        updatedAt: new Date(),
        note: historyNote,
      };
      const requestBody = { round, status, history: [historyUpdate] }; 
      const response = await axios.put(`http://localhost:5040/evaluate/${candidateId}`, requestBody);
      if (response.status === 200) {
        message.success('Interview assigned successfully');
        onClose();
      } else {
        throw new Error('Failed to assign interview. Please try again later.');
      }
    } catch (error) {
      console.error('Error updating interview details:', error);
      message.error(error.message || 'Failed to assign intervicew. Please try again later.');
    }
  };
  

  const showChildrenDrawer = () => {
    setChildrenDrawer(true);
  };

  const onChildrenDrawerClose = () => {
    setChildrenDrawer(false);
  };

  const getCandidateSkills = () => {
    const candidateJob = jobData.find((job) => job.position === candidateData.position);
    if (candidateJob) {
      return [...candidateJob.primarySkills, ...candidateJob.secondarySkills];
    }
    return [];
  };

  const handleRoundChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      round: { ...prevData.round, roundName: value },
    }));
    setIsHRRound(value === 'HR' && candidateData.status === 'Processing');
  };

  const handleNoteChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      note: e.target.value,
    }));
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
        <Form.Item label="Interview Date" name="interviewDate">
          <DatePicker
            onChange={(date) =>
              setFormData((prevData) => ({
                ...prevData,
                round: { ...prevData.round, interviewDate: date },
              }))
            }
            value={formData.round.interviewDate}
          />
        </Form.Item>
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
        <Button type="primary" style={{ backgroundColor: '#00B4D2', borderColor: '#fff' }} onClick={showChildrenDrawer}>
          + Skills
        </Button>
        <Drawer title="Choose Skills" width={320} closable={false} onClose={onChildrenDrawerClose} open={childrenDrawer}>
          <div>
            <h4>Select Subskills:</h4>
            {getCandidateSkills().map((subskill) => (
              <Checkbox key={subskill} onChange={(e) => handleSubskillChange(subskill, e.target.checked)}>
                {subskill}
              </Checkbox>
            ))}
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
