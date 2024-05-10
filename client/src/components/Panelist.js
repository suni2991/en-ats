import React, { useState, useEffect } from 'react';
import '../styles/Panelist.css'
import Swal from 'sweetalert2'
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Panelist = () => {
  const [candidateData, setCandidateData] = useState({})
  const [skills, setSkills] = useState([]);
  const [rating, setRating] = useState([])
  const [formData, setFormData] = useState({
    position:'',
    fullName:'',
    totalExperience:'',
    noticePeriod:'',
    panelistName:'',
    round:'',
   
  });
  
  const rIterator = ['@','#','$','%','&'];
  const [isEvaluation,setIsEvaluation] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const { id } = useParams();
  useEffect(() => {
    fetchCandidateDetails();
  }, []);

  const fetchCandidateDetails = async () => {
    try {
      
      const response = await axios.get(`http://localhost:5040/candidate/${id}`);
      const data = response.data;
      if (data.status === "SUCCESS") {
        setCandidateData(data.data);
        
        setFormData({
          position: data.data.position,
          fullName: data.data.fullName,
          totalExperience: data.data.totalExperience,
          noticePeriod: data.data.noticePeriod,
          panelistName: data.data.panelistName,
          round: data.data.round,
        });
        const skillsData = data.data.skills.map(skill => skill.name);
      setSkills(skillsData);
      }
    } catch (error) {
      console.error('Error fetching candidate details:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Show a confirmation dialog before submitting
    Swal.fire({
      title: "Submit your Final Feedback",
      input: "text",
      inputAttributes: {
        autocapitalize: "off"
      },
      showCancelButton: true,
      confirmButtonText: "Submit",
      showLoaderOnConfirm: true,
      preConfirm: async (status) => {
        try {
          // Prepare skills array with ratings and comments
          const skillsArray = skills.map(skill => {
            const lowercaseSkill = skill && skill.toLowerCase(); // Null check for skill
            return {
              name: skill,
              rating: rating[lowercaseSkill] || 0,
              comments: formData[`${lowercaseSkill}Comments`] || "No comments",
            };
          });
  
          // Send PUT request to update candidate details
          const response = await axios.put(`http://localhost:5040/evaluate/${id}`, {
            skills: skillsArray,
            status: status,
            evaluationDetails: true, // Include finalFeedback in the request body
          });
  
          return response.data; // Assuming your backend returns some response data
        } catch (error) {
          Swal.showValidationMessage(`Error submitting feedback: ${error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Feedback Submitted!",
          text: result.value.message, // Display any message from your backend
          icon: "success"
        });
      }
    });
  };
  
  

  return (
    <div className='table-container'>
      <h1>Interview Feedback Form</h1>
 
      <table className='panelistTable'>
      <tr>
      <td>Role</td>
      <td><input type='text' value={formData.position} onChange={handleChange} name='position' /></td>
    </tr>
    <tr>
      <td>Candidate Name</td>
      <td><input type='text' value={formData.fullName} onChange={handleChange} name='fullName' /></td>
    </tr>
    <tr>
      <td>Experience</td>
      <td><input type='text' value={formData.totalExperience} onChange={handleChange} name='totalExperience' /></td>
    </tr>
    <tr>
      <td>Availability / Notice Period</td>
      <td><input type='text' value={formData.noticePeriod} onChange={handleChange} name='noticePeriod' /></td>
    </tr>
    <tr>
      <td>Panelist Name</td>
      <td><input type='text' value={formData.panelistName} onChange={handleChange} name='panelistName' /></td>
    </tr>
    <tr>
      <td>Round</td>
      <td><input type='text' value={formData.round} onChange={handleChange} name='round' /></td>
    </tr>
      </table>
      <div id='evolution'>Evaluation Details <span onClick={()=>setIsEvaluation(true)}>+</span></div>
      {isEvaluation && skills.length > 0 ? (
        <table className='panelistTable'>
          <thead>
            <tr>
              <th>Skills</th>
              <th>Rating out of 5</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
          {skills.map((skill, index) => (
            <tr key={index}>
              <td>{skill}</td>
              <td>
                <div className='ratingWrapper'>
                  {rIterator.map((elem, idx) => (
                    <i
                      key={idx}
                      className={`bi ${
                        idx + 1 <= (skill && rating[skill.toLowerCase()]) ? 'bi-star-fill' : 'bi-star'
                      }`}
                      onClick={() =>
                        setRating({
                          ...rating,
                          [skill && skill.toLowerCase()]: idx + 1,
                        })
                      }
                    ></i>
                  ))}
                </div>
              </td>
              <td>
                <input
                  type='text'
                  value={(skill && formData[`${skill.toLowerCase()}Comments`]) || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [skill && `${skill.toLowerCase()}Comments`]: e.target.value,
                    })
                  }
                />
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      ) : null}
      

      <div id='panelistbtn' onClick={handleSubmit}><button>Submit</button></div>
    </div>
  );
};

export default Panelist;
