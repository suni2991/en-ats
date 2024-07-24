import "../styles/Candidate.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import logos from "../Assests/enfuse-logo.png";

const URL = process.env.REACT_APP_API_URL;
const Hire = () => {
  const { auth, token } = useAuth();
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [isClicked] = useState({
    Psychometric: false,
    general: false,
    grammer: false,
    jva: false,
    accounts: false,
  });
  const [useData, setUserData] = useState([]);

  const handleClick1 = () => {
    navigate("/assessment/psychometric");
  };

  const handleClick2 = () => {
    navigate("/assessment/aptitude");
  };

  const handleClick3 = () => {
    navigate("/assessment/vocabulary");
  };

  const handleClick4 = () => {
    navigate("/assessment/java");
  };

  const handleClick5 = () => {
    navigate("/assessment/accounts");
  };

  const handleClick6 = () => {
    navigate("/assessment/excel");
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleSubmit = () => {
    console.log(
      isClicked.Psychometric,
      isClicked.general,
      isClicked.grammer,
      isClicked.jva
    );

    const completedTestsCount = [
      auth.psychometric,
      auth.quantitative,
      auth.vocabulary,
      auth.java,
      auth.excel,
      auth.accounts,
    ].filter((score) => score >= 0).length;
    const historyNote = "Assessment Completed";
    const historyUpdate = {
      updatedBy: auth.fullName,
      updatedAt: new Date(),
      note: historyNote,
    };

    if (auth && completedTestsCount >= 4) {
      setIsChecked(false);
      const userDataWithTimestamp = { ...useData, dateCreated: new Date() };
      axios.put(
        `${URL}/candidate/${auth._id}`,
        {
          ...auth,
          ...userDataWithTimestamp,
          ...historyUpdate,
        },
        {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
      );
      navigate("/thankyou");
    } else {
      navigate("/candidate/candidate");
      Swal.fire({
        title: "Error!",
        text: "Please complete at least four tests",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#00B4D2",
      });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const assessmentDataTechnical = [
    {
      no: "1",
      assessment: "Quantitative Test",
      marks: "10",
      duration: "20min",
    },
    { no: "2", assessment: "Vocabulary Test", marks: "10", duration: "10min" },
    {
      no: "3",
      assessment: "Psychometric Test",
      marks: "10",
      duration: "15min",
    },
    { no: "4", assessment: "Java Test", marks: "15", duration: "15min" },
  ];

  const assessmentDataNonTechnical = [
    {
      no: "1",
      assessment: "Quantitative Test",
      marks: "10",
      duration: "20min",
    },
    { no: "2", assessment: "Vocabulary Test", marks: "10", duration: "10min" },
    { no: "3", assessment: "Accounts Test", marks: "15", duration: "10min" },
    { no: "4", assessment: "Excel Test", marks: "15", duration: "10min" },
  ];

  const assessmentData =
    auth.selectedCategory === "Technical"
      ? assessmentDataTechnical
      : assessmentDataNonTechnical;

  let id = auth._id;
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`${URL}/candidate/${id}`);
      const useData = result.data.data;
      const dateCreated = new Date();
      setUserData({ ...useData, dateCreated });
      auth.psychometric = useData.psychometric;
      auth.quantitative = useData.quantitative;
      auth.vocabulary = useData.vocabulary;
      auth.java = useData.java;
      auth.accounts = useData.accounts;
      auth.excel = useData.excel;
      auth.selectedCategory = useData.selectedCategory;
      auth.dateCreated = useData.dateCreated;

      if (
        auth.psychometric >= 0 ||
        auth.quantitative >= 0 ||
        auth.vocabulary >= 0 ||
        auth.java >= 0 ||
        auth.accounts >= 0 ||
        auth.excel >= 0 ||
        auth.dateCreated !== null
      ) {
        setShowModal(false);
      }

      const completedTestsCount = [
        auth.psychometric,
        auth.quantitative,
        auth.vocabulary,
        auth.java,
        auth.excel,
        auth.accounts,
      ].filter((score) => score >= 0).length;

      if (auth && completedTestsCount >= 4) {
        if (useData.dateCreated) {
          Swal.fire({
            icon: "info",
            title: "Your assessment has been completed already",
            showConfirmButton: false,
            timer: 6000,
          });
          navigate("/thankyou");
        }
      }
    };

    fetchData();
  }, [auth, id, navigate, useData, isChecked, showModal]);
  auth.psychometric = useData.psychometric;
  auth.quantitative = useData.quantitative;
  auth.vocabulary = useData.vocabulary;
  auth.java = useData.java;
  auth.accounts = useData.accounts;
  auth.excel = useData.excel;
  auth.selectedCategory = useData.selectedCategory;
  // auth.typing = useData.typing;

  return (
    <div>
      {showModal && (
        <div className="modal">
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
                Please check your Name & Personal Details on the Left side of
                the portal
              </li>
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
        <div className="test-container-1">
          <div style={{ padding: "25px" }}></div>
          <div className="test-button-1">
            <div>
              <button
                className="button"
                onClick={handleClick3}
                disabled={auth.vocabulary >= 0}
                type="submit"
              >
                Vocabulary
              </button>
            </div>
            <div>
              <button
                className="button"
                onClick={handleClick2}
                disabled={auth.quantitative >= 0}
                type="submit"
              >
                Quantitative
              </button>
            </div>
          </div>
          <div className="test-button-2">
            {auth.selectedCategory === "Technical" && (
              <div>
                <div>
                  <button
                    className="button"
                    onClick={handleClick1}
                    disabled={auth.psychometric >= 0}
                    type="button"
                  >
                    Psychometric
                  </button>
                </div>
                <div>
                  <button
                    className="button"
                    onClick={handleClick4}
                    disabled={auth.java >= 0}
                    type="button"
                  >
                    Java
                  </button>
                </div>
              </div>
            )}
            {auth.selectedCategory === "Non-Technical" && (
              <div>
                <div>
                  <button
                    className="button"
                    onClick={handleClick5}
                    disabled={auth.accounts >= 0}
                    type="button"
                  >
                    Accounts
                  </button>
                </div>
                <div>
                  <button
                    className="button"
                    onClick={handleClick6}
                    disabled={auth.excel >= 0}
                    type="button"
                  >
                    Excel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="testcard">
          <input
            className="checkbox"
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
          ></input>
          <p className="description" style={{ color: "black" }}>
            {" "}
            I have successfully submitted all tests{" "}
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
