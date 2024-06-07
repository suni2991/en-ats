import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/View.css'
import { FadeLoader } from 'react-spinners';

function View() {
  const [candidate, setCandidate] = useState();
  const navigate = useNavigate();
  let { id } = useParams();

  let date = 'Not attempted';
  let time = '';
  if (candidate && candidate.dateCreated) {
    const dateObj = new Date(candidate.dateCreated);
    date = dateObj.toLocaleDateString();
    time = dateObj.toLocaleTimeString();
  }

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const response = await fetch(`http://localhost:5040/candidate/${id}`);
        const data = await response.json();
        if (response.ok) {
          setCandidate(data.data);
                } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Error fetching candidate:', error);
      }
    };
    fetchCandidate();
  }, [id]);

  const handleRedirect=()=>{
    navigate('/hr')
  }
  if (!candidate) {
    return <div style={{margin: "250px auto"}}><center><FadeLoader color={"#00B4D2"} size={20} margin={2} /></center></div>;
  }
  return (
    <div className='card-edit'>
    <div className='card-edit-image-info'>
    <h1 style={{color: '#28325A'}}>{candidate.fullName} : {candidate.selectedCategory}</h1><br/>
      <p><b>First Name :</b> {candidate.firstName}</p>
      <p><b>Last Name :</b> {candidate.lastName}</p>
      <p><b>Email : </b> {candidate.email}</p>
      <p><b>Contact : </b>{candidate.contact}</p>
      <p><b>District : </b>{candidate.district}</p>
      <p><b>Taluka : </b>{candidate.taluka}</p>
      <p><b>State : </b>{candidate.state}</p>
      <p><b>Qualification : </b>{candidate.qualification}</p>
      <hr/>
      <p><b>Position : </b>{candidate.position}</p>
      <p><b>Notice Period : </b>{candidate.noticePeriod}</p>
      <p><b>Total Experience : </b>{candidate.totalExperience} years</p>
      <p><b>Relevant Experience : </b>{candidate.relevantExperience} years</p>
      <p><b>Username : </b>{candidate.username}</p>
      <p><b>Password : </b>{candidate.confirmPassword}</p>
      <hr/>
      {candidate.selectedCategory === 'Technical' && (
        <div>
      <p><b>Quantitative Test : </b>{candidate.quantitative !== -1 ? candidate.quantitative : 0}  <i>out of 10</i></p> 
      <p><b>Vocabulary Test : </b>{candidate.vocabulary !== -1 ? candidate.vocabulary : 0}  <i>out of 10</i></p> 
    
      <p><b>Java Test : </b>{candidate.java !== -1 ? candidate.java : 0}  <i>out of 15</i></p> 
      <p><b>Psychometric Test : </b>{candidate.psychometric !== -1 ? candidate.psychometric : 0}  <i>out of 10</i></p>
      </div>
    )}
    
    {candidate.selectedCategory === 'Non-Technical' && (
      <div>
    <p><b>Quantitative Test : </b>{candidate.quantitative !== -1 ? candidate.quantitative : 0}  <i>out of 10</i></p> 
    <p><b>Vocabulary Test : </b>{candidate.vocabulary !== -1 ? candidate.vocabulary : 0}  <i>out of 10</i></p> 
  
      <p><b>Accounts Test : </b>{candidate.accounts !== -1 ? candidate.accounts : 0}  <i>out of 15</i></p> 
      <p><b>Excel Test : </b>{candidate.excel !== -1 ? candidate.excel: 0}  <i>out of 15</i></p> 
      </div>
      )}
      <p><b>Test Taken : </b>{date}  {time} </p> <br/>
      <h2 style={{color: 'Green', fontSize:'18px'}}>Status : {candidate.status || "In Progress"} </h2>
      </div>
      <div className='back-button-container'>
        <button className='submit-button' onClick={handleRedirect} type="submit">BACK</button>
    </div>
    </div>
   
   
  );
}

export default View;


