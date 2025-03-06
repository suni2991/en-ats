import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { Drawer, Button, Pagination, DatePicker, message } from 'antd';
import "../styles/Scorecard.css";

const URL = process.env.REACT_APP_API_URL;
const RecruiterScorecard = () => {
  const [data, setData] = useState([]);
  const [selectedHrEmail, setSelectedHrEmail] = useState('');
  const [selectedHrName, setSelectedHrName] = useState('');
  const [hrCounts, setHrCounts] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [candidates, setCandidates] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5); // Show 5 HR cards per page
  const paginatedHrCounts = hrCounts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const {RangePicker} = DatePicker;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const fetchHrCounts = async () => {
    try {
      const response = await axios.get(`${URL}/api/hrs/candidate-count`); // Endpoint to get HR names and candidate counts
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

  const fetchData = async (mgrName, start, end) => {
    try {
      const response = await axios.get(`${URL}/api/mgr/${mgrName}/status-count`, {
        params: { startDate: start, endDate: end }  // Pass as query parameters
      });
      setData(response.data);
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

  const handleStatusClick = (status, names, positions) => {
    if (!names || !positions || names.length !== positions.length) {
      positions = names.map(() => 'No Position');
    }

    setSelectedStatus(status);

    const groupedCandidates = names.reduce((acc, name, index) => {
      const position = positions[index] || 'No Position';
      if (!acc[position]) {
        acc[position] = [];
      }
      acc[position].push(name);
      return acc;
    }, {});

    setCandidates(groupedCandidates);
    setDrawerVisible(true);
  };


  const handleDrawerClose = () => {
    setDrawerVisible(false);
  };

  useEffect(() => {
    fetchHrCounts();
  }, []);

  // Handle date range change
  const handleDateChange = (dates, dateStrings) => {
    setStartDate(dateStrings[0]);
    setEndDate(dateStrings[1]);

    if (selectedHrName) {
      fetchData(selectedHrName, dateStrings[0], dateStrings[1]); // Fetch filtered data
    }
  };

  // Handle download as CSV
  const handleDownload = () => {
    if (data.length === 0) {
      message.error("No data to download!");
      return;
    }

    const formattedData = data.map((item) => ({
      Status: item.status,
      Count: item.count,
      Names: item.names ? item.names.join(', ') : 'N/A',
      Positions: item.positions ? item.positions.join(', ') : 'N/A',
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Recruiter Data");

    XLSX.writeFile(wb, `Recruiter_${selectedHrName}_Data.xlsx`);
  };

  // Predefined background colors for HR cards
  const hrCardColors = ['rgb(170, 170, 170)'];
  const pieColors = ['#61acc9', '#82ca9d', '#10679b', '#42b16f', '#6ac7c9']; // Define colors for the Pie chart

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', background: '#fff', padding: '20px', borderRadius: '2px', boxShadow: '0px 2px 4px rgb(38, 39, 130)' }}>

      <div style={{ width: '30%', paddingRight: '20px' }}>
        <h5 style={{ margin: '20px', fontSize: '20px', fontWeight: 'bold', color: 'rgb(26, 39, 99)' }}>Top Recruiters</h5>
        <div style={{ padding: '10px' }}>

          <ul className="hr-list">

            {paginatedHrCounts.map((hr, index) => (

              <li
                key={hr._id}
                className={`hr-card ${selectedHrName === hr._id ? 'active' : ''}`}
                style={{ backgroundColor: hrCardColors[index % hrCardColors.length] }}
                onClick={() => handleSelectHr(hr._id, hr.email)}
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
        <PieChart width={400} height={400}>
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
        {/* Date Range Picker */}
        <div style={{display: 'flex', justifyContent: 'left', alignItems:'center', marginBottom: '15px' }}>
          <RangePicker style={{height: '40px', width:'197px'}}  onChange={handleDateChange} /><br/>
          <Button style={{height: '40px', marginLeft: '10px', paddingTop: '7px', borderRadius: '5px'}} type="primary" onClick={handleDownload}>Download Data</Button>
        </div>
        <h5 style={{ marginBottom: '10px', fontSize: '18px', fontWeight: 'bold', color: 'rgb(26, 39, 99)' }}>Recruiter Name: {selectedHrName.toUpperCase()}</h5>
        <ul>
          {data.map((item) => (
            <li key={item.status}>
              <a href="#!" onClick={() => handleStatusClick(item.status, item.names, item.positions)}>
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
          {Object.entries(candidates).map(([position, names], index) => (
            <li key={index}>
              {position !== 'No Position' && (
                <>
                  <strong style={{ color: "#00B4D2", fontWeight: "bold" }}>{position}</strong>  <br />
                </>
              )}
              <ul>
                {names.map((name, idx) => (
                  <li key={idx} style={{ marginLeft: "10px" }}>{name}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Drawer>
    </div>
  );
};

export default RecruiterScorecard;