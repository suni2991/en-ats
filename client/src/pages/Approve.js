import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { message } from 'antd';

const ApproveJobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5040/job/${id}`);
                setJob(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [id]);

    const handleApprove = async () => {
        try {
            await axios.put(`/job-posts/${id}`, { status: 'Active' });
            setJob(prevJob => ({ ...prevJob, status: 'Active' }));
            message.success('Job Approved successfully')
        } catch (error) {
            console.error('Approve request failed:', error);
        }
    };

    const handleReject = async () => {
        try {
            await axios.put(`/job-posts/${id}`, { status: 'Denied' });
            setJob(prevJob => ({ ...prevJob, status: 'Denied' }));
            message.info('Job Rejected Successfully')
        } catch (error) {
            console.error('Reject request failed:', error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!job) return <p>Job not found</p>;

    const statusMessageStyle = {
        color: job.status === 'Denied' ? 'red' : job.status === 'Active' ? 'green' : 'inherit',
        fontWeight: 'bold', background:'#fff'
    };

    return (
        <div className='bg'>
            <div className="job-details">
            {(job.status === 'Active' || job.status === 'Denied') && (
                <p style={statusMessageStyle}>
                    The current Job is already {job.status} on {new Date(job.postedAt).toLocaleString()}
                </p>
            )}
                <h2>{job.position}</h2><br/><br/>
                <p><strong>Department:</strong> {job.department}</p>
                <p><strong>Description:</strong> {job.description}</p>
                <p><strong>Job Location:</strong> {job.jobLocation}</p>
                <p><strong>Vacancies:</strong> {job.vacancies}</p>
                <p><strong>Experience:</strong> {job.experience}</p>
                <p><strong>Responsibilities:</strong> {job.responsibilities}</p>
                <p><strong>Primary Skills:</strong> {job.primarySkills.join(', ')}</p>
                {job.secondarySkills && (
                    <p><strong>Secondary Skills:</strong> {job.secondarySkills.join(', ')}</p>
                )}
                <p><strong>Status:</strong> {job.status}</p>
                <p><strong>Posted By:</strong> {job.postedBy} on {new Date(job.postedAt).toLocaleString()}</p>

              

                {(job.status !== 'Active' && job.status !== 'Denied') && (
                    <div className="button-container">
                        <button onClick={handleApprove}>Approve</button>
                        <button onClick={handleReject}>Reject</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApproveJobDetails;