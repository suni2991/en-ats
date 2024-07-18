
import { useState, useEffect } from 'react';
import '../styles/Applicant.css';
import Swal from 'sweetalert2'
import axios from 'axios';
import HrDropdown from './HrDropdown';
import { Button, DatePicker, message } from 'antd';
import '../styles/Regform.css';
import moment from 'moment';

function Registration({ closeModal }) {

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
    selectedCategory: '',
    image: '',
    resume: '',
    mgrName: '',
    mgrEmail: '',
    lwd: '',
    state: '',
    district: '',
    city: '',
    reference: '',
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

  const handleDateChange = (date, dateString) => {
    setFormData((prevState) => ({
      ...prevState,
      lwd: dateString,
    }));
  };

  const validateForm = () => {
    let isValid = true;

    if (!formData.firstName) {
      message.error('Enter First Name')
      isValid = false;
    } else if (!/^[A-Za-z]+$/.test(formData.firstName)) {
      message.error('Firstname should be of Alphabets without spaces & special Characters(!@#$%^,..)')
      isValid = false;
    }
    if (!formData.lastName) {
      message.error('Enter Last Name')
      isValid = false;
    } else if (!/^[A-Za-z]+$/.test(formData.lastName)) {
      message.error('Lastname should be of Alphabets without spaces & special Characters(!@#$%^,..)')

      isValid = false;
    }
    if (!/^[A-Za-z]+$/.test(formData.currentLocation) && formData.currentLocation) {
      message.error('Current Location should be of Alphabets')

      isValid = false;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formData.email || !emailRegex.test(formData.email)) {
      message.warning('Enter Valid Email')

      isValid = false;
    }

    if (!formData.contact) {
      message.error('Enter valid contact Number')

      isValid = false;
    } else if (!/^\d{10}$/.test(formData.contact)) {
      message.error('Enter Valid 10 - digit contact Number')
      isValid = false;
    }

    if (!formData.qualification || formData.qualification.length < 2) {
      message.error('Add Custom Qualification')
      isValid = false;
    }

    if (!formData.position || formData.position.length < 2) {
      message.error('Add Custom Position')

      isValid = false;
    }

    const expRegex = /^\d{0,5}(\.\d{0,2})?$/;
    if (!expRegex.test(formData.totalExperience) || !expRegex.test(formData.relevantExperience)) {

      if (parseInt(formData.relevantExperience) > parseInt(formData.totalExperience)) {
        message.error('Relevant Experience should be of numbers only & less than or equal to Total Experience')

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

    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const randomNumber = Math.floor(Math.random() * 10000);
    const fullName = formData.firstName + ' ' + formData.lastName;
    const username = formData.firstName + '.' + formData.lastName + randomNumber
    const password = Math.random().toString(36).slice(-8);
    const createdAt = new Date();

    const historyNote = 'Initial registration of an Applicant';
    const historyUpdate = {
      updatedBy: formData.mgrName,
      updatedAt: new Date(),
      note: historyNote
    };

    const formDataWithFullName = {
      ...formData,
      fullName: fullName,
      username: username,
      password: password,
      confirmPassword: password,
      createdAt: createdAt,
      mgrName: selectedHrName,
      mgrEmail: selectedHrEmail,
      reference: formData.reference,
      currentLocation: formData.city,
      history: [historyUpdate],
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

      const emailData = {
        role: data.role,
        confirmPassword: data.confirmPassword,
        email: data.email,
        fullName: data.fullName,
      };

      const emailResponse = await axios.post('http://localhost:5040/user/register', emailData);

      if (response.status === 201) {
        message.success('Applicant saved successfully')
        closeModal();

      } else if (response.status === 409) {
        message.error('Email or Username already in use')


      } else {
        message.error('Registration Failed')

      }
    }
  }


  return (
    <div>

      <form onSubmit={handleSubmit}>
        <div className='formContainer' style={{ gap: '4rem' }}>

          <div className='block' >
            <div>
              <label>First Name<span className='require'>*</span></label>
              <input type="text" name="firstName" value={formData.firstName} required onChange={handleChange} placeholder="Enter Fullname"></input></div>
            <div><label>Email<span className='require'>*</span></label>
              <input type="text" name="email" value={formData.email} required onChange={handleChange} placeholder="Enter valid Mail Id "></input></div>
            <div><label>Total Experience<span className='require'>*</span></label>
              <input type="text" name="totalExperience" value={formData.totalExperience} onChange={handleChange} placeholder="in years"></input></div>
            <div><label>Notice Period<span className='require'>*</span></label>
              <select name="noticePeriod" style={{ width: '100%' }} value={formData.noticePeriod} onChange={handleChange}>
                <option value="">Choose One</option>
                <option value="Immediate">Immediate </option>
                <option value="30days">Less than 30days</option>
                <option value="45days">Less than 45days</option>
              </select>
            </div>
            <div>
              <label>City<span className='require'>*</span></label>
              <input
                type="text"
                name="city"
                value={formData.city}
                maxLength={20}
                placeholder="Enter city"
                onChange={handleChange}
              />
            </div>
            <div><label>State<span className='require'>*</span></label>
              <input type="text" name="state" value={formData.state} maxLength={10} onChange={handleChange} required placeholder="Enter your State"></input><ul className=
                'no-bullets'>
                {stateSuggestions.map((state, index) => (
                  <li key={index} onClick={() => handleSelectState(state)}>{state}</li>
                ))}
              </ul>
            </div>

            <div>
              <label>Resume<span className='require'>*</span></label>
              <input type="file" name="resume" path={formData.resume}  onChange={handleChange} accept=".pdf, .doc" placeholder=".pdf, .doc" ></input>
            </div>
            <div>
          <label>Reference</label>
          <input type="text" name="reference" value={formData.reference} required onChange={handleChange} placeholder="Enter Referred By Name"></input></div>
           
          <div>
          <label>Last Working Day</label>
                  <DatePicker
                    name="lwd"
                    required
                    value={formData.lwd ? moment(formData.lwd) : null}
                    onChange={handleDateChange}
                    placeholder="Choose Last Working Day"
                    style={{ width: '320px', border: '1px solid #00B4D2', padding: '5px 10px 0 10px', }}
                  />
                </div>
          
          </div>

         
            <div className='block' style={{ float: 'right' }}>
              <div>
                <label>Last Name<span className='require'>*</span></label>
                <input type="text" name="lastName" value={formData.lastName} required placeholder="Enter Last name" onChange={handleChange}></input>
                </div>

              <div><label>Contact Number<span className='require'>*</span></label>
                <input type="text" name="contact" value={formData.contact} maxLength={10} onChange={handleChange} required placeholder="Enter 10-digit valid mobile No."></input>
                </div>
                <div><label>Relevant Experience<span className='require'>*</span></label>
                  <input type="text" name="relevantExperience" value={formData.relevantExperience} onChange={handleChange} placeholder="in years"></input>
                </div>
                <div><label>Qualification<span className='require'>*</span></label>
                  <select name="qualification" value={formData.qualification} style={{ width: '100%' }} onChange={handleChange} placeholder="Enter Highest qualification">
                    <option value="">Choose One</option>
                    <option value="Btech">Btech</option>
                    <option value="PhD">PhD</option>
                    <option value="PG">PG</option>
                    <option value="UG">UG</option>
                  </select>
                </div>
                <div>
                  <label>District</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    maxLength={20}
                    placeholder="Enter district"
                    onChange={handleChange}
                  />
                </div>

                <div><label>Applied Position<span className='require'>*</span></label>
                  <select name="position" style={{ width: '100%', marginBottom:'25px' }} value={formData.position} onChange={handleChange}>
                    <option value="">Choose One</option>
                    {positions.map((position) => (
                      <option key={position._id} value={position.position}>{position.position}</option>
                    ))}
                  </select>
                </div>
                <div><label>Category<span className='require'>*</span></label>
                <select name="selectedCategory" value={formData.selectedCategory} style={{ width: '100%' }} onChange={handleChange} placeholder="choose Category">
                  <option value="">Choose One</option>
                <option value="Techincal">Technical</option>
                  <option value="Non-Technical">Non-Technical</option>
  
                </select>
              </div>
              <div style={{marginTop:'10px'}}>
              <HrDropdown onSelect={handleSelectHr}  onSelectHr={handleSelectHr} required /> 
            </div>
                
                
             </div>    
          </div>
          <div id='btnWrapper'>
            <Button className='add-button' style={{ backgroundColor: '#A50707', float:'end', marginTop:'15px' }} type="submit" onClick={handleSubmit} >Submit</Button>
          </div>
      </form>
      <center><p>* All fields are required</p></center>
    </div>
  )
}

export default Registration;

