import React from 'react';
import logos from '../Assests/enfuse-logo.png';

function Thankyou() {
  return (
    <div className='quiz-container'  style={{margin: '200px auto'}}>
        <center>
        <img src={logos} alt="Company Logo" style={{padding:'20px' , width:'15%'}}/>
        <br/>
        <h1 style={{color:'#020542dc'}}>Thanks for showing Interest in Joining <br /><span style={{color:'#00B4D2', fontSize:'25px'}}
        >EnFuse Solutions</span><br /> Your Assessment has been Completed <br/>& <br /> We will get back to you once shortlisted</h1>
        <br />
        <h1 style={{color:'red'}}>Please Close the Window</h1>
        </center>
    </div>
  )
}

export default Thankyou