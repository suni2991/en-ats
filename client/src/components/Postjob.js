import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Regform.css';
import Swal from 'sweetalert2';
import HrDropdown from './HrDropdown';
import { Button , message } from 'antd';

const Postjob = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        position: '',
        department: '',
        description: '',
        jobLocation: '',
        vacancies: '',
        primarySkills: '',
        secondarySkills: '',
        experience: '',
        postedBy: '',
    });

    const [selectedHrName, setSelectedHrName] = useState('');
    const [selectedHrEmail, setSelectedHrEmail] = useState('');

    const handleSelectHr = (fullName, email) => {
        setSelectedHrName(fullName);
        setSelectedHrEmail(email);
        // Set the selected HR as the postedBy value
        setFormData((prevData) => ({
            ...prevData,
            postedBy: fullName,
        }));
    };


    const deptList = [
        'Data and Digital-DND',
        'PACS',
        'EdTech & Catalog Operations (ECO)',
        'Analytics Practice',
        'Adobe_Team',
        'Software Services',
        'Business Development',
        'Human Resources',
        'Administration',
        'IT & Governance'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // let emptyFields = [];

        // for (const key in formData) {
        //     if (!formData[key]) {
        //         emptyFields.push(key);
        //     }
        // }

        // if (emptyFields.length > 3) {
        //     Swal.fire({
        //         title: "Error!",
        //         text: "Please fill in all the fields.",
        //         icon: "error",
        //         confirmButtonColor: "#00B4D2",
        //         confirmButtonText: "OK",
        //     });
        //     return;
        // }

       

        try {
            const response = await axios.post('http://localhost:5040/createjob', formData);
            console.log('Job post submitted:', response.data);
            message.success('New Job created successfully')

            setFormData({
                position: '',
                department: '',
                description: '',
                jobLocation: '',
                vacancies: '',
                experience: '',
            });
        } catch (error) {
            message.error('Something went wrong!')
            console.error('Error submitting job post:', error);
        }
    };

    return (
        <div>
            
            <form>
                <div className='formContainer'>
                    <div className='block'>
                        <div>
                            <label htmlFor="position">Job Title:</label><br />
                            <input
                                type="text"
                                name="position"
                                id="position"
                                value={formData.position}
                                onChange={handleChange}
                                required
                                placeholder='Job Title'
                            />
                        </div>
                        <div>
                        <label htmlFor="vacancies">Vacancies:</label><br />
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
                            <label htmlFor="primaryskills">Primary Skills:</label><br />
                            <input
                                type="text"
                                name="primarySkills"
                                id="primarySkills"
                                value={formData.primarySkills}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                        <label htmlFor="department">Department:</label><br />
                        <select
                            name="department"
                            id="department"
                            value={formData.department}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Department</option>
                            {deptList.map((dept, index) => (
                                <option key={index} value={dept}>
                                    {dept}
                                </option>
                            ))}
                        </select>
                        </div>
                    </div>
                    <div className='block'>
                        <div>
                            <label htmlFor="jobLocation">Location:</label><br />
                            <input
                                type="text"
                                name="jobLocation"
                                id="jobLocation"
                                value={formData.jobLocation}
                                onChange={handleChange}
                                required
                            />
                        </div>


                        <div>
                            <label htmlFor="experience">Experience:</label><br />
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
                            <label htmlFor="secondarySkills">Secondary Skills:</label><br />
                            <input
                                type="text"
                                name="secondarySkills"
                                id="secondarySkills"
                                value={formData.secondarySkills}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div style={{ width: '27vw', padding: '15px' }}>


                            <HrDropdown onSelect={handleSelectHr} onSelectHr={handleSelectHr} style={{ width: '100%' }} /> </div>
                    </div>
                </div>
                <div id='desc'>
                    <div>
                        <label htmlFor="description">Additional Details:</label><br />
                        <textarea
                            name="description"
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', height: '110px', padding: '2px', border: '1px solid #00B4D2' }}
                        />
                    </div>

                </div>
                <div id='btnWrapper'>
                    <Button type="submit" className="form-btn" onClick={handleSubmit}>Submit</Button>

                </div>
            </form>
        </div>
    );
};

export default Postjob;
