import React, { useState, useEffect } from 'react';
import '../styles/Panelist.css'
import Swal from 'sweetalert2'
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Panelist = () => {
  const [candidateData, setCandidateData] = useState({})
  const [formData, setFormData] = useState({
    position:'',
    fullName:'',
    totalExperience:'',
    noticePeriod:'',
    panelistName:'',
    round:'',
    aem:'',
    aemasCloud:'',
    java:'',
    services:'',
    osgi:'',
    slingModel:'',
    template:'',
    general:'',
    communication:''
  });
  const [rating,setRating] = useState({
    aem:0,
    aemasCloud:0,
    java:0,
    services:0,
    osgi:0,
    slingModel:0,
    template:0,
    general:0,
    communication:0
  })
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
        // Prefill the form
        setFormData({
          position: data.data.position,
          fullName: data.data.fullName,
          totalExperience: data.data.totalExperience,
          noticePeriod: data.data.noticePeriod,
          panelistName: data.data.panelistName,
          round: data.data.round,
          aem: '',
          aemasCloud: '',
          java: '',
          services: '',
          osgi: '',
          slingModel: '',
          template: '',
          general: '',
          communication: '',
        });
      }
    } catch (error) {
      console.error('Error fetching candidate details:', error);
    }
  };



  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.position) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter Role',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      return
    }else if (!formData.fullName) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter Candidate Name',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      return
    }else if (!formData.totalExperience) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter Experience',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      return
    }else if (!formData.noticePeriod) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter Notice Period',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      return
    }else if (!formData.panelistName) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter Panelist Name',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      return
    }else if (!formData.round) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter Round',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      return
    }else if (isEvaluation!==true) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter Please provide evaluation details',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      return
    }else if (!formData.aem) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter AEM',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      return
    }else if (!formData.aemasCloud) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter AEMasCloud',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      return
    }else if (!formData.java) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter Java',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      return
    }else if (!formData.services) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter savolate/services',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      return
    }else if (!formData.osgi) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter OSGi',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      return
    }else if (!formData.slingModel) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter Sling Model',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      return
    }else if (!formData.template) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter Template',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      return
    }else if (!formData.general) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter General',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      return
    }else if (!formData.communication) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter Communication',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      return
    }    
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
      {isEvaluation?<table className='panelistTable'>
        <tr>
          <td>skills</td>
          <td>Rating ouf of 5</td>
          <td>Notes</td>
        </tr>
        <tr>
          <td>AEM</td>
          <td>
            <div className='ratingWraper'>
            {rIterator.map((elem,Idx)=>{
              return <i key={Idx} className={`bi ${Idx+1<=rating.aem?'bi-star-fill':'bi-star'}`} onClick={()=>setRating({...rating,aem:Idx+1})} ></i>
            })}
            </div>
            </td>
          <td><input type='text' onChange={(e)=>setFormData({...formData,aem:e.target.value})} /></td>
        </tr>
        <tr>
          <td>AEMasCloud</td>
          <td> <div className='ratingWraper'>
            {rIterator.map((elem,Idx)=>{
              return <i key={Idx} className={`bi ${Idx+1<=rating.aemasCloud?'bi-star-fill':'bi-star'}`} onClick={()=>setRating({...rating,aemasCloud:Idx+1})} ></i>
            })}
            </div></td>
          <td><input type='text' onChange={(e)=>setFormData({...formData,aemasCloud:e.target.value})} /></td>
        </tr>
        <tr>
          <td>Java</td>
          <td> <div className='ratingWraper'>
            {rIterator.map((elem,Idx)=>{
              return <i key={Idx} className={`bi ${Idx+1<=rating.java?'bi-star-fill':'bi-star'}`} onClick={()=>setRating({...rating,java:Idx+1})} ></i>
            })}
            </div></td>
          <td><input type='text' onChange={(e)=>setFormData({...formData,java:e.target.value})} /></td>
        </tr>
        <tr>
          <td>savolate/services</td>
          <td> <div className='ratingWraper'>
            {rIterator.map((elem,Idx)=>{
              return <i key={Idx} className={`bi ${Idx+1<=rating.services?'bi-star-fill':'bi-star'}`} onClick={()=>setRating({...rating,services:Idx+1})} ></i>
            })}
            </div></td>
          <td><input type='text' onChange={(e)=>setFormData({...formData,services:e.target.value})} /></td>
        </tr>
        <tr>
          <td>OSGi</td>
          <td> <div className='ratingWraper'>
            {rIterator.map((elem,Idx)=>{
              return <i key={Idx} className={`bi ${Idx+1<=rating.osgi?'bi-star-fill':'bi-star'}`} onClick={()=>setRating({...rating,osgi:Idx+1})} ></i>
            })}
            </div></td>
          <td><input type='text' onChange={(e)=>setFormData({...formData,osgi:e.target.value})} /></td>
        </tr>
        <tr>
          <td>Sling Model</td>
          <td> <div className='ratingWraper'>
            {rIterator.map((elem,Idx)=>{
              return <i key={Idx} className={`bi ${Idx+1<=rating.slingModel?'bi-star-fill':'bi-star'}`} onClick={()=>setRating({...rating,slingModel:Idx+1})} ></i>
            })}
            </div></td>
          <td><input type='text' onChange={(e)=>setFormData({...formData,slingModel:e.target.value})} /></td>
        </tr>
        <tr>
          <td>Static / editalbe Template</td>
          <td> <div className='ratingWraper'>
            {rIterator.map((elem,Idx)=>{
              return <i key={Idx} className={`bi ${Idx+1<=rating.template?'bi-star-fill':'bi-star'}`} onClick={()=>setRating({...rating,template:Idx+1})} ></i>
            })}
            </div></td>
          <td><input type='text' onChange={(e)=>setFormData({...formData,template:e.target.value})} /></td>
        </tr>
        <tr>
          <td>General</td>
          <td> <div className='ratingWraper'>
            {rIterator.map((elem,Idx)=>{
              return <i key={Idx} className={`bi ${Idx+1<=rating.general?'bi-star-fill':'bi-star'}`} onClick={()=>setRating({...rating,general:Idx+1})} ></i>
            })}
            </div></td>
          <td><input type='text' onChange={(e)=>setFormData({...formData,general:e.target.value})}/></td>
        </tr>
        <tr>
          <td>Communications</td>
          <td><div className='ratingWraper'>
            {rIterator.map((elem,Idx)=>{
              return <i key={Idx} className={`bi ${Idx+1<=rating.communication?'bi-star-fill':'bi-star'}`} onClick={()=>setRating({...rating,communication:Idx+1})} ></i>
            })}
            </div></td>
          <td><input type='text' onChange={(e)=>setFormData({...formData,communication:e.target.value})} /></td>
        </tr>
      </table>:null}
      <div id='panelistbtn' onClick={handleSubmit}><button>Submit</button></div>
    </div>
  );
};

export default Panelist;
