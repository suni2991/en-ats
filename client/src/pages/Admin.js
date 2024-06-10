import React, { useState } from 'react';
import Fetchtable from '../components/Fetchtable';
import CustomModal from '../components/CustomModal';
import Postjob from '../components/Postjob'; // Replace with the CreateUser component if you have one
import { Tooltip } from 'antd';
import Createhr from '../components/Createhr';

const Admin = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const userColumns = [
    { name: 'Name', selector: (row) => row.fullName, sortable: true },
    { name: 'Email', selector: (row) => row.email, sortable: true },
    { name: 'Location', cell: (row) => row.currentLocation, sortable: true },
    { 
      name: 'Role', 
      cell: (row) => (
        <div style={{
          backgroundColor: getRoleColor(row.role),
          color: 'white',
          padding: '5px 10px',
          borderRadius: '5px',
          textAlign: 'center'
        }}>
        {row.role === 'Enfusian' ? 'Panelist' : row.role}
        </div>
       
      ), 
      sortable: true 
    },
  ];

  const getRoleColor = (role) => {
    switch(role) {
      case 'HR':
        return '#85c7a6';
      case 'Enfusian':
        return '#0f5a8c';
      default:
        return 'black';
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className='table-container'>
      <div className='topContainer'>
        <Tooltip title="Create HR/Panelist" color='cyan'>
          <button className="submit-button" style={{float: 'right'}} onClick={showModal}>
            Create User
          </button>
        </Tooltip>
      </div>
      <div>
        <h1>Create a User & View the details of User</h1>
        <Fetchtable 
          url={`http://localhost:5040/hrs`}
          columns={userColumns}
        />
      </div>
      <CustomModal isVisible={isModalVisible} onClose={closeModal}>
        <Createhr />  {/* Replace this with the component for creating a user */}
      </CustomModal>
    </div>
  );
}

export default Admin;
