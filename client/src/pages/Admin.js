import React from 'react'
import { useNavigate } from 'react-router-dom';
import Fetchtable from '../components/Fetchtable';
// import Viewhr from '../components/Viewhr';

const Admin = () => {


  const userColumns = [
    
    { name: 'Name', selector: (row) => row.fullName, sortable: true },
    { name: 'Email', selector: (row) => row.email, sortable: true },
    { name: 'Password', cell: (row) => row.confirmPassword, sortable: true },
    { name: 'Role', selector: (row) => row.role, sortable: true },
  ];
  const navigate = useNavigate();

  const handleClick = () =>{
    navigate('/create-hr')
  }

  return (
    <div className='table-container'>
    <div className='topContainer'><button className="submit-button" style={{float: 'right'}} onClick={handleClick}>Create User</button>
    </div>
    <div>
    <h1>Create a User & View the details of User</h1>
    <Fetchtable 
    url={`http://localhost:5040/hrs`}
    columns={userColumns}
    />
    </div>
    </div>
   
   
  )
}

export default Admin;