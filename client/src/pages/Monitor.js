import React, { useState } from 'react';
import Fetchtable from '../components/Fetchtable';
import {  MdAssignmentAdd ,MdDeleteOutline } from "react-icons/md";
import { TiEyeOutline } from "react-icons/ti";
import CandidateProfileDrawer from '../components/CandidateProfileDrawer';



const Monitor = () => {

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false); // State to control modal visibility



  const [formData, setFormData] = useState({
    role: '',
    candidateName: '',
    experience: '',
    noticePeriod: '',
    panelistName: '',
    round: 'L1', // Default value for Round
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle form submission here, e.g., send data to backend
    console.log(formData);
    // Reset form data after submission
    setFormData({
      role: '',
      candidateName: '',
      experience: '',
      noticePeriod: '',
      panelistName: '',
      round: 'L1', // Reset Round to default after submission
    });
  };

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

  const handleAssign = () => {
    setShowModal(true); // Show modal on Assign button click
    console.log("Assigned candidate:", selectedCandidate);
  };

  const closeModal = () => {
    setShowModal(false); // Hide modal
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

      {showModal && (
        <div className="modal">
          <div className="modal-content">
         
            
            <div>
      <h1>Interview Form</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
      <label style={{ textAlign: 'left', width: '45%' }}>
          Candidate Name:
          <input
            type="text"
            name="candidateName"
            value={formData.candidateName}
            onChange={handleChange}
            style={{ width: '100%' }}
          />
        </label>
        <label style={{ textAlign: 'left', width: '45%' }}>
          Role:
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{ width: '100%' }}
          />
        </label>
       
        
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        
     
      <label style={{ textAlign: 'left', width: '45%' }}>
      Experience:
      <input
        type="text"
        name="experience"
        value={formData.experience}
        onChange={handleChange}
        style={{ width: '100%' }}
      />
    </label>
    <label style={{ textAlign: 'left', width: '45%' }}>
    Availability/Notice Period:
    <input
      type="text"
      name="noticePeriod"
      value={formData.noticePeriod}
      onChange={handleChange}
      style={{ width: '100%' }}
    />
  </label>
        
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        
       
        
        <label style={{ textAlign: 'left', width: '45%' }}>
          Panelist Name:
          <input
            type="text"
            name="panelistName"
            value={formData.panelistName}
            onChange={handleChange}
            style={{ width: '100%' }}
          />
        </label>
        <label style={{ textAlign: 'left', width: '45%' }}>
        Round:
        <select name="round" value={formData.round} onChange={handleChange} style={{ width: '100%' }}>
          <option value="L1">L1</option>
          <option value="L2">L2</option>
          <option value="HR">HR</option>
        </select>
      </label>
      </div>
      <div id='btnWrapper'>
      <button type="submit" style={{ alignSelf: 'flex-start', width: '100px' }}>Submit</button>
      <button onClick={closeModal}>Close</button>
      </div>
      </form>
    
    </div>
            
          </div>
        </div>
      )}
      {profileOpen && <CandidateProfileDrawer visible={profileOpen} onClose={closeProfile} candidateId={selectedCandidate._id} />}

    </div>
    
  );
};

export default Monitor;
