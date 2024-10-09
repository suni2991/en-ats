import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import { Drawer, Button, Pagination } from 'antd';
import "../styles/Scorecard.css";

const RecruiterScorecard = () => {
  const [data, setData] = useState([]);
  const [selectedHrEmail, setSelectedHrEmail] = useState('');
  const [selectedHrName, setSelectedHrName] = useState('');
  const [hrCounts, setHrCounts] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [candidates, setCandidates] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Show 10 HR cards per page
  const paginatedHrCounts = hrCounts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const fetchHrCounts = async () => {
    try {
      const response = await axios.get('/hrs/candidate-count'); // Endpoint to get HR names and candidate counts
      const sortedHrCounts = response.data.hrCounts.sort((a, b) => b.candidateCount - a.candidateCount); // Sort HRs by candidate count (highest first)
      setHrCounts(sortedHrCounts);

      if (sortedHrCounts.length > 0) {
        const topHr = sortedHrCounts[0]; // Get the HR with the highest count
        setSelectedHrName(topHr._id);
        setSelectedHrEmail(topHr.email);

        // Delay fetching data to allow chart animation
        setTimeout(() => {
          fetchData(topHr._id); // Fetch data for the top HR
        }, 500);  // Small delay for smoother animation
      }
    } catch (error) {
      console.error('Error fetching HR counts:', error);
    }
  };

  const fetchData = async (mgrName) => {
    try {
      const response = await axios.get(`/api/mgr/${mgrName}/status-count`);
      const filteredData = response.data.filter(item => 
        ['Processing', 'Shortlisted', 'Onboarded', 'Rejected', 'Backed Out'].includes(item.status)
      );
      setData(filteredData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchCandidatesByStatus = async (status) => {
    try {
      const response = await axios.get(`/api/candidates?status=${status}`); // Endpoint to get candidates by status
      setCandidates(response.data); // Assuming response.data contains an array of candidate names
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  const handleSelectHr = (fullName, email) => {
    setSelectedHrName(fullName);
    setSelectedHrEmail(email);
    fetchData(fullName);
  };

  const handleStatusClick = (status, names) => {
    setSelectedStatus(status);
    setCandidates(names);
    setDrawerVisible(true);
  };

  const handleDrawerClose = () => {
    setDrawerVisible(false);
  };

  useEffect(() => {
    fetchHrCounts();
  }, []);

  // Predefined background colors for HR cards
  const hrCardColors = ['#e1f5fe', '#e8f5e9', '#fff9c4', '#fce4ec', '#f3e5f5'];
  const pieColors = ['#61acc9', '#82ca9d', '#10679b', '#42b16f', '#6ac7c9']; // Define colors for the Pie chart

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', background:'#fff', padding:'20px', borderRadius:'2px',boxShadow: '0px 2px 4px rgb(38, 39, 130)'}}>
      <div style={{ width: '30%', paddingRight: '20px' }}>
        <h5 style={{ margin:'20px' }}>Top Recruiters</h5>
        <div style={{ padding: '10px'}}>
          <ul className="hr-list">
            {hrCounts.map((hr, index) => (
              <li 
                key={hr._id} 
                className="hr-card" 
                style={{ backgroundColor: hrCardColors[index % hrCardColors.length] }} // Assign different background colors to each HR card
                onClick={() => handleSelectHr(hr._id, hr.email)} // Select the HR when clicked
              >
                <div className="hr-name">{hr._id} <span className="hr-candidate-count">{hr.candidateCount}</span></div>
              </li>
            ))}
          </ul>
          <Pagination 
            current={currentPage}
            pageSize={pageSize}
            total={hrCounts.length}
            onChange={handlePageChange}
            style={{ marginTop: '20px', textAlign: 'center' }}
          />
        </div>
      </div>  
      <div style={{ width: '50%' }}>
        <PieChart width={300} height={400}>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            outerRadius={150}  // Outer radius for the pie chart
            innerRadius={100}   // Inner radius to create the donut hole
            stroke="#00B4D2"
            strokeWidth={0.5}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
      <div style={{ width: '45%' }}>
        <ul>
          {data.map((item) => (
            <li key={item.status}>
              <a href="#!" onClick={() => handleStatusClick(item.status, item.names)}>
                {item.status}: {item.count}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <Drawer
        title={`Candidates - ${selectedStatus}`}
        placement="left"
        onClose={handleDrawerClose}
        open={drawerVisible}
        width={300}
      >
        <ul>
          {candidates.map((candidate, index) => (
            <li key={index}>{candidate}</li>
          ))}
        </ul>
      </Drawer>
    </div>
  );
};

export default RecruiterScorecard;
