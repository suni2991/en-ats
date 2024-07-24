import React, { useState } from "react";
import "../styles/Login.css";
import useAuth from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import logo from "../Assests/enfuse-logo.png";
import bgImg from "../Assests/Hire bg.jpg";

const URL = process.env.REACT_APP_API_URL;

function Home() {
  const { auth, setAuth, token, setToken } = useAuth();
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
    
    setIsLoading(true);
    axios
      .post(`${URL}/api/login`, credentials)
      .then((response) => {
        if (response.status === 200) {
          switch (response.data.role) {
            case "Admin":
            case "HR":
            case "Ops-Manager":
              navigate("/dashboard");
              break;
            case "Applicant":
              navigate("/candidate/candidate");
              break;
            case "Panelist":
              navigate("/feedbacks");
              break;
            default:
              navigate("/");
          }
          
        } else {
          console.warn("check the response");
        }
        setToken(response.data.token);
        setAuth(response.data);
        
      })
      .catch((error) => {
        setIsLoading(false);
        
        if (error.response) {
          switch (error.response.status) {
            case 400:
              Swal.fire({
                title: "Error!",
                text: "Enter email and password",
                icon: "error",
              });
              break;
            case 404:
              Swal.fire({
                title: "Error!",
                text: "Invalid email",
                icon: "error",
              });
              break;
            case 401:
              Swal.fire({
                title: "Error!",
                text: "Incorrect Password",
                icon: "error",
              });
              break;
            default:
              Swal.fire({
                title: "Error!",
                text: "An unknown error occurred",
                icon: "error",
              });
          }
        }
      });
    navigate(from, { replace: true });
  };

  return (
    <div>
      {auth.role ? (
        <h1>Welcome to {auth.role} Dashboard</h1>)
      
        :( <div>
            <div className='LoginContainer'>
              <div className='formWrapper'>
                <h2 className='customeText'>Welcome</h2>
                <br /><br /><br /><br />
                <img src={logo} alt="Enfuse Logo" />
                <form onSubmit={onLogin}>
                  <div>
                    <label>Email</label>
                    <input
                      type='text'
                      placeholder='Email'
                      onChange={(e) => setUserName(e.target.value)}
                      value={email}
                    />
                  </div>
                  <div>
                    <label>Password</label>
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
      )}
    </div>
  );
}

export default Home;
