import React from 'react'
import { useNavigate } from 'react-router-dom'
import Viewjob from '../components/Viewjob'
import { Tooltip } from 'antd';


const Jobs = () => {
  const navigate = useNavigate();

  const handleClick = () =>{
    navigate('/postjob')
  }

  return (
    <div className="table-container">
        <div>
        <Tooltip title="Post a Job" color='cyan'><button onClick={handleClick} className="submit-button" style={{float: 'right'}}> + Job</button></Tooltip></div>
        <div><Viewjob /></div>
        
    </div>
  )
}

export default Jobs