import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Drawer, Form, Button, Select, message, DatePicker, Checkbox } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'; // Import the icons
import PanelistDropdown from './PanelistDropdown';

const { Option } = Select;

const AssignInterview = ({ open, onClose, candidateId }) => {
  const [candidateData, setCandidateData] = useState({});
  const [formData, setFormData] = useState({
    round: {
      roundName: 'L1',
      panelistName: '',
      interviewDate: null,
      feedbackProvided: false,
      skills: [],
    },
  });

  const [jobData, setJobData] = useState([]);
  const [childrenDrawer, setChildrenDrawer] = useState(false);

  const fetchJobData = async () => {
    try {
      const response = await axios.get('http://localhost:5040/viewjobs');
      setJobData(response.data);
    } catch (error) {
      console.error('Error fetching job data:', error);
    }
  };

  const handleSubskillChange = (subskill, checked) => {
    if (checked) {
      setFormData((prevData) => ({
        ...prevData,
        round: {
          ...prevData.round,
          skills: [...prevData.round.skills, { name: subskill, rating: 0, comments: 'No comments' }],
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        round: {
          ...prevData.round,
          skills: prevData.round.skills.filter((skill) => skill.name !== subskill),
        },
      }));
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
        skills: [],
      },
    });
  };

  useEffect(() => {
    fetchJobData();

    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5040/candidate/profile/${candidateId}`);
        const data = response.data;
        if (data.status === 'SUCCESS') {
          const { fullName, position } = data.data;
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
      const { round } = formData;
      const status = round.roundName;

      const requestBody = {
        round,
        status,
      };

      const response = await axios.put(`http://localhost:5040/evaluate/${candidateId}`, requestBody);

      if (response.status === 200) {
        message.success('Interview assigned successfully.');
        onClose();
      } else {
        throw new Error('Failed to assign interview. Please try again later.');
      }
    } catch (error) {
      console.error('Error updating interview details:', error);
      message.error(error.message || 'Failed to assign interview. Please try again later.');
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

  return (
    <Drawer title="Assign Interview" open={open} onClose={handleDrawerClose} width={600}>
      <div>
        <h1>Full Name: {candidateData.fullName}</h1>
        <h2>Position: {candidateData.position}</h2>
      </div>
      <Form layout="vertical" onFinish={handleSubmit}>
        <PanelistDropdown onSelect={handlePanelistSelect} />
        <Form.Item label="Round" name="round">
          <Select
            onChange={(value) =>
              setFormData((prevData) => ({
                ...prevData,
                round: { ...prevData.round, roundName: value },
              }))
            }
            value={formData.round.roundName}
          >
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
          <div style={{ marginTop: 20 }}>
            <Button type="primary" style={{ backgroundColor: '#00B4D2', borderColor: '#fff' }} onClick={onChildrenDrawerClose}>
              Ok
            </Button>
          </div>
        </Drawer>
      </Form>
    </Drawer>
  );
};

export default AssignInterview;
