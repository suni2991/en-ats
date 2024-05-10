import React from 'react'
import { useNavigate } from 'react-router-dom'
import Viewjob from '../components/Viewjob'


const Jobs = () => {
  const navigate = useNavigate();

  const handleClick = () =>{
    navigate('/postjob')
  }

  return (
    <div className="table-container">
        <div>
        <button onClick={handleClick} className="submit-button" style={{float: 'right'}}> Post a Job</button></div>
        <div><Viewjob /></div>
        
    </div>
  )
}

export default Jobs