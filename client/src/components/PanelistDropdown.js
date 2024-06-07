import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select } from 'antd';

const { Option } = Select;

const PanelistDropdown = ({ onSelect }) => {
  const [panelists, setPanelists] = useState([]);

  useEffect(() => {
    const fetchPanelists = async () => {
      try {
        const response = await axios.get('http://localhost:5040/panelists/enfusian');
        const data = response.data;
        if (data.length > 0) {
          setPanelists(data);
        } else {
          console.log('No Enfusian panelists found.');
        }
      } catch (error) {
        console.error('Error fetching Enfusian panelists:', error);
      }
    };

    fetchPanelists();
  }, []);

  return (
    <Select placeholder="Select Panelist" onChange={onSelect}>
      {panelists.map((panelist) => (
        <Option key={panelist._id} value={panelist.fullName}>
          {panelist.fullName}
        </Option>
      ))}
      <Option value="HR">HR</Option> 
    </Select>
  );
};

export default PanelistDropdown;
