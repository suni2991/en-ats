import React, { useState, useEffect } from "react";
import axios from "axios";
import { Select } from "antd";
import useAuth from "../hooks/useAuth";

const { Option } = Select;
const URL = process.env.REACT_APP_API_URL;
const PanelistDropdown = ({ onSelect }) => {
  const [panelists, setPanelists] = useState([]);
  const { token } = useAuth();
  useEffect(() => {
    const fetchPanelists = async () => {
      try {
        const response = await axios.get(
          `${URL}/panelists/enfusian`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
        if (data.length > 0) {
          setPanelists(data);
        } else {
          console.log("No Enfusian panelists found.");
        }
      } catch (error) {
        console.error("Error fetching Enfusian panelists:", error);
      }
    };

    fetchPanelists();
  }, []);

  return (
    <Select placeholder="Select Panelist" onChange={onSelect}>
      {panelists.map((panelist) => (
        <Option key={panelist._id} value={panelist.fullName}>
          {panelist.fullName && panelist.fullName.length > 0
            ? panelist.fullName[0].toUpperCase() +
              panelist.fullName.slice(1).toLowerCase()
            : panelist.fullName}
        </Option>
      ))}
      <Option value="HR">HR</Option>
    </Select>
  );
};

export default PanelistDropdown;
