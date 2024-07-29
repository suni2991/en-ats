import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select } from 'antd';
import useAuth from '../hooks/useAuth';

const { Option } = Select;
const URL = process.env.REACT_APP_API_URL;
const HrDropdown = ({ onSelect, onSelectHr }) => {
  const [hrs, setHrs] = useState([]);
  const [selectedPanelist, setSelectedPanelist] = useState(null);
  const [mgrName, setMgrName] = useState(null);
  const [mgrEmail, setMgrEmail] = useState(null);
  const {token} = useAuth();

  const handleSelectChange = (fullName) => {
    const selectedHr = hrs.find((hr) => hr.fullName === fullName);
    if (selectedHr) {
      setSelectedPanelist(fullName);
      onSelect(selectedHr.email);
      onSelectHr(selectedHr.fullName, selectedHr.email);
      setMgrName(selectedHr.fullName);
      setMgrEmail(selectedHr.email);
    }
  };

  useEffect(() => {
    const fetchPanelists = async () => {
      try {
        const response = await axios.get(`${URL}/hrs/name`,
          {
            headers:{
              Authorization: `Bearer ${token}`
            }
          });
        const data = response.data;
        if (data.length > 0) {
          setHrs(data);
        } else {
          console.log('No Enfusian hrs found.');
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
        placeholder="Choose HR"
        value={selectedPanelist}
        onChange={handleSelectChange}
        style={{ width: '100%' }}
        className="custom-dropdown"
      >
        {hrs.map((hr) => (
          <Option key={hr._id} value={hr.fullName}>
            {hr.fullName && hr.fullName.length > 0 ? hr.fullName[0].toUpperCase() + hr.fullName.slice(1).toLowerCase() : hr.fullName}
          </Option>
        ))}
      </Select>
      <style>
        {`
          .custom-dropdown .ant-select-selector:hover {
            border-color: #00B4D2 !important;
          }
          .custom-dropdown .ant-select-selector {
            border-color: #00B4D2 !important;
          }
        `}
      </style>
    </div>
  );
};

export default HrDropdown;
