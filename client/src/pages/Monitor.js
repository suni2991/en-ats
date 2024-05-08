import Fetchtable from '../components/Fetchtable';
import { MdAssignmentAdd } from "react-icons/md";
import { TiEyeOutline } from "react-icons/ti";
import CandidateProfileDrawer from '../components/CandidateProfileDrawer';
import {React, useState} from 'react'
import axios from 'axios';
import { Drawer, Form, Input, Button, Checkbox, DatePicker, Select, message } from 'antd';

const { Option } = Select;

const Monitor = ({visible, candidateId}) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [candidateFullName, setCandidateFullName] = useState('');
  const [formData, setFormData] = useState({
    position: '',
    fullName: '',
    experience: '',
    noticePeriod: '',
    panelistName: '',
    round: 'L1',
    meetingDate: null,
    meetingURL: '',
  });
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  // const handleAssign = (row) => {
  //   if (row) {
  //     setSelectedCandidate(row);
  //     setShowDrawer(true);
  //   } else {
  //     console.error('Error: No candidate selected.');
  //     message.error('Please select a candidate.');
  //   }
  // };
  const handleAssign = (row) => {
    console.log('Selected Row:', row);
    if (row && row._id && row.fullName) {
      setSelectedCandidate(row);
      setFormData((prevData) => ({
        ...prevData,
        fullName: row.fullName, // Set the fullName in the form data
        position: '', // Ensure other form fields are reset if needed
        experience: '',
        noticePeriod: '',
        panelistName: '',
        round: 'L1',
        meetingDate: null,
        meetingURL: '',
      }));
      setShowDrawer(true);
    } else {
      console.error('Error: Invalid candidate data.');
      message.error('Please select a valid candidate.');
    }
  };
  
  
  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      meetingDate: date,
    }));
  };

  const handleDrawerClose = () => {
    setShowDrawer(false); // Close the drawer
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(`http://localhost:5040/evaluate/${selectedCandidate._id}`, {
        skills: selectedSkills, // Assuming selectedSkills contains the updated skills data
      });
  
      console.log('Response from PUT request:', response.data);
      // Handle success, e.g., show a success message or update local state
    } catch (error) {
      console.error('Error updating candidate skills:', error);
      message.error('Failed to update candidate skills. Please try again later.');
      // Handle error, e.g., show an error message or perform fallback actions
    }
  };
  




  const skillsOptions = [ // Define skillsOptions array for Checkbox.Group options
  { label: 'HTML_CSS_UI_Development', value: 'HTML_CSS_UI_Development' },
  { label: 'ES6_JavaScript_jQuery', value: 'ES6_JavaScript_jQuery' },
  { label: 'ReactJS', value: 'ReactJS' },
  { label: 'SCSS', value: 'SCSS' },
  { label: 'Any_other_UI_Framework', value: 'Any_other_UI_Framework' },
  { label: 'AEM_Any_other_CMS', value: 'AEM_Any_other_CMS' },
  { label: 'Code_Debugging_Skills', value: 'Code_Debugging_Skills' },
  { label: 'Coding_Test', value: 'Coding_Test' },
  { label: 'General', value: 'General' },
  { label: 'Communication', value: 'Communication' },
  { label: 'AEM', value: 'AEM' },
  { label: 'AEMasCloud', value: 'AEMasCloud' },
  { label: 'Java', value: 'Java' },
  { label: 'Sevlet_Services', value: 'Sevlet_Services' },
  { label: 'OSGi', value: 'OSGi' },
  { label: 'SlingModel', value: 'SlingModel' },
  { label: 'Static_Editable_Template', value: 'Static_Editable_Template' },
  { label: 'Frontend_Expertise', value: 'Frontend_Expertise' },
  { label: 'NodeJS', value: 'NodeJS' },
  { label: 'OOPS', value: 'OOPS' },
  { label: 'RestfulAPI', value: 'RestfulAPI' },
  { label: 'MongoDB', value: 'MongoDB' },
  { label: 'JavaScript', value: 'JavaScript' },
  { label: 'Typescript', value: 'Typescript' },
  { label: 'HTML', value: 'HTML' },
  { label: 'CSS', value: 'CSS' },
  { label: 'AngularJS', value: 'AngularJS' },
  { label: 'AWS_Experience', value: 'AWS_Experience' },
];

  const renderResumeLink = (row) => {
    if (row.resume) {
      const downloadLink = `http://localhost:5040${row.resume}`;
      return (
        <a href={downloadLink} target="_blank" rel="noopener noreferrer" className='resume-link'>
          {row.fullName} CV
        </a>
      );
    } else {
      return "Resume not available";
    }
  };

  const [profileOpen, setProfileOpen] = useState(false);

  const handleView = (row) => {
    setSelectedCandidate(row); // Set the selected candidate
    setProfileOpen(true); // Open the ProfilePage in the drawer
  };

  const closeProfile = () => {
    setProfileOpen(false); // Close the ProfilePage in the drawer
  };

  const [open, setOpen] = useState(false);
