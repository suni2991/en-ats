import React, { useState } from 'react';
import Fetchtable from '../components/Fetchtable';
import { MdAssignmentAdd } from "react-icons/md";
import { TiEyeOutline } from "react-icons/ti";
import CandidateProfileDrawer from '../components/CandidateProfileDrawer';
import SkillModal from '../components/SkillModal';

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
  const [selectedSkills, setSelectedSkills] = useState([]); // State to store selected skills

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setFormData({
      role: '',
      candidateName: '',
      experience: '',
      noticePeriod: '',
      panelistName: '',
      round: 'L1', // Reset Round to default after submission
    });
  };

  const handleAssign = () => {
    setShowModal(true); // Show modal on Assign button click
  };

  const handleModalCancel = () => {
    setShowModal(false); // Hide modal
  };

  const handleModalOk = (skills) => {
    setSelectedSkills(skills); // Set selected skills
    setShowModal(false); // Hide modal
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
            <h1>Interview Form</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
              <label>
                Candidate Name:
                <input
                  type="text"
                  name="candidateName"
                  value={formData.candidateName}
                  onChange={handleChange}
                />
              </label>
              {/* Other form fields */}
              <SkillModal visible={true} onCancel={handleModalCancel} onOk={handleModalOk} />
              {/* Display selected skills */}
              <div>Selected Skills: {selectedSkills.join(', ')}</div>
              <button type="submit">Submit</button>
              <button onClick={handleModalCancel}>Cancel</button>
            </form>
            <button onClick={handleModalCancel}>Close</button>
          </div>
        </div>
      )}

      {profileOpen && <CandidateProfileDrawer visible={profileOpen} onClose={closeProfile} candidateId={selectedCandidate._id} />}
    </div>
  );
};

export default Monitor;
