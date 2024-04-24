import React, { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import Swal from 'sweetalert2';
import { CSVLink } from 'react-csv';


const API = "http://localhost:5040/candidates";
function Credentials() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [data, setData] = useState([])
  const [searchQuery, setSearchQuery] = useState('');

  const handleRowSelected = (state) => {
    setSelectedRows(state.selectedRows);
  };

  

  const sendEmail = async (rowData) => {

    const { fullName, email, username, confirmPassword } = rowData;
    const res = await fetch("http://localhost:5040/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email, username, confirmPassword, fullName
      })
    });
    const data = await res.json();
    if (data.status === 401 || !data) {
      console.log("error")
    } else {
      
       
    

      const updateRes = await fetch(`http://localhost:5040/candidate/${rowData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: "Email sent successfully"
        })
      });
      const updateData = await updateRes.json();
      console.log(updateData)
    }
  }

  
  const dataToExport = data.map(row => ({
    Name: row.fullName,
    Email: row.email,
    Username: row.username,
    Password: row.confirmPassword,
  }));

  // const fetchUsers = async (url) => {
  //   try {
  //     const res = await fetch(url);
  //     const data = await res.json();
  //     if (data.length > 0) {
  //       setData(data);
  //     }
  //   } catch (e) {
  //     console.error(e)
  //   }
  // }
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

  useEffect(() => {
    fetchUsers(API);
  }, [])


  const customStyles = {
    rows: {
     
      padding: '15px',
      style: {
       
        backgroundColor: '#fff',
        minHeight: '25px', // set the minimum height of each row
      lineHeight: '25px',
        ':hover': {
          backgroundColor: '#00B4D2',
          color: '#fff',
          fontWeight: 'bold',
          height:'30px !important',
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
        padding: '2px 10px 2px 10px',
      
      },
    },
    cells: {
      style: {
        padding: '8px',
        height:'30px !important',
        width: '180px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
    },
   
    pagination: {
      
      style: {
        backgroundColor: '#28325A',
        height:'30px !important',
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
  //   
  const columns = [

    {
      name: "Name",
      selector: row => row.fullName,
      sortable: true,
      cell: row => <span className="custom-cell">{row.fullName}</span>
    },
    {
      name: "Email",
      selector: row => row.email,
      sortable: true,
      cell: row => <span className="custom-cell">{row.email}</span>
    },
    {
      name: "Username",
      selector: row => row.username,
      sortable: true,
      center: true,
      cell: row => <span className="custom-cell">{row.username}</span>
    },
    {
      name: "Password",
      selector: row => row.confirmPassword,
      sortable: true,
      center: true,
       cell: row => <span className="custom-cell">{row.confirmPassword}</span>
    },
  ];

  const handleSendEmail = async () => {
    const selectedCount = selectedRows.length;
    Swal.showLoading();
    for (const row of selectedRows) {
      await sendEmail(row);
      
    }
    Swal.showLoading();
    setSelectedRows([]);
  
    if (selectedCount > 1) {
      Swal.fire({
        icon: 'success',
        title: 'Credentials Sent successfully',
        showConfirmButton: false,
        confirmButtonColor: '#00B4D2',
        timer: 3000,
      });
    } else if (selectedCount === 1){
      Swal.fire({
        icon: 'success',
        title: 'Credentials Sent successfully',
        showConfirmButton: false,
        confirmButtonColor: '#00B4D2',
        timer: 3000,
      });
    }
  };

  return (
  
      <div className="table-container">
        <h1 style={{ color: '#00B4D2' }}> Credentials of all Candidates </h1>
        
        <div className="search-filter1">
          <input placeholder='Search here' type="text" value={searchQuery} className="search-field" onChange={(e) => setSearchQuery(e.target.value)} />
          {/* <button type="submit"><BsSearch/></button> */}
          <button className="send-button" title='send Email' style={{ padding: "6px 10px 6px 17px", visibility: "visible", color:'#fff'}} disabled={selectedRows.length === 0} onClick={handleSendEmail} >
          Send Mail
        </button>
        </div>

        <DataTable
          columns={columns}
          data={data.filter((row) =>
            row.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.confirmPassword.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          selectableRows
          onSelectedRowsChange={handleRowSelected}
          selectedRows={selectedRows}
          fixedHeader
          pagination
          paginationPerPage={10}
          className="dataTable"
          customStyles={customStyles}
        />
        <br />
        <center>
        <CSVLink data={dataToExport} className="export-csv" title='Download All records to CSV file' filename="candidates.csv">Export to CSV</CSVLink>
        <i><p style={{ color: '#00B4D2' }}> *Select an Applicant to send their credentials through Email respectively</p></i></center>
      </div>


   
  );

}

export default Credentials;