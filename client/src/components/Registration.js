
import { useState, useEffect } from 'react';
import '../styles/Applicant.css';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Swal from 'sweetalert2'
import axios from 'axios';
import HrDropdown from './HrDropdown';
import { Radio, Button} from 'antd';

function Registration() {
  const navigate = useNavigate()
  const auth = useAuth();
  const [positions, setPositions] = useState([]);
  const [qualifications, setQualifications] = useState([])
  const [customPosition, setCustomPosition] = useState([]);
  const [customQualification, setCustomQualification] = useState([]);
  ;
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [stateSuggestions, setStateSuggestions] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    totalExperience: '',
    relevantExperience: '',
    noticePeriod: '',
    qualification: '',
    contact: '',
    email: '',
    position: '',
    currentLocation: '',
    selectedCategory:'',
    image: '',
    resume: '',
    mgrName: '',
    mgrEmail: '',
  })

  const [selectedHrName, setSelectedHrName] = useState('');
  const [selectedHrEmail, setSelectedHrEmail] = useState('');

  const handleSelectHr = (fullName, email) => {
    setSelectedHrName(fullName);
    setSelectedHrEmail(email);
  };
  


  const statesList = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Lakshadweep',
    'Delhi',
    'Puducherry',
    'Jammu and Kashmir',
    'Ladakh'
  ];

  const handleSelectState = (selectedState) => {
    
    setFormData((prevState) => ({
      ...prevState,
      state: selectedState,
    }));
    const updatedStateSuggestions = stateSuggestions.filter(
      (state) => state !== selectedState
    );
    setStateSuggestions(updatedStateSuggestions);
    setShowSuggestions(false); 
  };

  const validateForm = () => {
    let isValid = true;

    if (!formData.firstName) {
      Swal.fire({
        title: 'Error!',
        text: 'Enter Firstname',
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

    if (!formData.lastName) {
      Swal.fire({
        title: 'Error!',
        text: 'Enter Last Name',
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
if (!/^[A-Za-z]+$/.test(formData.currentLocation) && formData.currentLocation) {
      Swal.fire({
        title: 'Error!',
        text: 'Current Location should be of Alphabets',
        icon: 'error',
        confirmButtonColor: '#00B4D2',
        confirmButtonText: 'OK'
      })
      isValid = false;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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


    if (!formData.qualification || formData.qualification.length < 2) {
      Swal.fire({
        title: 'Error!',
        text: 'Add Custom Qualification',
        icon: 'error',
        confirmButtonColor: '#00B4D2',
        confirmButtonText: 'OK'
      })
      isValid = false;
    }

    if (!formData.position || formData.position.length < 2) {
      Swal.fire({
        title: 'Error!',
        text: 'Add Custom Position',
        icon: 'error',
        confirmButtonColor: '#00B4D2',
        confirmButtonText: 'OK',
        showCloseButton: true,
      })
      isValid = false;
    }

    const expRegex = /^\d{0,5}(\.\d{0,2})?$/;
    if (!expRegex.test(formData.totalExperience) || !expRegex.test(formData.relevantExperience)) {

      if (parseInt(formData.relevantExperience) > parseInt(formData.totalExperience)) {
        Swal.fire({
          title: 'Error!',
          text: 'Relevant Experience should be of numbers only & less than or equal to Total Experience',
          icon: 'error',
          confirmButtonColor: '#00B4D2',
          confirmButtonText: 'OK'
        })
        isValid = false;
      }
    }
    
    return isValid;
  };

  useEffect(() => {
    fetchJobPositions(); 
  }, []);

  const fetchJobPositions = async () => {
    try {
      const response = await axios.get('http://localhost:5040/viewjobs'); 
      const jobPositions = response.data;
      setPositions(jobPositions);
    } catch (error) {
      console.error('Error fetching job positions:', error);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    if (e.target.name === 'image' || e.target.name === 'resume') {

      const uploadFormData = new FormData();
      uploadFormData.append(e.target.name, e.target.files[0], e.target.files[0].name);
      const uploadEndpoint = e.target.name;

      const response = await fetch("http://localhost:5040/upload/" + uploadEndpoint, {
        method: 'POST',
        body: uploadFormData
      })
      if (!response.ok) {
        
        console.error("Image upload failed with status code", response.status);
        
      } else {
        
        console.log("Image uploaded successfully");
        
      }
      const data = await response.json();
      console.log(data);


      setFormData(() => ({
        ...formData,
        [e.target.name]: data["uploadedFile"]
      }));
    } else {
      const value = e.target.value;
      if (e.target.name === 'position' && value === 'other') {
        setFormData((prevState) => ({
          ...prevState,
          position: ''
        }));
  
        const { value: customValue } = await Swal.fire({
          input: 'text',
          inputLabel: 'Custom Applied Position',
          inputPlaceholder: 'Enter custom Applied Position',
          showCloseButton: true,
          confirmButtonColor: '#00B4D2'
        });
  
        if (customValue !== undefined) {
          if (customValue.trim() !== '') {
            if (!positions.includes(customValue)) {
              const updatedPositions = [...positions, customValue];
              setPositions(updatedPositions);
            }
            setFormData((prevState) => ({
              ...prevState,
              position: customValue,
            }));
            setCustomPosition(customValue);
          } 
        } 
      }
      else if (e.target.name === 'qualification' && value === 'other') {
        const { value: customQualification } = await Swal.fire({
          input: 'text',
          inputLabel: 'Custom Qualification',
          inputPlaceholder: 'Enter New Qualification',
          showCloseButton: 'true',
          confirmButtonColor: '#00B4D2'
        });
  
        if (customQualification !== undefined) {
          if (customQualification.trim() !== '') {
            if (!qualifications.includes(customQualification)) {
              const updatedQualification = [...qualifications, customQualification];
              setQualifications(updatedQualification);
            }
            setFormData((prevState) => ({
              ...prevState,
              qualification: customQualification,
            }));
            setCustomQualification(customQualification);
          } 
        } 
      } else {
        setFormData((prevState) => ({
          ...prevState,
          [e.target.name]: value,
        }));
      };
      if (e.target.name === 'state') {
        const filteredStates = statesList.filter((state) =>
          state.toLowerCase().startsWith(value.toLowerCase())
        );
        setStateSuggestions(filteredStates.slice(0, 1));
      }
      const { name, type, checked } = e.target;
      if (type === 'radio' && checked) {
        setFormData((prevState) => ({
          ...prevState,
          selectedCategory: value,
        }));
      }
      if (e.target.name === 'mgrName') {
        setFormData((prevState) => ({
          ...prevState,
          mgrName: e.target.value,
        }));
      }

    }}

  const handleSubmit = async (e) => {
    e.preventDefault();
    const randomNumber = Math.floor(Math.random() * 10000);
    const fullName = formData.firstName + ' ' + formData.lastName;
    const username = formData.firstName + '.' + formData.lastName + randomNumber
    const password = Math.random().toString(36).slice(-8);
    const createdAt = new Date();
   
    
    const formDataWithFullName = {
      ...formData,
      fullName: fullName,
      username: username,
      password: password,
      confirmPassword: password,
      createdAt: createdAt,
      mgrName: selectedHrName, 
      mgrEmail: selectedHrEmail,
      
    };
    const isValid = validateForm();
    if (isValid) {
      const response = await fetch('http://localhost:5040/register/candidate', {
        method: 'POST',
        body: JSON.stringify(formDataWithFullName),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json();
      console.log(data);
      const emailData = {
        role: data.role,
        confirmPassword: data.confirmPassword,
        email: data.email,
        fullName: data.fullName,
      };

      const emailResponse = await axios.post('http://localhost:5040/user/register', emailData);
      console.log(emailResponse.data);
      if (response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Applicant saved successfully',
          showConfirmButton: false,
          timer: 3000,
          confirmButtonText: 'OK'
        })
        auth.empCount += 1;
        navigate('/hr')
      } else if (response.status === 409) {
        Swal.fire({
          icon: 'error',
          title: 'Email or Username already in use',
          showConfirmButton: false,
          confirmButtonColor: '#00B4D2',
          confirmButtonText: 'OK',
          timer: 3000
        })

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          showConfirmButton: false,
          confirmButtonColor: '#00B4D2',
          timer: 3000
        })
      }
    }
  }


  return (
    <div >
      <div>
      
      <form onSubmit={handleSubmit}>
     
        <div className='reg-container'>
        
        <div className='col1'>
        <div>
        <label>Category</label><br />
        <Radio.Group onChange={handleChange}>
  <Radio
    className="custom-radio" // Apply custom CSS class to the Radio component
    value="Technical"
    checked={formData.selectedCategory === 'Technical'}
  >
    Technical
  </Radio>
  <Radio
    className="custom-radio" 
    value="Non-Technical"
    checked={formData.selectedCategory === 'Non-Technical'}
  >
    Non-Technical
  </Radio>
</Radio.Group>
        </div>
      <br/>
          <label>First Name</label><br />
          <input type="text" name="firstName" value={formData.firstName} required onChange={handleChange} placeholder="Enter Fullname"></input><br />
          <label>Last Name</label><br />
          <input type="text" name="lastName" value={formData.lastName} required placeholder="Enter Last name" onChange={handleChange}></input><br />
         
          <label>Email</label><br />
          <input type="text" name="email" value={formData.email}  required onChange={handleChange} placeholder="Enter valid Mail Id "></input><br />
          <label>Contact<span className='require'>*</span></label><br />
              <input type="text" name="contact" value={formData.contact} maxLength={10}  onChange={handleChange} required placeholder="Enter 10-digit valid mobile No."></input><br /><br />
              
              
              
                <label>District</label><br />
                <input
                  type="text"
                  name="district"
                  
                  value={formData.district}
                  maxLength={20}
                  placeholder="Enter district"
                  onChange={handleChange}
                /><br />
             
              
                <label>City</label><br />
                <input
                  type="text"
                  name="city"
                  
                  value={formData.city}
                  maxLength={20}
                  placeholder="Enter city"
                  onChange={handleChange}
                />
              
              <br />
                    <label>State<span className='require'>*</span></label><br />
              <input type="text" name="state" value={formData.state} maxLength={10}  onChange={handleChange} required placeholder="Enter your State"></input><ul className=
              'no-bullets'>
        {stateSuggestions.map((state, index) => (
          <li key={index}onClick={() => handleSelectState(state)}>{state}</li>
          
        ))}
      </ul><br />

      
        </div>

        <div className='col2'>
        <label>Total Experience</label><br />
              <input type="text" name="totalExperience"  value={formData.totalExperience} onChange={handleChange} placeholder="in years"></input><br />
              <label>Relevant Experience</label><br />
              <input type="text" name="relevantExperience"  value={formData.relevantExperience} onChange={handleChange} placeholder="in years"></input><br />
     
        <label>Qualification</label><br />
        <select name="qualification" value={formData.qualification} style={{width:'100%'}} onChange={handleChange} placeholder="Enter Highest qualification">
          <option value="">Choose One</option>
          <option value="Btech">Btech</option>
          <option value="PhD">PhD</option>
          <option value="PG">PG</option>
          <option value="UG">UG</option>
        </select><br /><br />  
        <label>Notice Period</label><br />
          <select name="noticePeriod" style={{width:'100%'}} value={formData.noticePeriod} onChange={handleChange}>
            <option value="">Choose One</option>
            <option value="Immediatejoiner">Immediate Joiner</option>
            <option value="Lessthan30days">Less than 30days</option>
            <option value="Lessthan45days">Less than 45days</option>
            <option value="Morethan45days">More than 45 days</option>
          </select><br /><br />
          <label>Applied Position</label><br />
          <select name="position" style={{width:'100%'}}  value={formData.position} onChange={handleChange}>
            <option value="">Choose One</option>
            {positions.map((position) => (
              <option key={position._id} value={position.position}>{position.position}</option>
            ))}
          </select><br /><br />
          <label>Resume</label><br />
      <input type="file" name="resume" path={formData.resume}  onChange={handleChange} accept=".pdf, .doc" placeholder=".pdf, .doc" ></input><br />

             
      <label>HR Manager</label><br />
        
      <HrDropdown onSelect={handleSelectHr} onSelectHr={handleSelectHr} /> {/* Pass the onSelect and onSelectHr functions */}
     

          <button style={{ backgroundColor: '#00B4D2', borderColor: '#fff' }} type="submit" >Submit</button>
        </div>

        </div>
      </form>
      
    </div>
    </div>
  )
}

export default Registration;

