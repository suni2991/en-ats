import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const LogoutTimer = ({initialTimer}) => {
  const [timer, setTimer] = useState(initialTimer);
  const navigate=useNavigate()
  useEffect(() => {
    const logoutTimer = setInterval(() => {
      setTimer(timer - 1);
      if (timer === 0) {
        clearInterval(logoutTimer);
        Swal.fire({
          icon: 'error',
          title: 'Your Time is Over',
          showConfirmButton: false,
          confirmButtonColor: '#00B4D2',
          timer: 3000
        })
       navigate('/candidate/candidate')
      }
    }, 1000);

    return () => clearInterval(logoutTimer);
  }, [navigate,timer]);
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  return (
    <div className='logout' style={{fontSize: "20px", color: "white", fontWeight: "bolder"}}>
      <center><h2>Time Left: {minutes}:{seconds} MM:SS</h2></center>
    </div>
)};

export default LogoutTimer;