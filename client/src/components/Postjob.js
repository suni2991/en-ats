import React, { useState } from 'react';


const Postjob = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        location: '',
        salary: '',
        deadline: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add code to submit form data to backend or handle form submission
        console.log(formData);
        // Reset form data
        setFormData({
            title: '',
            description: '',
            requirements: '',
            location: '',
            salary: '',
            deadline: '',
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Job Title:
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
            </label>
            {/* Add more fields as needed */}
            <button type="submit">Create Job Post</button>
        </form>
    );
};

export default Postjob;
