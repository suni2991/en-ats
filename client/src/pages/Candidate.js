import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

import "../styles/Candidate.css";
import logos from "../Assests/enfuse-logo.png";

const URL = process.env.REACT_APP_API_URL;
const Hire = () => {
  const [candidate, setCandidate] = useState(null);
  const [tests, setTests] = useState([]);
  const [completedTests, setCompletedTests] = useState(0);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const Id = auth._id;
  const Category = auth.selectedCategory;
  const isCampusDrive = auth.isCampusDrive;

  const assessmentDataTechnical = [
    {
      no: "1",
      assessment: "Quantitative Test",
      marks: "10",
      duration: "10min",
    },
    { no: "2", assessment: "Vocabulary Test", marks: "10", duration: "5min" },
    {
      no: "3",
      assessment: "Psychometric Test",
      marks: "10",
      duration: "10min",
    },
    { no: "4", assessment: "Java Test", marks: "10", duration: "5min" },
  ];

  const assessmentDataNonTechnical = [
    {
      no: "1",
      assessment: "Quantitative Test",
      marks: "10",
      duration: "10min",
    },
    { no: "2", assessment: "Vocabulary Test", marks: "10", duration: "5min" },
    { no: "3", assessment: "Accounts Test", marks: "15", duration: "10min" },
    { no: "4", assessment: "Excel Test", marks: "15", duration: "5min" },
  ];

  const assessmentDataCampusDrive = [
    {
      no: "1",
      assessment: "Quantitative Test",
      marks: "10",
      duration: "10min",
    },
    { no: "2", assessment: "Vocabulary Test", marks: "10", duration: "5min" },
    {
      no: "3",
      assessment: "Psychometric Test",
      marks: "10",
      duration: "10min",
    },
  ];

  // Fetch candidate details on component mount
  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const res = await axios.get(`/api/candidate/profile/${Id}`);
        if (res.data.status === "SUCCESS") {
          setCandidate(res.data.data);
        } else {
          message.error(res.data.message);
        }
      } catch (error) {
        message.error("Error fetching candidate details");
      }
    };
    fetchCandidate();
  }, [auth]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const assessmentData = isCampusDrive
    ? assessmentDataCampusDrive
    : auth.selectedCategory === "Technical"
    ? assessmentDataTechnical
    : assessmentDataNonTechnical;

  // Initialize tests based on selectedCategory and candidate details
  useEffect(() => {
    if (candidate) {
      let initialTests = [];
      if (isCampusDrive) {
        initialTests = [
          { name: 'Vocabulary', score: candidate.vocabulary.score },
          { name: 'Psychometric', score: candidate.psychometric.score },
          { name: 'Quantitative', score: candidate.quantitative.score },
        ];
      } else if (Category === 'Technical') {
        initialTests = [
          { name: 'Vocabulary', score: candidate.vocabulary.score },
          { name: 'Java', score: candidate.java.score },
          { name: 'Psychometric', score: candidate.psychometric.score },
          { name: 'Quantitative', score: candidate.quantitative.score },
        ];
      } else if (Category === 'Non-Technical') {
        initialTests = [
          { name: 'Vocabulary', score: candidate.vocabulary.score },
          { name: 'Quantitative', score: candidate.quantitative.score },
          { name: 'Accounts', score: candidate.accounts.score },
          { name: 'Excel', score: candidate.excel.score },
        ];
      }
      setTests(initialTests);
    }
  }, [Category, candidate, isCampusDrive]);

  // Check if all tests are completed
  useEffect(() => {
    const completed = tests.filter(test => test.score > -1).length;
    setCompletedTests(completed);
  }, [tests]);

  const handleTestClick = (testName) => {
    const test = tests.find(t => t.name === testName);
    if (test && test.score > -1) {
      message.error(`${testName} exam already completed.`);
      return;
    }
    if (isCampusDrive) {
      navigate(`/campus/${testName}`);
    } else {
      navigate(`/assessment/${testName}`);
    }
    message.success(`${testName} exam started!`);
  };

  useEffect(() => {
    const hasSeenModal = localStorage.getItem('hasSeenModal');
    if (candidate) {
      if (candidate.assessmentDone === false) {
        if (!hasSeenModal) {
          setShowModal(true);
          localStorage.setItem('hasSeenModal', true);
        }
      } else if (candidate.assessmentDone === true) {
        navigate("/thankyou");
      }
    }
  }, [candidate, navigate]);

  const handleSubmit = async () => {
    if (!isChecked) {
      message.error('Please confirm that you have successfully submitted all tests by checking the box');
      return;
    }

    const requiredTests = tests.filter(test => test.name !== 'Accounts' && test.name !== 'Java');
    const completedRequiredTests = requiredTests.filter(test => test.score > -1).length;

    if (completedRequiredTests < requiredTests.length) {
      message.error('Please complete all required tests before submitting.');
    } else {
      try {
        const res = await axios.put(`/api/candidate/${Id}`, { assessmentDone: true, status: 'Test Feedback Awaited' });
        if (res.data.status === "SUCCESS") {
          message.success('All required tests completed! Exam submitted successfully.');
          navigate("/thankyou");
        } else {
          message.error('Error submitting exam.');
        }
      } catch (error) {
        message.error('Error submitting exam.');
      }
    }
  };

  const handleCheckboxChange = () => {
    setIsChecked(true);
  };

  return (
    <div>
      {showModal && (
        <div className="modal" style={{ zIndex: '1000' }}>
          <div className="modal-content">
            <div className="head">
              <center>
                <p
                  style={{
                    marginBottom: "18px",
                    paddingTop: "0px",
                    fontSize: "22px",
                    fontWeight: "bold",
                  }}
                >
                  Welcome to <img src={logos} alt="" width={"15%"} /> Assessment
                  Portal
                </p>
              </center>
            </div>
            <p style={{ fontWeight: "bold", textDecoration: "underline" }}>
              Please read following before taking the Assessment:
            </p>
            <ol>
              <li>
                Applicant will get chance to attempt One test one time only
              </li>
              <li>
                If Personal Details are not match with yours, please Logout
                immediately and contact HR
              </li>
              <li>This Entire Assessment duration will be of 60 minutes</li>
              <center>
                <table>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Assessment Name</th>
                      <th>Marks</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessmentData.map((data, index) => (
                      <tr key={index}>
                        <td>{data.no}</td>
                        <td>{data.assessment}</td>
                        <td>{data.marks}</td>
                        <td>{data.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </center>

              <hr style={{ width: "100%" }} />
              <center>
                <h3 style={{ color: "red", fontWeight: "bold" }}>
                  Keep in Mind:
                </h3>
              </center>
              <li>
                In case during the test If you visit any other{" "}
                <span style={{ color: "red", fontWeight: "bold" }}>
                  BROWSER/TAB/WEBPAGE
                </span>{" "}
                that particular test will be -{" "}
                <span style={{ color: "red" }}>Disabled</span>
              </li>
              <li>
                Use of Electronic Devices other than this Device on which you
                will be completing this exam–{" "}
                <span style={{ color: "red" }}>Not Permitted</span>
              </li>
            </ol>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}

      <div className="test-container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'space-evenly' }}>
          <center><img src={logos} alt="Company Logo" style={{ padding: '20px', width: '15%' }} /></center>
          <center><h1 style={{ textTransform: 'capitalize' }}>Hi, {auth.fullName} </h1></center></div><br />
        <center><h1 style={{ margin: '20px auto' }}>Welcome To EnFuse Assessment Portal</h1></center>
        <div className="test-container-1">
          <div style={{ padding: "25px" }}></div>

          <div className="test-button-1"></div>

          {tests.map((test, index) => (
            <Button
              key={index}
              className="button"
              type="primary"
              onClick={() => handleTestClick(test.name)}
              disabled={test.score > -1}
            >
              {test.name}
            </Button>
          ))}
        </div>
        <div className="testcard">
          <input
            className="checkbox"
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
          ></input>
          <p className="description" style={{ color: "black" }}>
            I have successfully submitted all tests
          </p>
        </div>
        <div className="but-cont">
          <button
            className="sub"
            style={{ margin: "0 auto" }}
            type="submit"
            disabled={!isChecked}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hire;