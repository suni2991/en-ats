import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";

const Settings = ({ fetchTopicsForCategory }) => {

  const [topic, setTopicName] = useState("");

  const [numberOfQuestions, setNumberOfQuestions] = useState();
 
  const { token } = useAuth();



  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const saveResponse = await axios.post(
        "http://localhost:5041/saveData",
        {
          category: "Assessment", // Add the category field
          topic,
          numberOfQuestions,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Data sent to backend:", saveResponse.data);
      fetchTopicsForCategory("Assessment");
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Data saved successfully!",
      });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          Swal.fire({
            icon: "error",
            title: "Duplicate Entry",
            text: "An entry already exists with the same data.",
          });
        } else {
          console.error("Error sending data to backend:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An error occurred while saving data.",
          });
        }
      } else {
        console.error("Error sending data to backend:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while saving data.",
        });
      }
    }
  };

  return (
    <div className="reg-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="dropdown">Add Topic:</label>
  
          <>
            
            <label htmlFor="topic">Enter Topic Name:</label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopicName(e.target.value)}
            />
            <br />
            <label htmlFor="numberOfQuestions">Enter Number of Questions to be attempted by the candidate:</label>
            <input
              type="number"
              id="numberOfQuestions"
              value={numberOfQuestions}
              required={true}
              onChange={(e) => setNumberOfQuestions(e.target.value)}
            />


          </>
        


        <br />
        <button style={{ marginLeft: "22%" }} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Settings;
