import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip, Legend as BarLegend } from 'recharts';
import { Modal } from 'antd';

const JobPositionPieChart = () => {
  const [vacanciesData, setVacanciesData] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [hoveredPosition, setHoveredPosition] = useState(null);
  const [positionData, setPositionData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const deptList = [
    'Data and Digital-DND', 
    'PACS', 
    'EdTech & Catalog Operations (ECO)', 
    'Analytics Practice', 
    'Adobe_Team', 
    'Software Services', 
    'Business Development', 
    'Human Resources', 
    'Administration', 
    'IT & Governance'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/vacancies-by-position');
        setVacanciesData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
    setHoveredPosition(null); // Reset hovered position when department changes
    setPositionData([]);
  };

  const handleMouseEnter = (data) => {
    setHoveredPosition(data.name); // Set the hovered position
    const departmentData = vacanciesData.find(vacancy => vacancy.department === selectedDepartment);
    if (departmentData) {
      const positionDetails = departmentData.positions.find(position => position.position === data.name);
      if (positionDetails) {
        setPositionData(positionDetails.vacancyStatus);
        setIsModalVisible(true); // Show the modal
      }
    }
  };

  const handleMouseLeave = () => {
    setIsModalVisible(false); // Hide the modal when mouse leaves
  };

  const filteredVacanciesData = selectedDepartment
    ? vacanciesData.find(vacancy => vacancy.department === selectedDepartment)?.positions.map(pos => ({
        name: pos.position,
        value: pos.vacancyStatus.reduce((acc, status) => acc + status.count, 0)
      })) || []
    : [];

  const colors = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57'];

  if (!vacanciesData || vacanciesData.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <h1>Vacancies Pie Chart</h1>
      <div>
        <label htmlFor="department">Department:</label><br />
        <select
          name="department"
          id="department"
          value={selectedDepartment}
          onChange={handleDepartmentChange}
          required
        >
          <option value="">Select Department</option>
          {deptList.map((dept, index) => (
            <option key={index} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>
      <br />
      {filteredVacanciesData.length > 0 ? (
        <>
          <PieChart width={400} height={400}>
            <Pie
              dataKey="value"
              data={filteredVacanciesData}
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label
              onMouseEnter={handleMouseEnter}
            >
              {filteredVacanciesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
          <Modal
            title={`Details for ${hoveredPosition}`}
            open={isModalVisible}
            onCancel={handleMouseLeave}
            footer={null}
          >
            <BarChart width={500} height={300} data={positionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <BarTooltip />
              <BarLegend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </Modal>
        </>
      ) : (
        <div>No data available for the selected department</div>
      )}
    </div>
  );
};

export default JobPositionPieChart;