const [childrenDrawer, setChildrenDrawer] = useState(false);

const onClose = () => {
  setOpen(false);
};
const showChildrenDrawer = () => {
  setChildrenDrawer(true);
};
const onChildrenDrawerClose = () => {
  setChildrenDrawer(false);
};

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

const handleCheckboxChange = (checkedValues) => {
  setSelectedSkills(checkedValues); // Update selected skills
};


  const userColumns = [
    { name: 'Name', selector: (row) => row.fullName, sortable: true },
    { name: 'Email', selector: (row) => row.email, sortable: true },
    { name: 'Resume', cell: (row) => renderResumeLink(row), sortable: true },
    { name: 'Status', selector: (row) => row.status, sortable: true },
    {
      name: 'Actions',
      cell: (row) => (
        <div>
          <button onClick={() => handleAssign(row)}><MdAssignmentAdd /></button>
          <button onClick={() => handleView(row)}><TiEyeOutline /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="table-container">
      <div>
        <div className="search-filter">
          <input type="text" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ margin: '18px' }} />
          <button className='submit-button1' style={{ width: '50%', padding: '2px 2px 2px 2px', marginRight: '60px' }} title='Add new Candidate' onClick={handleAssign}>Assign</button>
        </div>
      </div>
      <Fetchtable 
        url="http://localhost:5040/candidatesreport"
        columns={userColumns} 
        setSelectedCandidate={setSelectedCandidate}
      />

      <Drawer
        title="Assign Interview"
        visible={showDrawer}
        onClose={handleDrawerClose}
        width={600}
      >
        <Form layout="vertical" initialValues={formData} >
          <Form.Item label="Position" name="position">
            <Input onChange={handleChange} />
          </Form.Item>
          <Form.Item label="Candidate Name" name="fullName">
            <Input onChange={handleChange} />
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
            <DatePicker onChange={handleDateChange} />
          </Form.Item>
          <Form.Item label="Meeting URL" name="meetingURL">
            <Input onChange={handleChange} />
          </Form.Item>

          <Button type="primary" htmlType="submit" style={{ backgroundColor: '#00B4D2', borderColor: '#fff' }} onSubmit={handleSubmit}>
            Assign Interview
          </Button>
          
          
          <Button type="primary" style={{ backgroundColor: '#00B4D2', borderColor: '#fff' }} onClick={showChildrenDrawer}>
          + Skills
        </Button>
        <Drawer
          title="Choose Skills"
          width={320}
          closable={false}
          onClose={onChildrenDrawerClose}
          open={childrenDrawer}
        >
        <Form.Item label="Skills">
        <Checkbox.Group options={skillsOptions} onChange={handleCheckboxChange} />
      </Form.Item>
      
        </Drawer>
        </Form>
      </Drawer>

      {profileOpen && <CandidateProfileDrawer visible={profileOpen} onClose={closeProfile} candidateId={selectedCandidate._id} />}
    </div>
  );
};

export default Monitor;
