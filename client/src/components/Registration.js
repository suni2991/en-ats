import { useState, useEffect } from "react";
import "../styles/Applicant.css";
import Swal from "sweetalert2";
import axios from "axios";
import moment from "moment";
import { DatePicker, message, Button } from "antd";
import HrDropdown from "./HrDropdown";
import "../styles/Regform.css";
import { useParams } from 'react-router-dom';

import useAuth from "../hooks/useAuth";

const URL = process.env.REACT_APP_API_URL;
function Registration({ closeModal }) {
  const { token } = useAuth();
  const { auth } = useAuth();
  const [positions, setPositions] = useState([]);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [stateSuggestions, setStateSuggestions] = useState([]);
  const { positionId } = useParams();  // Capture positionId from the URL

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    totalExperience: "",
    relevantExperience: "",
    noticePeriod: "",
    qualification: "",
    contact: "",
    email: "",
    position: "",
    currentLocation: "",
    selectedCategory: "",
    image: "",
    resume: "",
    mgrName: "",
    mgrEmail: "",
    lwd: "",
    state: "",
    district: "",
    city: "",
    reference: "",
    source: "",
  });

  const [selectedHrName, setSelectedHrName] = useState("");
  const [selectedHrEmail, setSelectedHrEmail] = useState("");

  const handleSelectHr = (fullName, email) => {
    setSelectedHrName(fullName);
    setSelectedHrEmail(email);
  };

  useEffect(() => {
    // Fetch job data using positionId to prefill relevant fields
    if (positionId) {
      fetchJobDetails(positionId);
    }
  }, [positionId]);

  const fetchJobDetails = async (positionId) => {
    try {
      const response = await axios.get(`${URL}/api/job/position/${positionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const jobData = response.data;

      setFormData((prevState) => ({
        ...prevState,
        position: jobData.positionId,
        qualification: jobData.requiredQualification,
      }));
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };

  const handlePositionChange = (e) => {
    const selectedPosition = e.target.value;
    setFormData((prevState) => ({
      ...prevState,
      position: selectedPosition,  // Update position when selected manually
    }));
  };


  const statesList = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep",
    "Delhi",
    "Puducherry",
    "Jammu and Kashmir",
    "Ladakh",
  ];

  const handleSelectState = (selectedState) => {
    setFormData((prevState) => ({
      ...prevState,
      state: selectedState,  // Update the formData with the selected state
    }));
    setStateSuggestions([]);  // Clear suggestions once a state is selected
    setShowSuggestions(false);  // Hide the suggestion dropdown
  };

  const handleDateChange = (date, dateString) => {
    setFormData((prevState) => ({
      ...prevState,
      lwd: dateString,
    }));
  };

  // Function to disable past dates and dates beyond 60 days
  const disabledDate = (current) => {
    // Disable dates before today and after 60 days from today
    const today = moment();
    const maxDate = moment().add(120, 'days');
    return current && (current < today.startOf('day') || current > maxDate.endOf('day'));
  };


  const validateForm = () => {
    let isValid = true;
    // if (!formData.lwd){
    //   message.error("Choose your Last Working Day")
    //   isValid= false;
    // }

    if (!formData.firstName) {
      message.error("Enter First Name");
      isValid = false;
    } else if (!/^[A-Za-z]+$/.test(formData.firstName)) {
      message.error(
        "Firstname should be of Alphabets without spaces & special Characters(!@#$%^,..)"
      );
      isValid = false;
    }
    if (!formData.lastName) {
      message.error("Enter Last Name");
      isValid = false;
    } else if (!/^[A-Za-z]+$/.test(formData.lastName)) {
      message.error(
        "Lastname should be of Alphabets without spaces & special Characters(!@#$%^,..)"
      );

      isValid = false;
    }
    if (
      !/^[A-Za-z]+$/.test(formData.currentLocation) &&
      formData.currentLocation
    ) {
      message.error("Current Location should be of Alphabets");

      isValid = false;
    }



    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formData.email || !emailRegex.test(formData.email)) {
      message.warning("Enter Valid Email");
      isValid = false;
    } else if (formData.email.includes("@enfuse-solutions.com")) {
      message.error("Emails from '@enfuse-solutions.com' are not allowed");
      isValid = false;
    }

    if (!formData.resume) {
      message.warning("Please upload a valid Resume in .doc/.pdf format");
      isValid = false;
    } else if (formData.resume.name) {
      const allowedExtensions = ["doc", "pdf"];
      const fileExtension = formData.resume.name.split(".").pop().toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        message.error("Resume must be in .doc or .pdf format");
        isValid = false;
      }
    }

    if (!formData.contact) {
      message.error("Enter valid contact Number");

      isValid = false;
    } else if (!/^\d{10}$/.test(formData.contact)) {
      message.error("Enter Valid 10 - digit contact Number");
      isValid = false;
    }

    if (!formData.qualification || formData.qualification.length < 2) {
      message.error("Add Custom Qualification");
      isValid = false;
    }

    if (!formData.selectedCategory) {
      message.error("Please Choose Category");
      isValid = false;
    }

    const expRegex = /^\d{0,5}(\.\d{0,2})?$/;
    if (
      !expRegex.test(formData.totalExperience) ||
      !expRegex.test(formData.relevantExperience)
    ) {
      if (
        parseInt(formData.relevantExperience) >
        parseInt(formData.totalExperience)
      ) {
        message.error(
          "Relevant Experience should be of numbers only & less than or equal to Total Experience"
        );

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
      const response = await axios.get(`${URL}/api/viewjobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const jobPositions = response.data;
      setPositions(jobPositions);
    } catch (error) {
      console.error("Error fetching job positions:", error);
    }
  };


  const handleChange = async (e) => {
    e.preventDefault();
    
    if (e.target.name === "image" || e.target.name === "resume") {
        const uploadFormData = new FormData();
        uploadFormData.append(e.target.name, e.target.files[0], e.target.files[0].name);
        
        const uploadEndpoint = e.target.name;
        const response = await fetch(`${URL}/api/upload/` + uploadEndpoint, {
            method: "POST",
            body: uploadFormData,
        });

        if (!response.ok) {
            console.error("Image upload failed with status code", response.status);
        } else {
            console.log("Image uploaded successfully");
        }

        const data = await response.json();
        console.log(data);

        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: data["uploadedFile"],
        }));
    } else {
        const { name, value } = e.target;

        setFormData((prevState) => ({
            ...prevState,
            [name]: name === "noticePeriod" && value === "other" ? "" : value,
        }));

        if (name === "noticePeriod" && value === "other") {
            const { value: customValue } = await Swal.fire({
                input: "text",
                inputLabel: "Enter custom Notice Period",
                inputPlaceholder: "e.g., 90 days",
                showCancelButton: true,
            });

            if (customValue) {
                setFormData((prevState) => ({
                    ...prevState,
                    noticePeriod: customValue,
                }));
            }
        }
    }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    const randomNumber = Math.floor(Math.random() * 10000);
    const fullName = formData.firstName + " " + formData.lastName;
    const username = formData.firstName + "." + formData.lastName + randomNumber;
    const password = Math.random().toString(36).slice(-8);
    const createdAt = new Date();

    const historyNote = "Initial registration of an Applicant";
    const historyUpdate = {
      status:"CV Sourced",
      updatedBy: auth.fullName || "Applicant",
      updatedAt: new Date(),
      note: historyNote,
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
      position: formData.position || positionId,
    };

    console.log("Selected HR Name:", selectedHrName);
    console.log("Selected HR Email:", selectedHrEmail);

    const isValid = validateForm();
    if (!isValid) {
      message.error("Something went wrong");
      return;
    }

    try {
      // Show loading spinner
      Swal.fire({
        title: 'Submitting...',
        text: 'Please wait while your application is being submitted.',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      // Submit the main form
      const response = await fetch(`${URL}/api/register/candidate`, {
        method: "POST",
        body: JSON.stringify(formDataWithFullName),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.status === 201) {
        // Sending email to manager
        const emailToManager = {
          role: data.role,
          email: data.email,
          fullName: data.fullName,
          mgrEmail: data.mgrEmail,
          source: data.source,
          position: data.position,
          reference: data.reference,
          lwd: data.lwd,
          currentLocation: data.currentLocation,
          selectedCategory: data.selectedCategory,
        };

        await axios.post(`${URL}/api/user/register`, emailToManager, {
          headers: { Authorization: `Bearer ${token}` },
        });

        await axios.post(`${URL}/api/user/acknowledgement`, emailToManager, {
          headers: { Authorization: `Bearer ${token}` },
        });

        message.success("Applicant saved successfully");
        await Swal.fire({
          title: 'Application Submitted',
          text: 'Your application has been submitted successfully. HR will get back to you shortly.',
          icon: 'success',
          confirmButtonText: 'Close',
        });

        // Close the window or modal
        // window.close();
        closeModal();
      } else if (response.status === 409) {
        message.error("Email or Username already in use");
      } else {
        message.error("Registration Failed");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      Swal.fire({
        title: 'Error',
        text: 'An error occurred during submission. Please try again later.',
        icon: 'error',
      });
    } finally {
      // Close the loading spinner
      Swal.close();
    }
  };



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
              <input type="text" name="totalExperience" value={formData.totalExperience} onChange={handleChange} placeholder="Enter Number of years only "></input></div>
            <div><label>Notice Period<span className='require'>*</span></label>
              <select name="noticePeriod" style={{ width: '100%' }} value={formData.noticePeriod} onChange={handleChange}>
                <option value="">Choose One</option>
                <option value="Immediate">Immediate </option>
                <option value="30days">Less than 30days</option>
                <option value="45days">Less than 45days</option>
                <option value="90days">More than 90days</option>
                <option value="other">Custom Notice Period</option>
              </select>
            </div>
            <div>
              <label>City<span className='require'>*</span></label>
              <input
                type="text"
                name="city"
                required={true}
                value={formData.city}
                maxLength={20}
                placeholder="Enter city"
                onChange={handleChange}
              />
            </div>
            <div>
              <label>State<span className='require'>*</span></label>
              <select
                name="state"
                required={true}
                value={formData.state}  // Bind the select value to formData.state
                onChange={handleChange}  // Handle state change on selection
              >
                <option value="">Select a state</option> {/* Default option */}
                {statesList.map((state, index) => (
                  <option key={index} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Resume<span className='require'>*</span></label>
              <input type="file" name="resume" path={formData.resume} required onChange={handleChange} accept=".pdf, .doc" placeholder=".pdf, .doc" ></input>
            </div>
            <div>
              <label>Reference</label>
              <input type="text" name="reference" value={formData.reference} onChange={handleChange} placeholder="Enter Referred By Name"></input></div>

            <div>
              <label>Last Working Day</label>
              <DatePicker
                name="lwd"
                required
                value={formData.lwd ? moment(formData.lwd) : null}
                onChange={handleDateChange}
                placeholder="Choose Last Working Day"
                style={{ width: '320px', border: '1px solid #00B4D2', padding: '5px 10px 0 10px' }}
              // disabledDate={disabledDate} // Apply date restriction
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
              <input type="text" name="relevantExperience" value={formData.relevantExperience} onChange={handleChange} placeholder="Enter Number of years only "></input>
            </div>
            <div><label>Qualification<span className='require'>*</span></label>
              <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} placeholder="Highest Qualification"></input>

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
            {!positionId && (
              <div>
                <label>Position</label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handlePositionChange}
                  style={{ width: '100%' }}
                >
                  <option value="">Choose One</option>
                  {positions.map((position) => (
                    <option key={position._id} value={position.position}>
                      {position.position}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div><label>Category(For Screening)<span className='require'>*</span></label>
              <select name="selectedCategory" value={formData.selectedCategory} style={{ width: '100%' }} onChange={handleChange} placeholder="choose Category" required>

                <option value="">Choose One</option>
                <option value="Technical">Technical</option>
                <option value="Non-Technical">Non-Technical</option>
                <option value="No-Screening">No-Screening</option>
              </select>
            </div>
            <div>
              <label>Source<span className='require'>*</span></label>
              <input type="text" name="source" value={formData.source} required onChange={handleChange} placeholder="Source (e.g., Online Ad, Career Site)"></input></div>

            <div style={{ marginTop: '10px' }}>
              <HrDropdown onSelect={handleSelectHr} onSelectHr={handleSelectHr} required onChange={(value, option) => handleSelectHr(option.fullName, option.email)} />
            </div>
          </div>
        </div>
        <div id='btnWrapper'>
          <Button className='add-button' style={{ backgroundColor: '#A50707', float: 'end', marginTop: '15px' }} type="submit" onClick={handleSubmit} >Submit</Button>
        </div>

      </form>
      <center><p style={{ color: '#A50707' }}>* Fields are required</p></center>
    </div>
  )
}

export default Registration;
