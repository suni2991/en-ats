

import React, { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { CSVLink } from 'react-csv';
import { FadeLoader } from 'react-spinners';

const API = "http://localhost:5040/candidates";

function Reports() {
  const [data, setData] = useState([])
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  useEffect(() => {
    fetch('http://localhost:5040/candidate/status')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setFilteredData(data);
      })
      .catch(error => console.error(error));
  }, []);
  useEffect(() => {
    setFilteredData(
      data.filter(
        row =>
          row.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          row.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [data, searchQuery]);

  useEffect(() => {
    setFilteredData(
      data.filter(row => {
        const nameMatches = row.fullName.toLowerCase().includes(searchQuery.toLowerCase());
        const emailMatches = row.email.toLowerCase().includes(searchQuery.toLowerCase());
  
        if (selectedCategory === 'Technical') {
          return (nameMatches || emailMatches ) && row.java !== -1 && row.psychometric !== -1
        } else if (selectedCategory === 'Non-Technical') {
          return (nameMatches || emailMatches) && row.excel !== -1 && row.accounts !== -1
        } else {
          return nameMatches || emailMatches;
        }
      })
    );
  }, [data, searchQuery, selectedCategory]);
  
  const fetchUsers = async (url) => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.length > 0) {
        // Sort the data based on the creation date in descending order
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setData(sortedData);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const dataToExport = filteredData.map(row => {
    const formattedRow = {
      Date: row.dateCreated,
      Name: row.fullName,
      Email: row.email,
      Quantitative: row.quantitative !== -1 ? row.quantitative : 0,
      Vocabulary: row.vocabulary !== -1 ? row.vocabulary : 0,
      Psychometric: selectedCategory === "Technical" ? (row.psychometric !== -1 ? row.psychometric : 0) : undefined,
      Java: selectedCategory === "Technical" ? (row.java !== -1 ? row.java : 0) : undefined,
      Excel: selectedCategory === "Non-Technical" ? (row.excel !== -1 ? row.excel : 0) : undefined,
      Accounts: selectedCategory === "Non-Technical" ? (row.accounts !== -1 ? row.accounts : 0) : undefined,
    };
    return formattedRow;
  });

 
  useEffect(() => {
    setLoading(true);
    fetchUsers(API)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ margin: "250px auto" }}>
        <center><FadeLoader color={"#00B4D2"} size={20} margin={2} /></center>
      </div>
    );
  }

 
  const customStyles = {
    rows: {
      padding: '12px',
      style: {
        minHeight: '30px',
        lineHeight: '30px',
        backgroundColor: '#fff',
        ':hover': {
          backgroundColor: '#00B4D2',
          color: '#fff',
          fontWeight: 'bold',
          borderRadius: 'none',
        },
        ':active': {
          backgroundColor: '#00B4D2',
          color: '#fff',
        },
      },
    },
    headCells: {
      style: {
        backgroundColor: '#28325A',
        color: '#FFFF',
        padding: '2px 0px 2px 0px',
        height: '40px !important',
        fontWeight: 'bolder'
      },
    },
    cells: {
      style: {
        padding: '8px',
        width: "100px",
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        alignItems: 'center'
      },
    },
    pagination: {
      style: {
        backgroundColor: '#28325A',
        border: 'none',
        color: '#fff',
        display: "flex",
        alignItems: "center",
        minHeight: '30px',
        lineHeight: '30px'
      },
      pageButtonsStyle: {
        backgroundColor: '#fff',
        border: 'none',
        cursor: 'pointer',
        margin: "0 5px",
        padding: '1px',
        width: '20%',
        height: '23px !important',
        ':hover': {
          backgroundColor: '#00B4D2',
          color: 'rgb(14, 157, 157)',
        },
        ':active': {
          backgroundColor: '#8C8C8C',
          color: '#333',
        },
      },
    },
  };
  const columns = [
   
      {
        name: "Date",
        selector: row => {
          if(row.dateCreated){
          const date = new Date(row.dateCreated);
          const dateString = date.toLocaleDateString();
         
          return (
                  <span>{dateString}</span>
                 )
        } else{
          return "-"
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
      cell: row => <span className="custom-cell">{row.fullName}</span>
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
      width: "130px",
      selector: row => {
        if ((selectedCategory === "all" ? row.vocabulary !== -1 :selectedCategory === "Technical" && row.vocabulary !== -1) || (selectedCategory === "Non-Technical" && row.vocabulary !== -1)) {
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
      width: "130px",
      selector: row => {
        if (selectedCategory === "all" ? row.psychometric!== -1 : selectedCategory === "Technical" && row.psychometric !== -1) {
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
      width: "130px",
      selector: row => {
        if (selectedCategory === "all" ? row.java !== -1 : selectedCategory ==="Technical" && row.java !== -1) {
          return row.java;
        } else {
          return 0;
        }
      },
      sortable: true,
      center: true,
      omit:selectedCategory==="Non-Technical",
    },
    {
      name: "Excel",
      width: "130px",
      selector: row => {
        if (selectedCategory === "all"? row.excel !== -1 : selectedCategory ==="Non-Technical" && row.excel !== -1) {
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
        if (selectedCategory === "all" ? row.accounts !== -1 : selectedCategory ==="Non-Technical" && row.accounts !== -1) {
          return row.accounts;
        } else {
          return 0;
        }
      },
      sortable: true,
      center: true,
      omit: selectedCategory === "Technical",

    }
  ]
 
  return (
    <div className='table-container'>
      <div className='search-filter2'>
        <input type="text" value={searchQuery} className='search-field' onChange={(e) => setSearchQuery(e.target.value)} placeholder='Type Name here' />

         <label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All</option>
            <option value="Technical">Technical</option>
            <option value="Non-Technical">Non-Technical</option>
          </select>
        </label>
{/*        
        <label>
          <input
            type="radio"
            name="category"
            value="Technical"
            checked={selectedCategory === 'Technical'}
            onChange={() => setSelectedCategory('Technical')}
          />
          Technical
        </label>
        <label>
          <input
            type="radio"
            name="category"
            value="Non-Technical"
            checked={selectedCategory === 'Non-Technical'}
            onChange={() => setSelectedCategory('Non-Technical')}
          />
          Non Technical
        </label> */}
       
        <h1 className='total-applicants' style={{ color: 'white',  background: '#00B4D2',  padding: '6px', borderRadius: '2rem' }}>Total Applicants :  {data.length}</h1>

      </div>
      <DataTable
        // columns={columns}
        columns={columns.filter(column => !column.omit)}
        data={filteredData}
        fixedHeader
        pagination
        paginationPerPage={10}
        customStyles={customStyles}
      />
      <br />
      <center>
      <CSVLink
          data={dataToExport}
          className='export-csv'
          title='Download All/SELECTED records to CSV file'
          filename='candidates.csv'
        >
          Export to CSV
        </CSVLink>
        </center>
      <center><i><p style={{ color: '#00B4D2' }}> *All fields are sortable</p></i></center>
    </div>
  )
}

export default Reports;