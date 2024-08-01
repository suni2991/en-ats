import React from 'react';
import { useSpring, animated } from 'react-spring';
import { useNavigate } from 'react-router-dom';
import '../styles/WelcomePage.css'; // Assuming you'll style your component here
import logo from "../Assests/enfuse-logo.png";

const WelcomePage = () => {
  const navigate = useNavigate();

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 }
  });


  const handleExplore = () => {
    navigate('/explore');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <animated.div style={fadeIn} className="welcome-page">
     
      <div className="welcome-container">
      <img src={logo} alt="Company Logo" width={'40%'} style={{padding:'20px'}}/>
        <h1 className="app-name">Candidate Tracking System</h1>
        <p className="app-description">
          Your all-in-one solution for managing candidates efficiently and effectively.
        </p>
        <div className="button-group">
          <button className="explore-button" onClick={handleExplore}>Explore Jobs</button>
          <button className="login-button" onClick={handleLogin}>Login</button>
        </div>
      </div>
      
    </animated.div>
  );
};

export default WelcomePage;
