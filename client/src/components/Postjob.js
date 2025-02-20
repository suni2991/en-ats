import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styles/Regform.css";
import HrDropdown from "./HrDropdown";
import moment from "moment";
import { Button, message, Select, DatePicker } from "antd";
import useAuth from "../hooks/useAuth";


const { Option } = Select;
const URL = process.env.REACT_APP_API_URL;

const Postjob = () => {
  // const { role } = useParams();

  const { token, auth, role } = useAuth();
  const [mgrRole, setMgrRole] = useState("");
  const [formData, setFormData] = useState({
    position: "",
    department: "",
    description: "",
    jobLocation: "",
    vacancies: "",
    primarySkills: [],
    secondarySkills: [],
    experience: "",
    postedBy: "",
    status: "Approval Pending",
    mgrRole: role,
    jd: "",
    fullfilledBy: "",
    toEmail:"",
    responsibilities:"",
    updateBy: auth.fullName,

  });

  const [selectedHrName, setSelectedHrName] = useState("");
  const [selectedHrEmail, setSelectedHrEmail] = useState("");

  useEffect(() => {
    setMgrRole(role); // Role from useAuth hook
    setFormData((prevData) => ({
      ...prevData,
      mgrRole: auth.role,
    }));
  }, [role]);
  

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      updateBy: auth.fullName,
    }));
  }, [auth.fullName]);

  const deptEmailMap = {
    "Administration": "kamran@enfuse-solutions.com",
    "Data and Digital-DND": "kamran@enfuse-solutions.com",
    "PACS": "kamran@enfuse-solutions.com",
    "Human Resources": "kamran@enfuse-solutions.com",
    "IT & Governance": "kamran@enfuse-solutions.com",
    "Adobe_Team": "imran@enfuse-solutions.com",
    "Software Services": "imran@enfuse-solutions.com",
    "Business Development": "imran@enfuse-solutions.com",
    "EdTech & Catalog Operations (ECO)": "imran@enfuse-solutions.com",
    "Analytics & Insights": "imran@enfuse-solutions.com",
  };

  const deptList = Object.keys(deptEmailMap);

  const handleDepartmentChange = (department) =>{
    const email = deptEmailMap[department] || " ";
   

    setFormData((prevData) =>({
      ...prevData,
      department,
      toEmail: email,
    }))
  }

  const isAlphabetic = (value) => /^[A-Za-z\s,+\-]*$/.test(value);
  const isNumeric = (value) => /^[0-9]*$/.test(value);

  const validateField = (name, value) => {
    if (name === "experience" || name === "vacancies") {
      if (!isNumeric(value)) {
        message.error(`${name} should contain only numbers`);
        return false;
      }
    } else if (
      name !== "department" &&
      name !== "postedBy" &&
      name !== "position" &&
      name !== "responsibilities" &&
      name !== "description"
    ) {
      if (!isAlphabetic(value)) {
        message.error(
          `${name} should contain only alphabets, spaces, commas, +, or -`
        );
        return false;
      }
    }
    return true;
  };

  const handlePaste = (e) => {
    const { name } = e.target;
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedText = clipboardData.getData("Text");

    if (name === "responsibilities" || name === "description") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: pastedText,
      }));
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    
    if (e.target.name === "jd") {
      const file = e.target.files[0];
      const allowedExtensions = /(\.pdf|\.doc)$/i;
      
      if (!allowedExtensions.exec(file.name)) {
        message.error("Please upload a file in .pdf or .doc format");
        return;
      }
  
      const uploadFormData = new FormData();
      uploadFormData.append(e.target.name, file, file.name);
  
      const uploadEndpoint = e.target.name;
      const response = await fetch(`${URL}/api/upload/` + uploadEndpoint, {
        method: "POST",
        body: uploadFormData,
      });
      
      if (!response.ok) {
        console.error("File upload failed with status code", response.status);
      } else {
        console.log("File uploaded successfully");
      }
      
      const data = await response.json();
      setFormData((prevData) => ({
        ...prevData,
        [e.target.name]: data["uploadedFile"],
      }));
    } else {
      const { name, value } = e.target;
      if (validateField(name, value)) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    }
  };

  const disabledDate = (current) => {
    // Disable dates before today and after 60 days from today
    const today = moment();
    const maxDate = moment().add(240, 'days');
    return current && (current < today.startOf('day') || current > maxDate.endOf('day'));
  };
  

  const handleDateChange = (date, dateString) => {
    if (date && date.isBefore(moment(), "day")) {
      message.error("Fullfilled By date should be a future date");
      setFormData((prevData) => ({
        ...prevData,
        fullfilledBy: "",
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        fullfilledBy: dateString,
      }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectHr = (fullName, email) => {
    setSelectedHrName(fullName);
    setSelectedHrEmail(email);
    setFormData((prevData) => ({
      ...prevData,
      postedBy: fullName,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "position",
      "department",
      "jobLocation",
      "vacancies",
      "primarySkills",
      "experience",
      "jd",
      "fullfilledBy"
      
    ];
    for (let field of requiredFields) {
      if (!formData[field] || formData[field].length === 0) {
        message.error(`${field} is required`);
        return;
      }
    }

    try {
      const response = await axios.post(
        `${URL}/api/createjob`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      message.success(
        "New Job created successfully and sent for Directors Approval"
      );

      const jobId = response.data._id;
      const updateBy = response.data.updateBy;
      console.log("user role", updateBy )
      const emailData = {
        position: formData.position,
        department: formData.department,
        postedBy: formData.postedBy,
        jobId: jobId,
        toEmail: formData.toEmail,
      };

      await axios.post(
        `${URL}/api/job/approval`,
        emailData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFormData({
        position: "",
        department: "",
        description: "",
        jobLocation: "",
        vacancies: "",
        primarySkills: [],
        secondarySkills: [],
        experience: "",
        postedBy: "",
        responsibilities: "",
        jd: "",
        fullfilledBy: "",
      });
      setSelectedHrName("");
      setSelectedHrEmail("");
    } catch (error) {
      console.error("Error:", error);
      // message.error("Please fill all required fields");
    } 
  };

  return (
    <div>
      <form>
        <div className="formContainer">
          <div className="block">
            <div>
              <label htmlFor="position">
                Job Title:<span className="require">*</span>
              </label>
              <input
                type="text"
                name="position"
                id="position"
                value={formData.position}
                onChange={handleChange}
                required
                placeholder="Job Title"
              />
            </div>
            <div>
              <label htmlFor="vacancies">
                Vacancies:<span className="require">*</span>
              </label>
              <input
                type="text"
                name="vacancies"
                id="vacancies"
                value={formData.vacancies}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="primarySkills">
                Primary Skills:<span className="require">*</span>
              </label>
              <Select
                mode="tags"
                placeholder="Enter skill & press Enter Key"
                value={formData.primarySkills}
                onChange={(value) => handleSelectChange("primarySkills", value)}
                required
              >
                {formData.primarySkills.map((skill, index) => (
                  <Option key={index} value={skill}>
                    {skill}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <label htmlFor="department">
                Vertical / Department:<span className="require">*</span>
              </label>
              <Select
                
                value={formData.department}
                onChange={handleDepartmentChange}
                required
              >              
                {deptList.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </Select>
            </div>
            <div>
            <label htmlFor="fullfilledBy">
            {auth.role !== "HiringManager" ? "HR Turnaround Time" : "Ops Anticipated Time"}:
            </label>
            <DatePicker
                onChange={handleDateChange}
                format="YYYY-MM-DD"
                value={
                  formData.fullfilledBy ? moment(formData.fullfilledBy) : null
                }
                disabledDate={disabledDate}
              />
          </div>

          </div>
          <div className="block">
            <div>
              <label htmlFor="jobLocation">
                Location:<span className="require">*</span>
              </label>
              <input
                type="text"
                name="jobLocation"
                id="jobLocation"
                value={formData.jobLocation}
                onChange={handleChange}
                required
                onPaste={handlePaste}
              />
            </div>
            <div>
              <label htmlFor="experience">
                Experience:<span className="require">*</span>
              </label>
              <input
                type="text"
                name="experience"
                id="experience"
                value={formData.experience}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="secondarySkills">Secondary Skills:</label>
              <Select
                mode="tags"
                placeholder="Enter skill & press Enter Key"
                value={formData.secondarySkills}
                onChange={(value) =>
                  handleSelectChange("secondarySkills", value)
                }
              >
                {formData.secondarySkills.map((skill, index) => (
                  <Option key={index} value={skill}>
                    {skill}
                  </Option>
                ))}
              </Select>
            </div>
            {auth.role !== "HiringManager" && (
            <div style={{ }}>
            <label htmlFor="secondarySkills">HR</label>
              <HrDropdown
                onSelect={handleSelectHr}
                onSelectHr={handleSelectHr}
                style={{ width: "100%" }}
              />
            </div>
            )}
            <div>
            <label htmlFor="jd">
              JD:<span className="require">*</span>
            </label>
            
            <input
              type="file"
              name="jd"
              onChange={handleChange}
              accept=".pdf, .doc"
              required
            />
          </div>
          </div>

        </div>
        <br/>
        <div id="desc">
          <div>
            <label htmlFor="rolesNResponsibilities">
              Roles & Responsibilities:<span className="require">*</span>
            </label>
            <textarea
              name="responsibilities"
              id="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="description">Job Description:<span className="require">*</span></label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </div>
        <div id="btnWrapper">
          <Button type="submit" className="form-btn" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </form>
    </div>
  );

};

export default Postjob;