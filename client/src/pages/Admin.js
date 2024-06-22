import React, { useState } from 'react';
import Fetchtable from '../components/Fetchtable';
import CustomModal from '../components/CustomModal';
import Postjob from '../components/Postjob'; // Replace with the CreateUser component if you have one
import { Tooltip, Button } from 'antd';
import Createhr from '../components/Createhr';
import { MdWidthFull } from 'react-icons/md';

const Admin = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const userColumns = [
    { name: 'Name', selector: (row) => row.fullName, sortable: true },
    { name: 'Email', selector: (row) => row.email, sortable: true, width:'300px'},
    { name: 'Department', selector: (row) => row.department, sortable: true , width:'150px'},
    { name: 'Location', cell: (row) => row.currentLocation, sortable: true, width:'150px' },
    { 
      name: 'Role', 
       width:'120px',
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
        return '#00B4d2';
      case 'Enfusian':
        return '#1a2763';
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
    <div className='vh-page'>
      
      <div>
      <div className='topContainer2'>
      <Tooltip title="Create HR/Panelist" color='cyan'>
        <Button className='add-button' type='primary' style={{float: 'right', background:'#A60808'}} onClick={showModal}>
          Create User
        </Button>
      </Tooltip>
    </div>
        <Fetchtable 
          style={{width:'50% !important'}}
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
