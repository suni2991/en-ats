import { useState } from 'react';
import '../styles/Applicant.css';
import { useNavigate } from 'react-router-dom';
import { MdAccountCircle } from 'react-icons/md'
import Swal from 'sweetalert2'

function Registration() {
  const [positions, setPositions] = useState([]);
  const [qualifications, setQualifications] = useState([])
  const [customPosition, setCustomPosition] = useState([]);
  const [customQualification, setCustomQualification] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  //const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState([]);
 // const [stateSuggestions, setStateSuggestions] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [stateSuggestions, setStateSuggestions] = useState([]);
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    totalExperience: '',
    relevantExperience: '',
    noticePeriod: '',
    qualification: '',
    contact: '',
    email: '',
    appliedPosition: '',
    currentLocation: '',
    image: '',
    selectedCategory:''
  })

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
    setShowSuggestions(false); // Hide suggestions after selection
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
    const emailRegex = /^[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
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

    if (!formData.appliedPosition || formData.appliedPosition.length < 2) {
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

  const handleChange = async (e) => {
    const value = e.target.value;
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

      setFormData(() => ({
        ...formData,
        [e.target.name]: data["uploadedFile"]
      }));
    }
    else if (e.target.name === 'appliedPosition' && value === 'other') {
      setFormData((prevState) => ({
        ...prevState,
        appliedPosition: ''
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
            appliedPosition: customValue,
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
  }
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
      createdAt: createdAt
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
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Applicant saved successfully',
          showConfirmButton: false,
          timer: 3000,
          confirmButtonText: 'OK'
        })

        setIsSubmitting(true)
        navigate('/hr');
        
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
          <div>
            <div className='col1'>
            <label>Type of Candidate</label><br/><br/>
        <label>
          <input
            type="radio"
            name={selectedCategory}
            value="Technical"
            checked={formData.selectedCategory === 'Technical'}
            onChange={handleChange}
            />
          Technical
          </label>
        <span style={{ margin: '0px 10px' }}></span>
        <label>
          <input
            type="radio"
            name={formData.selectedCategory}
            value="Non-Technical"
            checked={formData.selectedCategory === 'Non-Technical'}
            onChange={handleChange}
          />
          Non technical
        </label><br/><br/>
              <label>First Name<span className='require'>*</span></label><br />
              <input type="text" name="firstName" className="field1" minLength={3} maxLength={20} value={formData.firstName} required onChange={handleChange} placeholder="Enter Fullname"></input><br /><br />
              <label>Last Name<span className='require'>*</span></label><br />
              <input type="text" name="lastName" className="field1" minLength={3} maxLength={20} value={formData.lastName} required placeholder="Enter Last name" onChange={handleChange}></input><br /><br />

              <label>Qualification<span className='require'>*</span></label><br />
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
              </select><br /><br />
              <label>Email<span className='require'>*</span></label><br />
              <input type="text" name="email" value={formData.email} maxLength={50} className="field1" required onChange={handleChange} placeholder="Enter valid Mail Id "></input><br /><br />
             
              <label>Contact<span className='require'>*</span></label><br />
              <input type="text" name="contact" value={formData.contact} maxLength={10} className="field1" onChange={handleChange} required placeholder="Enter 10-digit valid mobile No."></input><br /><br />
              {/* <label><MdAccountCircle /> Image</label><br />
              <input type="file" name="image" path={formData.image} className="field1" onChange={handleChange} accept=".png, .jpg .jpeg" placeholder=".png .jpg" ></input><br /><br /> */}
              
            </div>
            <div className='col2'>
              <label>Total Experience</label><br />
              <input type="text" name="totalExperience" className="field1" maxLength={5} value={formData.totalExperience} onChange={handleChange} placeholder="In years & months"></input><br /><br />
              <label>Relevant Experience</label><br />
              <input type="text" name="relevantExperience" className="field1" maxLength={5} value={formData.relevantExperience} onChange={handleChange} placeholder="In years & months"></input><br /><br />
              <label>Notice Period</label><br />
              <select name="noticePeriod" className="field2" value={formData.noticePeriod} onChange={handleChange}>
                <option value="">Choose One</option>
                <option value="Immediatejoiner">Immediate Joiner</option>
                <option value="Lessthan30days">Less than 30days</option>
                <option value="Lessthan45days">Less than 45days</option>
                <option value="Morethan45days">More than 45 days</option>
              </select><br /><br />
              <label>Applied Position<span className='require'>*</span></label><br />
              <select name="appliedPosition" className="field2" onChange={handleChange} value={formData.appliedPosition}>
                <option value="">Choose One</option>
                <option value="Accounting">Accounting</option>
                <option value="It">IT</option>
                <option value="Sales">Sales</option>
                <option value="Developer">Developer</option>
                {positions.map((position, index) => (
                  <option key={index} value={position}>{position}</option>
                ))}
                <option value="other">Custom Position</option>
              </select><br /><br />

              <div style={{ display: 'flex' }}>
        <div style={{ width: '47%' ,paddingRight: '10px'}}>
          <label>District</label><br />
          <input
            type="text"
            name="district"
            className="field1"
            value={formData.district}
            maxLength={20}
            placeholder="Enter district"
            onChange={handleChange}
          />
        </div>
        <div style={{ width: '47%' }}>
          <label>Taluka</label><br />
          <input
            type="text"
            name="taluka"
            className="field1"
            value={formData.taluka}
            maxLength={20}
            placeholder="Enter taluka"
            onChange={handleChange}
          />
        </div>
        
        </div>
        <br />
              <label>State<span className='require'>*</span></label><br />
        <input type="text" name="state" value={formData.state} maxLength={10} className="field1" onChange={handleChange} required placeholder="Enter your State"></input><ul className=
        'no-bullets'>
  {stateSuggestions.map((state, index) => (
    <li key={index}onClick={() => handleSelectState(state)}>{state}</li>
    
  ))}
</ul><br />
        

        
              
            </div>
           
          </div>
          <div style={{margin: '0 auto'}}><button className="submit-button1" style={{ margin: '5px 25px 5px 25px',  fontWeight: 'bold'}} disabled={ isSubmitting} type="submit" >Submit</button></div>
          </div>
          
        </form>
      </div>
    </div>
  )
}

export default Registration;