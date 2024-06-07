import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Drawer, Form, Button, Select, message, DatePicker, Checkbox } from 'antd';
import PanelistDropdown from './PanelistDropdown';

const { Option } = Select;

const AssignInterview = ({ open, onClose, candidateId }) => {
  const [candidateData, setCandidateData] = useState({});
  const [formData, setFormData] = useState({
    panelistName: '', // Default value as an empty string
    round: 'L1',
    meetingDate: null,
    skills: [],
  });

  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedSubskills, setSelectedSubskills] = useState([]);
  
  const positions = [
    {name: 'UI Developer', subskills:["HTML/CSS/UI Development","ES6, JAvaScript, jQuery", "ReactJS" , "SCSS", "Any other UI Framework" , "AEM/Any other CMS", "Code Debugging Skills" , "Coding Test", "General" , "Communication" ]},
    { name: 'AEM Developer', subskills: ['AEM', 'AEM as Cloud', 'Static/ Editable Template', "Java" , "Servlet/Services", "OSGi", "Sling Model", "Frontend Expertise","Code Debugging Skills" , "Coding Test", "General" , "Communication" ] },
    { name: 'Java Developer', subskills: ['OOPS','Spring','Hibernate', 'core java', 'git', 'Unit Testing','Servlet', 'OSGi', 'Sling Model', 'JSP/Servlet', 'Spring Framework', 'Hibernate ORM', 'JUnit/TestNG', 'Maven/Gradle' , "Code Debugging Skills" , "Coding Test", "General" , "Communication"] },
    { name: 'Node.js Developer', subskills: ['NodeJS', 'ExpressJS', 'MongoDB', 'RESTful APIs', 'WebSocket', 'npm/yarn', 'MySQL', 'JavaScript/ TypeScript', 'HTML/CSS/SCSS', 'ReactJs/AngularJS', 'AWS Experience', 'General', "Communication"] },
    { name: 'React Developer', subskills: ['ReactJS', "JavaScript", 'Redux', 'React Router', 'JSX', 'Hooks', 'Context API', 'Material-UI/Ant Design', "Coding Test", "General" , "Communication"] },
    { name: 'DevOps Engineer', subskills: ['Docker', 'Kubernetes', 'Jenkins', 'Git/GitHub/GitLab', 'CI/CD Pipelines', 'Monitoring Tools (e.g., Prometheus, Grafana)', 'Configuration Management (e.g., Ansible, Chef, Puppet)', 'Cloud Platforms (e.g., AWS, Azure, Google Cloud)', "Coding Test", "General" , "Communication"] }
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

  const [childrenDrawer, setChildrenDrawer] = useState(false);

  const handleDrawerClose = () => {
    onClose();
    setFormData({
      panelistName: '', // Reset panelistName to an empty string
      round: 'L1', // Reset round to 'L1'
      meetingDate: null, // Reset meetingDate to null
      skills: [], // Reset skills array to an empty array
    }); // Close the drawer
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5040/candidate/${candidateId}`);
        const data = response.data;
        if (data.status === "SUCCESS") {
          const { fullName, position } = data.data;
          setCandidateData(data.data);
          setFormData((prevData) => ({ ...prevData, fullName: fullName || '', position }));
        } else {
          console.error("Failed to fetch candidate data:", data.message);
        }
      } catch (error) {
        console.error("Error fetching candidate data:", error);
      }
    };

    if (open && candidateId) {
      fetchData();
    }
  }, [open, candidateId]);

  const handlePanelistSelect = (value) => {
    setFormData({ ...formData, panelistName: value }); // Update panelistName in formData
  };

  const handleSubmit = async () => {
    try {
      const { round, meetingDate, panelistName } = formData;
      const finalFeedback = `Assigned ${round}, Feedback yet to receive`;

      const requestBody = {
        panelistName,
        round,
        meetingDate,
        skills: selectedSubskills.map((skill) => ({ name: skill, rating: 0, comments: 'No comments' })),
        status: finalFeedback,
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

  return (
    <Drawer
      title="Assign Interview"
      open={open}
      onClose={handleDrawerClose}
      width={600}
    >
      <div>
        <h1>Full Name: {candidateData.fullName}</h1>
        <h1>Position: {candidateData.position}</h1>
      </div>
      <Form layout="vertical" onFinish={handleSubmit}>
      <PanelistDropdown onSelect={handlePanelistSelect} />
        <Form.Item label="Round" name="round">
          <Select onChange={(value) => setFormData({ ...formData, round: value })} value={formData.round}>
            <Option value="L1">L1 Round</Option>
            <Option value="L2">L2 Round</Option>
            <Option value="HR">HR Round</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Interview Date" name="meetingDate">
          <DatePicker onChange={(date) => setFormData({ ...formData, meetingDate: date })} value={formData.meetingDate} />
        </Form.Item>
        <Button type="primary" style={{ backgroundColor: '#00B4D2', borderColor: '#fff' }} htmlType="submit">Assign Interview</Button>
        <Button type="primary" style={{ backgroundColor: '#00B4D2', borderColor: '#fff' }} onClick={showChildrenDrawer}>+ Skills</Button>
        <Drawer
          title="Choose Skills"
          width={320}
          closable={false}
          onClose={onChildrenDrawerClose}
          open={childrenDrawer}
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
            <Button type="primary" style={{ backgroundColor: '#00B4D2', borderColor: '#fff' }} onClick={onChildrenDrawerClose}>Ok</Button>
          </div>
        </Drawer>
      </Form>
    </Drawer>
  );
};

export default AssignInterview;
