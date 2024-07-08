import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('/jobs');
        setJobs(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Job Listings</h1>
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Department</th>
            <th>Description</th>
            <th>Job Type</th>
            <th>Job Location</th>
            <th>Vacancies</th>
            <th>Salary Range</th>
            <th>Experience</th>
            <th>Mode of Job</th>
            <th>Posted At</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id}>
              <td>{job.position}</td>
              <td>{job.department}</td>
              <td>{job.description}</td>
              <td>{job.jobType}</td>
              <td>{job.jobLocation}</td>
              <td>{job.vacancies}</td>
              <td>{job.salaryRange}</td>
              <td>{job.experience}</td>
              <td>{job.modeOfJob}</td>
              <td>{new Date(job.postedAt).toLocaleDateString()}</td>
              <td>{job.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobList;
