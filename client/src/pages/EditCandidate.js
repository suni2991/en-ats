
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import HrDropdown from '../components/HrDropdown';
import { Button, DatePicker } from 'antd';
import moment from 'moment';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import Swal from 'sweetalert2';

const URL = process.env.REACT_APP_API_URL;

const EditCandidate = ({selectedCandidate, closeModal}) => {

    const { token } = useAuth();
    // const location = useLocation();
    const navigateTo = useNavigate();
    // const candidate = location.state; // This will contain the passed 'row' object
    const { selectedCategory } = selectedCandidate;

    const [formData, setFormData] = useState(selectedCandidate);
    const [category, setCategory] = useState(selectedCategory);

    useEffect(() => {
        setFormData(selectedCandidate); // Reset form data when candidate changes
    }, [selectedCandidate]);


    // useEffect(() => {
    //     console.log(formData);

    // }, [formData])

    // const [formData, setFormData] = useState({
    //     firstName: candidate.firstName,
    //     lastName: candidate.lastName,
    //     totalExperience: candidate,
    //     relevantExperience: "",
    //     noticePeriod: "",
    //     qualification: "",
    //     contact: "",
    //     email: "",
    //     position: "",
    //     currentLocation: "",
    //     selectedCategory: "",
    //     image: "",
    //     resume: "",
    //     mgrName: "",
    //     mgrEmail: "",
    //     lwd: "",
    //     state: "",
    //     district: "",
    //     city: "",
    //     reference: "",
    //     source: "",
    // });

    // const handleCloseModal = () => {
    //     closeModal();
    // }

    const handleChangeCategory = (event) => {
        const selectedValue = event.target.value;
        event.target.name = event.target.value;
        setCategory(selectedValue);
        console.log('Selected Category: ', selectedValue);
    }

    const handleSubmit = async (e) => {
        // console.log('In handleSubmit');
        e.preventDefault();

        const response = await axios.patch(`${URL}/api/updateCandidateData/${selectedCandidate._id}`,
            formData,
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

        navigateTo('/hr');
        
    }

    const handleChange = (e) => {
        // console.log('In handleChange');
        const { name, value } = e.target;
        setFormData((prevData) => (
            { ...prevData, [name]: value }
        ));
    }

  

    const handleArrayDataChange = (e, index) => {

        console.log('index', index);

        const { name, value } = e.target;

        // Extract the actual key (e.g., "panelistName")
        const keys = name.split(".");

        console.log('keys', keys);


        const field = keys[keys.length - 1];

        setFormData((prevData) => {
            const updatedRounds = [...prevData.round];
            updatedRounds[index] = {
                ...updatedRounds[index],
                [field]: value, // Update the specific field in the object
            };

            return {
                ...prevData,
                round: updatedRounds,
            };
        });
    };


    const handleNestedChange = (e) => {
        // console.log('In handleNestedChange');

        const { name, value } = e.target;

        const keys = name.split(".");

        setFormData((prevData) => {
            let updatedData = { ...prevData };
            let currentLevel = updatedData;

            // for (let i = 0; i < keys.length; i++) {
            //     const key = keys[i];
            //     // currentLevel[key] = { ...currentLevel[key] };
            //     // currentLevel = currentLevel[key];

            //     if (typeof currentLevel[key] === "object") {
            //         currentLevel = currentLevel[key];
            //     } else if(i === keys.length-1) {
            //         currentLevel[key] = value;
            //     }
            // }

            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];

                if (i === keys.length - 1) {
                    // Update the value at the final key
                    currentLevel[key] = value;
                } else {
                    // Ensure intermediate key is an object
                    if (typeof currentLevel[key] !== "object" || currentLevel[key] === null) {
                        currentLevel[key] = {}; // Initialize as an empty object if undefined or not an object
                    }
                    currentLevel = currentLevel[key]; // Move deeper into the structure
                }
            }

            // Update the value at   the final key
            currentLevel[keys[keys.length - 1]] = value;

            return updatedData;
        })
    }

    const handleDateChange = () => {
        console.log('In handleDateChange');
    }

    const handleSelectHr = () => {
        console.log('In handleSelectHr');
    }

    const handlePositionChange = () => {
        console.log('In handlePositionChange');
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
                                    {/* <select name="noticePeriod" style={{ width: '100%' }} value={formData.noticePeriod} onChange={handleChange}>
                                        <option value="">Choose One</option>
                                        <option value="Immediate">Immediate </option>
                                        <option value="30days">Less than 30days</option>
                                        <option value="45days">Less than 45days</option>
                                        <option value="90days">More than 90days</option>
                                    </select> */}
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

                                {category && category === 'Technical' &&
                                    <>
                                        <div>
                                            <label>Psychometric Score</label>
                                            <input type="text" name="psychometric.score" value={formData.psychometric.score} onChange={handleNestedChange} placeholder="Enter psychometric score " />
                                        </div>
                                        <div>
                                            <label>Vocabulary Score</label>
                                            <input type="text" name="vocabulary.score" value={formData.vocabulary.score} onChange={handleNestedChange} placeholder="Enter vocabulary score " />
                                        </div>
                                        <div>
                                            <label>Quantitative Score</label>
                                            <input type="text" name="quantitative.score" value={formData.quantitative.score} onChange={handleNestedChange} placeholder="Enter quantitative score " />
                                        </div>
                                        <div>
                                            <label>Java Score</label>
                                            <input type="text" name="java.score" value={formData.java.score} onChange={handleNestedChange} placeholder="Enter java score " />
                                        </div>
                                    </>
                                }

                                {category && category === 'Non-Technical' &&
                                    <>
                                        <div>
                                            <label>Vocabulary Score</label>
                                            <input type="text" name="vocabulary.score" value={formData.vocabulary.score} onChange={handleNestedChange} placeholder="Enter vocabulary score " />
                                        </div>
                                        <div>
                                            <label>Accounts Score</label>
                                            <input type="text" name="accounts.score" value={formData.accounts.score} onChange={handleNestedChange} placeholder="Enter accounts score " />
                                        </div>

                                        <div>
                                            <label>Quantitative Score</label>
                                            <input type="text" name="quantitative.score" value={formData.quantitative.score} onChange={handleNestedChange} placeholder="Enter quantitative score " />
                                        </div>
                                        <div>
                                            <label>Excel Score</label>
                                            <input type="text" name="excel.score" value={formData.excel.score} onChange={handleNestedChange} placeholder="Enter excel score " />
                                        </div>
                                    </>
                                }

                                {selectedCandidate.round && selectedCandidate.round.length > 0 &&

                                    selectedCandidate.round.map((object, index) => (
                                        <>
                                            <div key={index}>
                                                <label>L{index + 1} Interviewer</label>
                                                <input type="text" name={`round.${index}.panelistName`} value={formData.round[index]?.panelistName || ''} onChange={handleNestedChange} placeholder="Enter interviewer name " />
                                            </div>
                                        </>
                                    ))
                                }
                                {/* <div>
                                    <label>L1 Interviewer</label>
                                    <input type="text" name={`round.0.panelistName`} value={formData.round[0].panelistName} onChange={handleNestedChange} placeholder="Enter interviewer name " />
                                </div> */}

                                {/* <div>
                                    <label>Resume<span className='require'>*</span></label>
                                    <input type="file" name="resume" path={formData.resume} required onChange={handleChange} accept=".pdf, .doc" placeholder=".pdf, .doc" />
                                </div> */}
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
                                {/* {!positionId && ( */}
                                {/* <div>
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
                                </div> */}
                                {/* )} */}
                                <div><label>Category</label>
                                    <select name="selectedCategory" value={formData.selectedCategory} style={{ width: '100%' }} onChange={handleChangeCategory} placeholder="choose Category" disabled={formData.selectedCategory ? true : false}>

                                        <option value="">Choose One</option>
                                        <option value="Technical">Technical</option>
                                        <option value="Non-Technical">Non-Technical</option>
                                    </select>
                                </div>

                                {category && category === 'Technical' &&
                                    <>
                                        <div>
                                            <label>Psychometric Test Status</label>
                                            <input type="text" name="psychometric.status" value={formData.psychometric.status} onChange={handleNestedChange} placeholder="Enter psychometric test status " />
                                        </div>
                                        <div>
                                            <label>Vocabulary Test Status</label>
                                            <input type="text" name="vocabulary.status" value={formData.vocabulary.status} onChange={handleNestedChange} placeholder="Enter vocabulary test status " />
                                        </div>
                                        <div>
                                            <label>Quantitative Test Status</label>
                                            <input type="text" name="quantitative.status" value={formData.quantitative.status} onChange={handleNestedChange} placeholder="Enter quantitative test status" />
                                        </div>
                                        <div>
                                            <label>Java Test Status</label>
                                            <input type="text" name="java.status" value={formData.java.status} onChange={handleNestedChange} placeholder="Enter java test status " />
                                        </div>
                                    </>
                                }

                                {category && category === 'Non-Technical' &&
                                    <>
                                        <div>
                                            <label>Vocabulary Test Status</label>
                                            <input type="text" name="vocabulary.status" value={formData.vocabulary.status} onChange={handleNestedChange} placeholder="Enter vocabulary test status " />
                                        </div>
                                        <div>
                                            <label>Accounts Test Status</label>
                                            <input type="text" name="accounts.status" value={formData.accounts.status} onChange={handleNestedChange} placeholder="Enter accounts test status " />
                                        </div>
                                        <div>
                                            <label>Quantitative Test Status</label>
                                            <input type="text" name="quantitative.status" value={formData.quantitative.status} onChange={handleNestedChange} placeholder="Enter quantitative test status " />
                                        </div>
                                        <div>
                                            <label>Excel Test Status</label>
                                            <input type="text" name="excel.status" value={formData.excel.status} onChange={handleNestedChange} placeholder="Enter excel test status " />
                                        </div>
                                    </>
                                }

                                {selectedCandidate.round && selectedCandidate.round.length > 0 &&

                                    selectedCandidate.round.map((object, index) => (
                                        <>
                                            <div>
                                                <label>L{index + 1} Interview Feedback</label>
                                                <input type="text" name={`round.${index}.feedback`} value={formData.round[index]?.feedback || ''} onChange={handleNestedChange} placeholder="Enter interview feedback " />
                                            </div>
                                        </>
                                    ))
                                }

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

                                {/* <div>
                                    <label>Source<span className='require'>*</span></label>
                                    <input type="text" name="source" value={formData.source} required onChange={handleChange} placeholder="Source (e.g., Online Ad, Career Site)" />
                                </div> */}
                                {/* <div style={{ marginTop: '10px' }}>
                                    <HrDropdown onSelect={handleSelectHr} onSelectHr={handleSelectHr} required onChange={(value, option) => handleSelectHr(option.fullName, option.email)} />
                                </div> */}
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