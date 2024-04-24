import { React, useState } from 'react'
import '../styles/Login.css';
import useAuth from "../hooks/useAuth";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import login from '../Assests/Hire bg.jpg'
import { FadeLoader } from "react-spinners";
import Swal from 'sweetalert2';


function Home() {
  const { auth } = useAuth();
  const { setAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);


  let navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [email, setUserName] = useState("");
  const [password, setPassword] = useState("");


  const onLogin = async () => {
    const credentials = {
      email,
      password,

    };
    const baseURL = "http://localhost:5040/api/login"
    setIsLoading(true);
    axios.post(baseURL, credentials).then((response) => {

      if (response.status === 200) {

        if (response.data.role === "Admin") {
          navigate("/admin");
        } else if (response.data.role === "Hr") {
          navigate("/hr");
        } else if (response.data.role === "Candidate") {
          navigate("/candidate/candidate");
        }
      }
      else { console.warn("check the response") }
      setAuth(response.data)
    })
      .catch((error) => {
        setIsLoading(false);
        if (error.response) {
          if (error.response.status === 400) {
            Swal.fire({
              title: 'Error!',
              text: 'Enter email and password',
              icon: 'error'
            })
          } else if (error.response.status === 404) {
            Swal.fire({
              title: 'Error!',
              text: 'Invalid email',
              icon: 'error'
            })
          } 
          else if (error.response.status === 401) {
            Swal.fire({
              title: 'Error!',
              text: 'Incorrect Password',
              icon: 'error'
            })}
          }
      });
    navigate(from, { replace: true });
  }


  return (
    <div>


      {auth.role ?
        <h1> Welcome to {auth.role} Dashboard</h1>
        : <div className='logincontainer'>
            <center>
                <div className='column2'>
                  <form>
                    <div className='form-container'>
                      <div className='column1'>
                          <img src={login} alt="login" />
                      </div>
                      <div className='column3'>
                          <h1>User Login</h1>
                          <input type="text" className="login-field1"
                            placeholder="Email"
                            onChange={(e) => setUserName(e.target.value)} />
                          <input type="password" className="login-field1" placeholder="Password" onChange={(e) => { setPassword(e.target.value); }} 
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {onLogin();}
                              }}
                          />
                          <div className='login-butt-cont'>
                              <button className="submit-button1" type="button" onClick={onLogin}>LOGIN</button>
                                      {isLoading ? ( 
                              <FadeLoader color={"#00B4D2"} size={20} margin={2} />
                               ) : (
                                     "")}
                          </div>
                      </div>
                    </div>
                  </form >
                </div>
          </center>
        </div>}


    </div>
  )
}

export default Home
