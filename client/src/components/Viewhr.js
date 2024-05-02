import React from 'react'
import Fetchtable from './Fetchtable'

const Viewhr = () => {
  const userColumns = [
    { 
      name: 'Date',
      selector: (row) => {
        const date = new Date(row.createdAt);
        const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        return formattedDate;
      },
      sortable: true
    },
    { name: 'Name', selector: (row) => row.fullName, sortable: true },
    { name: 'Email', selector: (row) => row.email, sortable: true },
    {name: 'Password', selector: (row) => row.confirmPassword, sortable: true},
    {name: 'No. of Employees', selector: (row) => row.empCount, sortable: true},
    
    { name: 'Location', selector: (row) => row.currentLocation, sortable: true },
    
   
];

  return (
    <div><h1>Viewhr</h1>
      <Fetchtable 
      url="http://localhost:5040/hrs"
                columns={userColumns} 
      />
    </div>
  )
}

export default Viewhr