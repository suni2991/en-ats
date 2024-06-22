import React, { useState, useEffect } from 'react';
import Fetchtable from '../components/Fetchtable';
import { Select } from 'antd';
import axios from 'axios';

const { Option } = Select;

const Reports = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5040/candidatesreport');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const userColumns = [
    {
      name: "Date",
      selector: row => {
        if (row.dateCreated) {
          const date = new Date(row.dateCreated);
          const dateString = date.toLocaleDateString();
          return <span>{dateString}</span>;
        } else {
          return "-";
        }
      },
      sortable: true,
      width: "100px"
    },
    {
      name: "Name",
      width: "150px",
      selector: row => row.fullName,
      sortable: true,
      cell: row => <span className="custom-cell" style={{textTransform:'capitalize'}}>{row.fullName}</span>
    },
    {
      name: "Email",
      width: "200px",
      selector: row => row.email,
      sortable: true,
      cell: row => <span className="custom-cell">{row.email}</span>
    },
    {
      name: "Quantitative",
      width: "130px",
      sortable: true,
      center: true,
      selector: row => {
        if (selectedCategory === "all" ? row.quantitative !== -1 : (selectedCategory === "Technical" && row.quantitative !== -1) || (selectedCategory === "Non-Technical" && row.quantitative !== -1)) {
          return row.quantitative;
        } else {
          return 0;
        }
      },
      sortable: true,
      center: true,
    },
    {
      name: "Vocabulary",
      width: "125px",
      selector: row => {
        if ((selectedCategory === "all" ? row.vocabulary !== -1 : selectedCategory === "Technical" && row.vocabulary !== -1) || (selectedCategory === "Non-Technical" && row.vocabulary !== -1)) {
          return row.vocabulary;
        } else {
          return 0;
        }
      },
      sortable: true,
      center: true,
    },
    {
      name: "Psychometric",
      width: "140px",
      selector: row => {
        if (selectedCategory === "all" ? row.psychometric !== -1 : selectedCategory === "Technical" && row.psychometric !== -1) {
          return row.psychometric;
        } else {
          return 0;
        }
      },
      sortable: true,
      center: true,
      omit: selectedCategory === "Non-Technical",
    },
    {
      name: "Java",
      width: "110px",
      selector: row => {
        if (selectedCategory === "all" ? row.java !== -1 : selectedCategory === "Technical" && row.java !== -1) {
          return row.java;
        } else {
          return 0;
        }
      },
      sortable: true,
      center: true,
      omit: selectedCategory === "Non-Technical",
    },
    {
      name: "Excel",
      width: "120px",
      selector: row => {
        if (selectedCategory === "all" ? row.excel !== -1 : selectedCategory === "Non-Technical" && row.excel !== -1) {
          return row.excel;
        } else {
          return 0;
        }
      },
      sortable: true,
      center: true,
      omit: selectedCategory === "Technical",
    },
    {
      name: "Accounts",
      width: "130px",
      selector: row => {
        if (selectedCategory === "all" ? row.accounts !== -1 : selectedCategory === "Non-Technical" && row.accounts !== -1) {
          return row.accounts;
        } else {
          return 0;
        }
      },
      sortable: true,
      center: true,
      omit: selectedCategory === "Technical",
    }
  ];

  return (
    <div className='vh-page'>
      <div className='topContainer2'>
        <label>
          <Select
            value={selectedCategory}
            onChange={(value) => setSelectedCategory(value)}
            style={{minWidth:'100px', margin:'2px'}}
          >
            <Option value="all">All</Option>
            <Option value="Technical">Technical</Option>
            <Option value="Non-Technical">Non-Technical</Option>
          </Select>
        </label>

        <h1 className='total-applicants' style={{ color: 'white',  background: '#00B4D2', height:'30px', borderRadius: '2px', margin:'7px', paddingTop:'5px' }}>Total Applicants :  {data.length}</h1>
        </div>
      <Fetchtable
        url={`http://localhost:5040/candidatesreport`}
        columns={userColumns}
      />
   
    </div>
  )
}

export default Reports;
