import React, { useState } from 'react';
import '../styles/Login.css';
import useAuth from "../hooks/useAuth";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";

import Swal from 'sweetalert2';
import logo from '../Assests/enfuse-logo.png';
import bgImg from '../Assests/Hire bg.jpg';

function Home() {
  const { auth, setAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [email, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async (event) => {
    event.preventDefault(); 
    const credentials = {
      email,
      password,
    };
    const baseURL = "http://localhost:5040/api/login";
    setIsLoading(true);
    axios.post(baseURL, credentials).then((response) => {
      if (response.status === 200) {
        if (response.data.role === "Admin") {
          navigate("/dashboard");
        } else if (response.data.role === "HR") {
          navigate("/dashboard");
        } else if (response.data.role === "Applicant") {
          navigate("/candidate/candidate");
        } else if (response.data.role === "Panelist") {
          navigate('/feedbacks');
        } else if (response.data.role === "Ops-Manager") {
          navigate('/dashboard');
        }
      } else {
        console.warn("check the response");
      }
      setAuth(response.data);
    })
      .catch((error) => {
        setIsLoading(false);
        if (error.response) {
          if (error.response.status === 400) {
            Swal.fire({
              title: 'Error!',
              text: 'Enter email and password',
              icon: 'error'
            });
          } else if (error.response.status === 404) {
            Swal.fire({
              title: 'Error!',
              text: 'Invalid email',
              icon: 'error'
            });
          } else if (error.response.status === 401) {
            Swal.fire({
              title: 'Error!',
              text: 'Incorrect Password',
              icon: 'error'
            });
          }
        }
      });
    navigate(from, { replace: true });
  };

  return (
    <div>
      {auth.role ?
        <h1>Welcome to {auth.role} Dashboard</h1>
        : <div>
            <div className='LoginContainer'>
              <div className='formWrapper'>
                <h2 className='customeText'>Welcome</h2>
                <br /><br /><br /><br />
                <img src={logo} alt="Enfuse Logo" />
                <form onSubmit={onLogin}>
                  <div>
                    <label>Email</label><br />
                    <input
                      type='text'
                      placeholder='Email'
                      onChange={(e) => setUserName(e.target.value)}
                      value={email}
                    />
                  </div>
                  <div>
                    <label>Password</label><br />
                    <input
                      type='password'
                      placeholder='Password'
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                    />
                  </div>
                  <button type='submit'>Login</button>
                </form>
              </div>
              <div className='bgSec'>
                <img src={bgImg} alt="Background" />
              </div>
            </div>
          </div>
      }
    </div>
  );
}

export default Home;
