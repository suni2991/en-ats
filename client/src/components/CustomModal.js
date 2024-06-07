import React from 'react';
import '../styles/CustomModal.css'; // Make sure to create this CSS file for styling

const CustomModal = ({ isVisible, children }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="modal-overlay">
      
        <div className="modal-body">
          {children}
        </div>
     
    </div>
  );
};

export default CustomModal;
