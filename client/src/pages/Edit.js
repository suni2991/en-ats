import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import'../styles/View.css';
import Swal from "sweetalert2";


function Edit() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName:'',
    lastName: '',
    email: '',
    contact:'',
    totalExperience:'',
    relevantExperience:'',
    appliedPosition:'',
    qualification:'',
    noticePeriod:'',
    currentLocation:'',
    state:'',
    district:'',
    taluka:'',
    selectedCategory:''
  });
  const[positions, setPositions]= useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [customPosition, setCustomPosition] = useState('');
  const [customQualification, setCustomQualification] = useState('');

  const[candidate, setCandidate]=useState([]);
  let { id } = useParams();
  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const response = await fetch(`http://localhost:5040/candidate/${id}`);
        const data = await response.json();
        if (response.ok) {
          setCandidate(data.data);
          setFormData(data.data);
          if (data.data.appliedPosition && !positions.includes(data.data.appliedPosition)) {
            setPositions([...positions, data.data.appliedPosition]);
          }
          if (data.data.qualification && !qualifications.includes(data.data.qualification)) {
            setQualifications([...qualifications, data.data.qualification]);
          }
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Error fetching candidate:', error);
      }
    };
    fetchCandidate();
  }, [id, positions, qualifications]);
  
  const handleChange = async (e) => {
    const value = e.target.value;
  
    if (e.target.name === 'appliedPosition' && value === 'other') {
      setFormData((prevState) => ({
        ...prevState,
        appliedPosition: ''
      }));
  
      const { value: customValue } = await Swal.fire({
        input: 'text',
        inputLabel: 'New Job Position',
        inputPlaceholder: 'Enter New Position',
        showCloseButton: true,
        confirmButtonColor: '#00B4D2'
      });
  
      if (customValue !== null) {
        if (customValue.trim() !== '') {
          const updatedPositions = [...positions, customValue];
          setPositions(updatedPositions);
          
          setFormData((prevState) => ({
            ...prevState,
            appliedPosition: customValue,
           
          }));
          setCustomPosition(customValue); 
        }
      }
    } else if (e.target.name === 'qualification' && value === 'other') {
      setFormData((prevState) => ({
        ...prevState,
        qualification: ''
      }));
  
      const { value: customEdu } = await Swal.fire({
        input: 'text',
        inputLabel: 'New Custom Qualification',
        inputPlaceholder: 'Enter Custom Education',
        showCloseButton: true,
        confirmButtonColor: '#00B4D2'
      });


  
      if (customEdu !== null) {
        if (customEdu.trim() !== '') {
          const updatedQualification = [...qualifications, customEdu];
          setQualifications(updatedQualification);
          
          setFormData((prevState) => ({
            ...prevState,
            qualification: customEdu,
          }));
        setCustomQualification(customEdu);
        }
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: value,
      }));
    }
  };
  
  
  
  const validateForm = () => {
    let isValid = true;
    if (!formData.firstName || formData.firstName.length < 3) {
      Swal.fire({
        title: 'Error!',
        text: 'Enter Firstname of atleast 3 alphabets',
        showCloseButton: true,
        icon: 'error',
        confirmButtonColor: '#00B4D2',
        confirmButtonText: 'OK'
      })
      isValid = false;
    } else if (!/^[A-Za-z]+$/.test(formData.firstName)) {
      Swal.fire({
        title: 'Error!',
        text: 'Firstname should be of Alphabets without spaces & special Characters(!@#$%^,..)',
        icon: 'error',
        confirmButtonColor: '#00B4D2',
        confirmButtonText: 'OK'
      })
      isValid = false;
    }

    if (!formData.lastName || formData.lastName.length < 3) {
      Swal.fire({
        title: 'Error!',
        text: 'Enter Last Name of atleast 3 alphabets',
        icon: 'error',
        confirmButtonColor: '#00B4D2',
        confirmButtonText: 'OK'
      })
      isValid = false;
    } else if (!/^[A-Za-z]+$/.test(formData.lastName)) {
      Swal.fire({
        title: 'Error!',
        text: 'Lastname should be of Alphabets without spaces & special Characters(!@#$%^,..)',
        icon: 'error',
        confirmButtonColor: '#00B4D2',
        confirmButtonText: 'OK'
      })
      isValid = false;
    }

    const emailRegex =/^[a-zA-Z0-9_.+-]*[a-zA-Z][a-zA-Z0-9_.-]*@[^\s@]+\.[^\s@]+$/;;
    if (!formData.email || !emailRegex.test(formData.email)) {
      Swal.fire({
        title: 'Error!',
        text: 'Enter Valid Email',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#00B4D2'
      })
      isValid = false;
    }

    if (!formData.qualification || formData.qualification.length < 2) {
      Swal.fire({
        title: 'Error!',
        text: 'Add Qualification',
        icon: 'error',
        confirmButtonColor: '#00B4D2',
        confirmButtonText: 'OK'
      })
      isValid = false;
    }
    if (!formData.appliedPosition || formData.appliedPosition.length < 2) {
      Swal.fire({
        title: 'Error!',
        text: 'Add Qualification',
        icon: 'error',
        confirmButtonColor: '#00B4D2',
        confirmButtonText: 'OK'
      })
      isValid = false;
    }
    if (!formData.contact) {
      Swal.fire({
        title: 'Error!',
        text: 'Enter valid contact Number',
        icon: 'error',
        confirmButtonColor: '#00B4D2',
        confirmButtonText: 'OK'
      })
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.contact)) {
      Swal.fire({
        title: 'Error!',
        text: 'Enter Valid 10 - digit contact Number',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#00B4D2',
      })
      isValid = false;

    }

    
      if (!/^[A-Za-z]+$/.test(formData.currentLocation) && formData.currentLocation) {
      Swal.fire({
        title: 'Error!',
        text: 'Current Location should be of atleast 3 Alphabets',
        icon: 'error',
        confirmButtonColor: '#00B4D2',
        confirmButtonText: 'OK'
      })
      isValid = false;
    }
    return isValid;
  };


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

  const handleSubmit = async (e) => {
    
    const fullName = formData.firstName + ' ' + formData.lastName;
    
    
    const formDataWithFullName = {
      ...formData,
      fullName: fullName, 
     
  
    };
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
    try {
      const result = await axios.put(`http://localhost:5040/candidate/${id}`, formDataWithFullName);
      navigate('/hr')
      console.log(result.data);
    } catch (error) {
      console.error(error);
    }
  }
  };

  const handleRedirect = () => {
    navigate('/hr')
  }
  const resetFormData = () => {
    const randomString = Math.floor(Math.random() * 10000);
    const username = formData.firstName + "." + formData.lastName + randomString;
    
    setFormData({
      ...formData,
      status: "In Progress",
      username: username,
      psychometric: -1,
      vocabulary: -1,
      quantitative: -1,
      java: -1,
      accounts: -1,
      excel: -1,
      dateCreated:''
      
  });
}

  const handleReset = () => {
    resetFormData();
    Swal.fire({
      title: 'Scores will reset & click to Update',
      text: 'New user credentials will be generated As the applicant will be getting second chance to Attempt Tests. Hence HR need to send new credentials again to the Applicant',
      icon: 'info',
      confirmButtonColor: '#00B4D2',
      confirmButtonText: 'OK'
    })
  };
  

  return (
   <div>
    <div className='card-edit2'>
        <form>
        <h1 style={{paddingBottom: '10px',fontWeight: 'bold',textDecoration:'underline', textTransform:'capitalize', fontSize:'15px'}}>{formData.fullName}  :  {formData.selectedCategory}</h1>
        <div className="rebel">
            <div className="edit-form1">
              <label>First Name :</label><br />
              <input
                type="text"
                name="firstName"
                value={formData.firstName } onChange={handleChange}
                style={{ width: '220px' , textTransform:'capitalize'}}
                minLength={3}
              /><br />
              <label>Last Name :</label><br />
              <input
                type="text"
                name="lastName"
                value={formData.lastName } onChange={handleChange}
                style={{ width: '220px', textTransform:'capitalize' }}
                minLength={3}
              /><br />
              <label>Email :</label><br />
              <input
                type="text"
                name="email"

                value={formData.email } onChange={handleChange}
                style={{ width: '45%' }}
              /><br />
              <label>Contact :</label><br />
              <input
                type="tel"
                name="contact"
                value={formData.contact } onChange={handleChange}
                style={{ width: '140px' }}
              /><br />
             <label>Qualification</label><br />
          <select name="qualification" className="field2" value={formData.qualification} onChange={handleChange} placeholder="Enter Highest qualification">
            <option value="">Choose One</option>
            <option value="Btech">Btech</option>
            <option value="PhD">PhD</option>
            <option value="PG">PG</option>
            <option value="UG">UG</option>
            {qualifications.map((qualification, index) => (
             <option key={index} value={qualification}>{qualification}</option>
              ))}
             <option value="other">Custom Qualification</option>
          </select><br />
          <label>District :</label><br />
          <input
            type="text"
            name="district"

            value={formData.district } onChange={handleChange}
            style={{ width: '45%' }}
          /><br />
          <label>Taluka :</label><br />
              <input
                type="text"
                name="taluka"

                value={formData.taluka } onChange={handleChange}
                style={{ width: '45%' }}
              /><br />
              <label>State :</label><br />
              <input
                type="text"
                name="state"

                value={formData.state } onChange={handleChange}
                style={{ width: '45%' }}
              /><br />
              <label>Total Experience :</label><br />
              <input
                type="text"
                name="totalExperience"
                value={formData.totalExperience } onChange={handleChange}
                style={{ width: '100px' }}
                maxLength={5}
              /><br />
              <label>Relevant Experience :</label><br />
              <input
                type="text"
                name="relevantExperience"
                value={formData.relevantExperience } onChange={handleChange}
                maxLength={5}
                style={{ width: '75px' }}
              /><br />
            </div>
            <div className="edit-form1">
             
             
            <label>Current Location :</label><br />
              <input
                type="text"
                name="currentLocation"
                value={formData.currentLocation } onChange={handleChange}
                style={{ width: '125px' }}
              /><br />
              <label>Notice Period :</label><br />
              <select style={{width: '150px'}} type="text" name="noticePeriod" value={formData.noticePeriod } onChange={handleChange}>
              <option value="">Choose One</option>
              <option value="Immediatejoiner">Immediate Joiner</option>
              <option value="Lessthan30days">Less than 30days</option>
              <option value="Lessthan45days">Less than 45days</option>
              <option value="Morethan45days">More than 45 days</option>
            </select>
            <br/>
            <label>Applied Position</label><br />
          <select name="appliedPosition" className="field2" onChange={handleChange} value={formData.appliedPosition}>
            <option value="">Choose One</option>
            <option value="Accounting">Accounting</option>
            <option value="IT">IT</option>
            <option value="Sales">Sales</option>
            <option value="Developer">Developer</option>
            {positions.map((position, index) => (
             <option key={index} value={position}>{position}</option>
              ))}
             <option value="other">Custom Position</option>
          </select><br />
            <label>Status :</label>
            <select
              name="status"
              value={formData.status }
              onChange={handleChange}
              style={{ width: '500px' }}
            >
              <option value="">Choose One</option>
              <option value="In Progress">In Progress</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
              <option value="Onboarded">Onboarded</option>
            </select>
            <br />

            
            <label>Quantitative Test :</label><br />
            <input
              type="text"
              name="quantitative"
              value={formData.quantitative !== -1 ? formData.quantitative : 0} 
              onChange={handleChange}
            /><br />
            <label>Vocabulary Test:</label><br />
            <input
              type="text"
              name="vocabulary"
              value={formData.vocabulary !== -1 ? formData.vocabulary : 0}
              onChange={handleChange}
            /><br/>
            {formData.selectedCategory === 'Technical' &&(
              <div>
            <label>Psychometric Test :</label><br />
            <input
              type="text"
              name="psychometric"
              value={formData.psychometric !== -1 ? formData.psychometric : 0}
              onChange={handleChange}
            /><br />
            <label>Java Test:</label><br />
            <input
              type="text"
              name="java"
              value={formData.java !== -1 ? formData.java : 0}
              onChange={handleChange}
            />
            </div>
            )}
            {formData.selectedCategory === 'Non-Technical' &&(
              <div>
              <label>Accounts Test :</label><br />
              <input
                type="text"
                name="accounts"
                value={formData.accounts !== -1 ? formData.accounts : 0}
                onChange={handleChange}
              /><br />
              <label>Excel Test:</label><br />
              <input
                type="text"
                name="excel"
                value={formData.excel !== -1 ? formData.excel : 0}
                onChange={handleChange}
                />
              </div>
              )}
            <br />
            
            <label>Test Submitted On:</label> <br />
            <input
              type="text"
              name="dateCreated"
              value={formData.dateCreated }
              onChange={handleChange}
            />
            </div>
            <br />
            
          </div>
          
          <div>
           
            <div className="button-container2">
            <button className='submit-button'  onClick={handleRedirect} type="submit">Back</button>
            <button className='submit-button'  onClick={handleReset} type="reset">Reset</button>
            <button className='submit-button' onClick={handleSubmit} style={{ float: 'right' }} type="submit">Update</button>
            </div>
          </div>
        </form>
      </div>
    </div>
    
  );
}

export default Edit;