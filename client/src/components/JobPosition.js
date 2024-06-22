import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip, Legend as BarLegend } from 'recharts';
import * as XLSX from 'xlsx';

const JobPositionPieChart = () => {
  const [vacanciesData, setVacanciesData] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('Adobe_Team');
  const [clickedPosition, setClickedPosition] = useState('Java Developer');
  const [positionData, setPositionData] = useState([]);

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

  const vacancyStatusColors = {
    Selected: '#82ca9d',
    Rejected: '#d0ed57',
    L1: '#8884d8',
    L2: '#83a6ed',
    Onboarded: '#8dd1e1',
    HR: '#a4de6c'
  };

  useEffect(() => {
    const fetchVacanciesData = async () => {
      try {
        if (selectedDepartment) {
          const response = await axios.get(`http://localhost:5040/positions-with-vacancies/${selectedDepartment}`);
          setVacanciesData(response.data.positions);
        }
      } catch (error) {
        console.error('Error fetching vacancies data:', error);
      }
    };

    fetchVacanciesData();
  }, [selectedDepartment]);

  useEffect(() => {
    const fetchPositionData = async () => {
      try {
        const response = await axios.get(`http://localhost:5040/vacancy-status/${clickedPosition}`);
        const formattedData = response.data.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {});
        setPositionData([formattedData]);
      } catch (error) {
        console.error('Error fetching position data:', error);
      }
    };

    fetchPositionData();
  }, [clickedPosition]);

  const handleDepartmentChange = (event) => {
    const selectedDept = event.target.value;
    setSelectedDepartment(selectedDept);
    setClickedPosition(null);
    setPositionData([]);
  };

  const handleClick = (data) => {
    setClickedPosition(data.name);
  };

  const handleDownloadReport = async () => {
    try {
      // Fetch data for positions with vacancies in the selected department
      const responsePositions = await axios.get(`http://localhost:5040/positions-with-vacancies/${selectedDepartment}`);
      const positionsData = responsePositions.data.positions;
  
      // Fetch data for vacancy status for all positions in the selected department
      const vacancyStatusPromises = positionsData.map(async (position) => {
        const response = await axios.get(`http://localhost:5040/vacancy-status/${position.position}`);
        return { position: position.position, status: response.data };
      });
  
      // Wait for all promises to resolve
      const vacancyStatusData = await Promise.all(vacancyStatusPromises);
  
      // Prepare data for the entire department with vacancy status counts
      const data = positionsData.map((positionData) => {
        const statusData = {};
        const positionStatus = vacancyStatusData.find((item) => item.position === positionData.position);
        if (positionStatus) {
          positionStatus.status.forEach((status) => {
            statusData[status._id] = status.count;
          });
        }
        return {
          Department: selectedDepartment,
          Position: positionData.position,
          Vacancies: positionData.vacancies,
          ...statusData,
        };
      });
  
      // Prepare headers and sheet data for XLSX export
      const headers = ['Department', 'Position', 'Vacancies', ...Object.keys(vacancyStatusColors)];
      const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
      XLSX.writeFile(workbook, `${selectedDepartment}_Report.xlsx`);
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };
  
  
  

  const filteredVacanciesData = selectedDepartment
    ? vacanciesData.map(pos => ({
        name: pos.position,
        value: pos.vacancies,
      }))
    : [];

  const colors = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57'];

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '50%' }}>
        <div style={{ paddingLeft: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFF', height: '48px', width: '74vw' }}>
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
          <div className='buttons'>
            
            <button onClick={handleDownloadReport}>Report</button>
          </div>
        </div>
        <br />
        <div className='pie-chart'>
          {filteredVacanciesData && filteredVacanciesData.length > 0 ? (
            <PieChart width={400} height={400}>
              <Pie
                dataKey="value"
                data={filteredVacanciesData}
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label
                onClick={handleClick}
              >
                {filteredVacanciesData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                    border="none"
                    strokeWidth={0}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          ) : (
            <div>No data available for the selected department</div>
          )}

          <div style={{ width: '50%', margin: '50px' }}>
            {clickedPosition && (
              <BarChart width={500} height={300} data={positionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <BarTooltip />
                <BarLegend />
                {Object.keys(vacancyStatusColors).map((status, index) => (
                  <Bar key={index} dataKey={status} fill={vacancyStatusColors[status]} />
                ))}
              </BarChart>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPositionPieChart;
