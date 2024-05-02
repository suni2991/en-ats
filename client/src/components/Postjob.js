import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import '../styles/Regform.css'

const Postjob = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        position: '',
        department: '',
        description: '',
        jobType: '',
        jobLocation: '',
        vacancies: '',
        fulfilledBy: '',
        salaryRange: '',
        experience: '',
        modeOfJob: '',
    });

    const handleRedirect = () => {
        navigate('/jobs')
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5040/createjob', formData);
            console.log('Job post submitted:', response.data);
          
            setFormData({
                position: '',
                department: '',
                description: '',
                jobType: '',
                jobLocation: '',
                vacancies: '',
                fulfilledBy: '',
                salaryRange: '',
                experience: '',
                modeOfJob: '',
            });
        } catch (error) {
            console.error('Error submitting job post:', error);
        }
    };

    return (
        <div className='table-container'>
        <h1>Create a Job</h1>
            <form>
                <div className='formContainer'>
                    <div className='block'>
                        <div>
                            <label htmlFor="position">Job Role:</label><br />
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
                            <label htmlFor="department">Department:</label><br />
                            <input
                                type="text"
                                name="department"
                                id="department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                                placeholder='Department'

                            />
                        </div>
                        <div>
                            <label htmlFor="jobType">Job Type:</label><br />
                            <select
                                name="jobType"
                                id="jobType"
                                value={formData.jobType}
                                onChange={handleChange}
                                required

                            >
                                <option value="">Select Job Type</option>
                                <option value="FullTime">Full Time</option>
                                <option value="Contract">Contract Basis</option>
                            </select>
                        </div><br />
                        <div>
                            <label htmlFor="jobLocation">Job Location:</label><br />
                            <input
                                type="text"
                                name="jobLocation"
                                id="jobLocation"
                                value={formData.jobLocation}
                                onChange={handleChange}
                                required

                            />
                        </div>
                    </div>
                    <div className='block'>
                        <div>
                            <label htmlFor="vacancies">Vacancies:</label><br />
                            <input
                                type="number"
                                name="vacancies"
                                id="vacancies"
                                value={formData.vacancies}
                                onChange={handleChange}
                                required
                                placeholder='No of Vacancies'
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="modeOfJob">Mode of Job:</label><br />
                            <select
                                name="modeOfJob"
                                id="modeOfJob"
                                value={formData.modeOfJob}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Mode of Job</option>
                                <option value="Remote">Remote</option>
                                <option value="Office">Office</option>
                            </select>
                        </div><br />
                        <div>
                            <label htmlFor="salaryRange">Salary Range:</label><br />
                            <select
                                name="salaryRange"
                                id="salaryRange"
                                value={formData.salaryRange}
                                onChange={handleChange}
                            >
                                <option value="">Select Salary Range</option>
                                <option value="Below 5,00,000">Below 5,00,000</option>
                                <option value="5,00,000-100000">5,00,000 - 10,00,000</option>
                                <option value="10,00,000-15,00,000">10,00,000 - 15,00,000</option>
                                <option value="15,00,000-20,00,000">15,00,000 - 20,00,000</option>

                            </select>

                        </div><br />
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
                    </div>
                </div>
                <div id='desc'>
                    <div>
                        <label htmlFor="description">Description:</label><br />
                        <textarea
                            name="description"
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', height: '110px', padding: '8px' }}
                        />
                    </div>
                </div>
                <div id='btnWrapper'>
                    <button type="submit" className="submit-button1" onClick={handleSubmit}>Post</button>
                    <button type="submit" className="submit-button1" onClick={handleRedirect}>Back</button>
                </div>
            </form>
        </div>
    );
};

export default Postjob;
