import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Drawer, Form, Input, Button, Checkbox, DatePicker, Select, message } from 'antd';

const { Option } = Select;

const AssignInterview = ({ visible, onClose, candidateId }) => {
  const [candidateData, setCandidateData] = useState({});
  const [formData, setFormData] = useState({
    position: '',
    fullName: '',
    panelistName: '',
    round: 'L1',
    meetingDate: null,
    meetingURL: '',
    skills: [], // Add a skills array to formData
  });

  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedSubskills, setSelectedSubskills] = useState([]);

  const positions = [
    { name: 'AEM Developer', subskills: ['AEM', 'AEM as Cloud', 'Static Editable Template'] },
    { name: 'Java Developer', subskills: ['Servlet Services', 'OSGi', 'Sling Model', 'JSP/Servlet', 'Spring Framework', 'Hibernate ORM', 'JUnit/TestNG', 'Maven/Gradle'] },
    { name: 'Node.js Developer', subskills: ['NodeJS', 'ExpressJS', 'MongoDB', 'RESTful APIs', 'WebSocket', 'npm/yarn'] },
    { name: 'React Developer', subskills: ['ReactJS', 'Redux', 'React Router', 'JSX', 'Hooks', 'Context API', 'Material-UI/Ant Design'] },
    { name: 'DevOps Engineer', subskills: ['Docker', 'Kubernetes', 'Jenkins', 'Git/GitHub/GitLab', 'CI/CD Pipelines', 'Monitoring Tools (e.g., Prometheus, Grafana)', 'Configuration Management (e.g., Ansible, Chef, Puppet)', 'Cloud Platforms (e.g., AWS, Azure, Google Cloud)'] }
    
  ];

  const handlePositionChange = (value) => {
    setSelectedPosition(value);
  };

  const handleSubskillChange = (subskill, checked) => {
    if (checked) {
      setSelectedSubskills((prevSkills) => [...prevSkills, subskill]);
    } else {
      setSelectedSubskills((prevSkills) =>
        prevSkills.filter((skill) => skill !== subskill)
      );
    }
  };



  const [loading, setLoading] = useState(true);
  
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [childrenDrawer, setChildrenDrawer] = useState(false);

  const handleDrawerClose = () => {
    onClose(); // Close the drawer
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5040/candidate/${candidateId}`);
        const data = response.data;
        if (data.status === "SUCCESS") {
          const { fullName, position } = data.data;
          setCandidateData(data.data);
          
          setFormData({
            ...formData,
            fullName: fullName || '',
            position: position || '',
          });
        } else {
          console.error("Failed to fetch candidate data:", data.message);
        }
      } catch (error) {
        console.error("Error fetching candidate data:", error);
      }
    };
  
    if (visible && candidateId) {
      fetchData();
    }
  }, [visible, candidateId]);  // Ensure depe

  const handleSubmit = async () => {
    try {
      const { position, fullName, panelistName, round, meetingDate, meetingURL } = formData;
      const finalFeedback = 'Assigned ${round}'; // Add your final feedback logic here
  
      const requestBody = {
        position,
        fullName,
        panelistName,
        round,
        meetingDate,
        meetingURL,
        skills: selectedSubskills.map((skill) => ({
          name: skill,
          rating: 0, // Default rating
          comments: 'No comments', // Default comments
        })),
        status: finalFeedback,
      };
  
      // Send the request to update candidate details
      const response = await axios.put(`http://localhost:5040/evaluate/${candidateId}`, requestBody);
  
      if (response.status === 200) {
        message.success('Interview assigned successfully.');
        onClose(); // Close the drawer after successful update
      } else {
        throw new Error('Failed to assign interview. Please try again later.');
      }
    } catch (error) {
      console.error('Error updating interview details:', error);
      message.error(error.message || 'Failed to assign interview. Please try again later.');
    }
  };
  

  const getSkillsOptions = (position) => {
    // Your logic to fetch skillsOptions based on position
    // For example, fetch from a backend endpoint
    return ['Skill 1', 'Skill 2', 'Skill 3']; // Dummy data, replace with actual logic
  };

  const handleCheckboxChange = (selectedSkills) => {
    setFormData((prevData) => ({
      ...prevData,
      skills: selectedSkills,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const showChildrenDrawer = () => {
    setChildrenDrawer(true);
  };

  const onChildrenDrawerClose = () => {
    setChildrenDrawer(false);
  };

  return (
    <Drawer
      title="Assign Interview"
      visible={visible}
      onClose={handleDrawerClose}
      width={600}
    >
      <Form layout="vertical" initialValues={formData} onFinish={handleSubmit}>
        <Form.Item label="Position" name="position">
          <Input disabled value={formData.position} onChange={handleChange} />
        </Form.Item>
        <Form.Item label="Candidate Name" name="fullName">
          <Input disabled value={formData.fullName} onChange={handleChange} />
        </Form.Item>
        <Form.Item label="Panelist Name" name="panelistName">
          <Input onChange={handleChange} />
        </Form.Item>
        <Form.Item label="Round" name="round">
          <Select onChange={(value) => setFormData({ ...formData, round: value })}>
            <Option value="L1">L1 Round</Option>
            <Option value="L2">L2 Round</Option>
            <Option value="HR">HR Round</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Meeting Date" name="meetingDate">
          <DatePicker onChange={(date) => setFormData({ ...formData, meetingDate: date })} />
        </Form.Item>
        <Form.Item label="Meeting URL" name="meetingURL">
          <Input onChange={handleChange} />
        </Form.Item>
        <Button type="primary" htmlType="submit" style={{ backgroundColor: '#00B4D2', borderColor: '#fff' }}>
          Assign Interview
        </Button>
        <Button
          type="primary"
          style={{ backgroundColor: '#00B4D2', borderColor: '#fff' }}
          onClick={showChildrenDrawer}
        >
          + Skills
        </Button>
        <Drawer
        title="Choose Skills"
          width={320}
          closable={false}
          onClose={onChildrenDrawerClose}
      visible={childrenDrawer} 
      >
        <Select
          placeholder="Select Position"
          style={{ width: '100%', marginBottom: 20 }}
          onChange={handlePositionChange}
          value={selectedPosition}
        >
          {positions.map((position) => (
            <Option key={position.name} value={position.name}>
              {position.name}
            </Option>
          ))}
        </Select>
        <div>
            <h4>Select Subskills:</h4>
            {selectedPosition && positions.find((pos) => pos.name === selectedPosition)?.subskills.map((subskill) => (
              <Checkbox
                key={subskill}
                onChange={(e) => handleSubskillChange(subskill, e.target.checked)}
              >
                {subskill}
              </Checkbox>
            ))}
          </div>
        <div style={{ marginTop: 20 }}>
          <Button type="primary" onClick={onChildrenDrawerClose}  style={{ backgroundColor: '#00B4D2', borderColor: '#fff' }}>
            Ok
          </Button>
        </div>
      </Drawer>
       
      </Form>
    </Drawer>
  );
};

export default AssignInterview;
