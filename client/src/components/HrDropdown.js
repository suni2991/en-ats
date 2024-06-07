import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, Input } from 'antd';

const { Option } = Select;

const HrDropdown = ({ onSelect, onSelectHr }) => {
  const [hrs, setHrs] = useState([]);
  const [selectedPanelist, setSelectedPanelist] = useState(null);
  const [mgrName, setMgrName] = useState(null);
  const [mgrEmail, setMgrEmail] = useState(null);

  const handleSelectChange = (fullName) => {
    const selectedHr = hrs.find((hr) => hr.fullName === fullName);
    if (selectedHr) {
      setSelectedPanelist(fullName);
      onSelect(selectedHr.email); // Notify parent component with the selected HR's email
      onSelectHr(selectedHr.fullName, selectedHr.email); // Notify parent component with the selected HR's fullName and email
      setMgrName(selectedHr.fullName); // Set mgrName to the selected HR's fullName
      setMgrEmail(selectedHr.email); // Set mgrEmail to the selected HR's email
    }
  };

  useEffect(() => {
    const fetchPanelists = async () => {
      try {
        const response = await axios.get('http://localhost:5040/hrs/name');
        const data = response.data;
        if (data.length > 0) {
          setHrs(data);
        } else {
          console.log('No Enfusian hrs found.'); // Handle empty data case
        }
      } catch (error) {
        console.error('Error fetching Enfusian hrs:', error);
      }
    };

    fetchPanelists();
  }, []);

  return (
    <div>
      <Select
        placeholder="Select Panelist"
        value={selectedPanelist}
        onChange={handleSelectChange}
        style={{width:'100%'}}
      >
        {hrs.map((hr) => (
          <Option key={hr._id} value={hr.fullName}>
            {hr.fullName}
          </Option>
        ))}
      </Select>
      <Input
        disabled
        style={{ marginTop: '10px' }}
        value={mgrEmail || ''}
        placeholder="HR Email"
        
      />
    </div>
  );
};

export default HrDropdown;
