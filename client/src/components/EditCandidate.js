
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, DatePicker } from 'antd';
import moment from 'moment';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import Swal from 'sweetalert2';

const URL = process.env.REACT_APP_API_URL;

const EditCandidate = ({ selectedCandidate, closeModal }) => {

    const { token } = useAuth();
    // const navigateTo = useNavigate();
    // const { selectedCategory } = selectedCandidate;

    const [formData, setFormData] = useState(selectedCandidate);
    // const [category, setCategory] = useState(selectedCandidate.selectedCategory || '');

    useEffect(() => {
        setFormData(selectedCandidate); // Reset form data when candidate changes
        console.log(selectedCandidate);
        // setCategory(selectedCategory || '');
        // console.log('category: ', category); 
    }, [selectedCandidate]);

    // const handleChangeCategory = (event) => {
    //     const selectedValue = event.target.value;
    //     console.log('selectedValue: ', selectedValue);

    //     event.target.name = event.target.value;
    //     setCategory(selectedValue);

    //     console.log('category: ', category);
    // }



    const handleSubmit = async (e) => {
        e.preventDefault();

   
        const updatedData = {
            ...formData
        };

        console.log('Updated form data:', updatedData);

        const response = await axios.patch(`${URL}/api/updateCandidateData/${selectedCandidate._id}`,
            updatedData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log(response.data);

        await Swal.fire({
            title: 'Candidate Data Updated',
            text: 'Candidate data has been updated successfully',
            icon: 'success',
            confirmButtonText: 'Close',
        });

        closeModal();
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => (
            { ...prevData, [name]: value }
        ));
    }

    const handleNestedChange = (e) => {
        const { name, value } = e.target;
        const keys = name.split(".");

        setFormData((prevData) => {
            let updatedData = { ...prevData };
            let currentLevel = updatedData;

            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];

                if (i === keys.length - 1) {
                   
                    currentLevel[key] = value;
                } else {
                    // Ensure intermediate key is an object
                    if (typeof currentLevel[key] !== "object" || currentLevel[key] === null) {
                        currentLevel[key] = {}; 
                    }
                    currentLevel = currentLevel[key]; // Move deeper into the structure
                }
            }

            currentLevel[keys[keys.length - 1]] = value;

            return updatedData;
        })
    }

    const handleDateChange = () => {
        console.log('In handleDateChange');
    }

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

    return (
        <>
            <div style={{ padding: '5px 10px' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '15px', marginBottom: '-7px' }}>
                    {/* <p style={{ fontSize: '17px', color: '#28231d' }}> Edit Candidate Details </p> */}
                    <form onSubmit={handleSubmit}>
                        <div className='formContainer' style={{ gap: '3rem', marginTop: '30px' }}>
                            <div className='block' >
                                <div>
                                    <label>First Name<span className='require'>*</span></label>
                                    <input type="text" name="firstName" value={formData.firstName} required onChange={handleChange} placeholder="Enter Fullname" disabled={false} />
                                </div>
                                <div><label>Email<span className='require'>*</span></label>
                                    <input type="text" name="email" value={formData.email} required onChange={handleChange} placeholder="Enter valid Mail Id " disabled={false} />
                                </div>
                                <div>
                                    <label>Total Experience<span className='require'>*</span></label>
                                    <input type="text" name="totalExperience" value={formData.totalExperience} onChange={handleChange} placeholder="Enter Number of years only " disabled={false} />
                                </div>
                                <div>
                                    <label>Notice Period<span className='require'>*</span></label>
                                    <input type="text" name="noticePeriod" value={formData.noticePeriod} onChange={handleChange} placeholder="Enter Last Working Day " />
                                </div>
                                <div>
                                    <label>City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        maxLength={20}
                                        placeholder="Enter city"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label>State</label>
                                    <select
                                        name="state"
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
                                    <label>Reference</label>
                                    <input type="text" name="reference" value={formData.reference} onChange={handleChange} placeholder="Enter Referred By Name" />
                                </div>
                            </div>

                            <div className='block' style={{ float: 'right' }}>
                                <div>
                                    <label>Last Name<span className='require'>*</span></label>
                                    <input type="text" name="lastName" value={formData.lastName} required placeholder="Enter Last name" onChange={handleChange} disabled={false} />
                                </div>

                                <div><label>Contact Number<span className='require'>*</span></label>
                                    <input type="text" name="contact" value={formData.contact} maxLength={10} onChange={handleChange} required placeholder="Enter 10-digit valid mobile No." disabled={false} />
                                </div>
                                <div><label>Relevant Experience<span className='require'>*</span></label>
                                    <input type="text" name="relevantExperience" value={formData.relevantExperience} onChange={handleChange} placeholder="Enter Number of years only " disabled={false} />
                                </div>
                                <div><label>Qualification<span className='require'>*</span></label>
                                    <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} placeholder="Highest Qualification" disabled={false} />
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
                                <div><label>Category</label>
                                    <select name="selectedCategory" value={formData.selectedCategory} style={{ width: '100%' }} onChange={handleChange} placeholder="Choose Category" >

                                        <option value="">Choose One</option>
                                        <option value="Technical">Technical</option>
                                        <option value="Non-Technical">Non-Technical</option>
                                        <option value="No-Screening">No-Screening</option>
                                    </select>
                                </div>

                                <div>
                                    <label>Last Working Day</label>
                                    <DatePicker
                                        name="lwd"
                                        required
                                        value={formData.lwd ? moment(formData.lwd) : null}
                                        onChange={handleDateChange}
                                        placeholder="Choose Last Working Day"
                                        style={{ width: '100%', border: '1px solid #00B4D2', padding: '7px 5px' }}
                                    // disabledDate={disabledDate} // Apply date restriction
                                    />
                                </div>
                            </div>
                        </div>
                        <div id='btnWrapper'>
                            <Button className='add-button' style={{ backgroundColor: '#A50707', float: 'end', marginTop: '5px' }} type="submit" onClick={handleSubmit} >Submit</Button>
                        </div>
                    </form>
                    <center><p style={{ color: '#A50707' }}>* Fields are required</p></center>
                </div>
            </div>
        </>
    )
}

export default EditCandidate;