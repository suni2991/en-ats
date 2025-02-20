import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import Registration from '../components/Registration';
import logo from '../Assests/enfuse-logo.png'


const JobRegistration = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false); // This will simply hide the modal
  };

  useEffect(() => {
    showModal(); // Show the modal when the component mounts
  }, []); // The empty array ensures this runs only once when the component mounts

  return (
    <div style={{background:'#EEF5FD'}}>
        <center><div style={{margin: '150px auto', alignContent:'center'}}><Button style={{background:'#00B4D2'}} type="primary" onClick={showModal}>
        Click Here Apply Job
      </Button><br/><br/><br/>
      <img src={logo} alt='EnFuse-Logo' /><br/><br/><br/>
      <a href="http://www.enfuse-solutions.com/" style={{color:'#00B4D2'}}>Visit Enfuse Solutions</a>
      </div>
      
      </center>
        <Modal
        title="Job Registration"
        open={isModalVisible}  // `open` replaces the old `visible` prop
        onCancel={closeModal}  // Clicking outside or the close button will trigger closeModal
        footer={null}  // Removes the default footer buttons
      >
        <Registration />
      </Modal>
    </div>
  );
};

export default JobRegistration;
