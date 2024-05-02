import React from 'react'
import { useNavigate } from 'react-router-dom';
// import Viewhr from '../components/Viewhr';

const Admin = () => {

  const navigate = useNavigate();

  const handleClick = () =>{
    navigate('/create-hr')
  }

  return (
    <div className='table-container'>Create HR Users & can view All HR credentials
    <div> <button onClick={handleClick}>Create HR User</button>
    </div>
    </div>
   
   
  )
}

export default Admin;