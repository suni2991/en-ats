import React, { useState, useEffect } from "react";
import axios from "axios";
import QuestionForm from "../components/QuestionForm";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import QuestionList from "../components/QuestionList";
import Settings from "./Settings";
import ViewAll from "../components/ViewAll";
import useAuth from "../hooks/useAuth";
import CampusReg from "../components/CampusReg";

function Questionaire() {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [topics, setTopics] = useState([]);
  const { token } = useAuth();



  const fetchTopicsForCategory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5041/topics/Assessment`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTopics(response.data.topics); // Assuming the response data has a 'topics' property
      console.log("Topics:", response.data.topics); // Log topics for debugging
    } catch (error) {
      console.error("Error fetching topics:", error);
      setTopics([]); // Set topics to an empty array if there's an error
    }
  };

  useEffect(() => {
    console.log(token);
    fetchTopicsForCategory("Assessment"); // Fetch topics for 'Assessment' category on mount
  }, []);

  const getEndpointForTopic = (selectedTopicId) => {
    if (!topics || topics.length === 0) {
      throw new Error("Topics array is empty or undefined.");
    }
    const selectedTopic = topics.find((topic) => topic._id === selectedTopicId);
    if (!selectedTopic) {
      throw new Error(`Invalid topic: ${selectedTopicId}`);
    }
    return `http://localhost:5041/question/${selectedTopicId}`;
  };

  const handleSubmit = (formData) => {
    const endpoint = getEndpointForTopic(selectedTopic);
    axios
      .post(endpoint, formData)
      .then((response) => {
        console.log("Question saved successfully:", response.data);
        // Update the questions state with the newly added question
        setQuestions([...questions, response.data]);
      })
      .catch((error) => {
        console.error("Error saving question:", error);
      });
  };

  const handleTopicChange = (event) => {
    setSelectedTopic(event.target.value);
  };

  return (
    <div className="table-container" style={{ marginTop: "30px" }}>
      <Tabs>
        <TabList style={{ color: "#00B4D2" }}>
          <Tab>Register Candidatea</Tab>
          <Tab>Add Question</Tab>
          <Tab>View Questions</Tab>
          <Tab>Add Subject</Tab>
          <Tab>View Subjects</Tab>
        </TabList>
        <TabPanel>
         
          <CampusReg /></TabPanel>

        <TabPanel>
          <div className="question-form">
            <label>Select Category:</label>
            <select
              className="reg-inputs"
              id="category-select"
              value={selectedTopic}
              onChange={handleTopicChange}
            >
              <option value="">Select</option>
              {Array.isArray(topics) &&
                topics.length > 0 &&
                topics.map((topic) => (
                  <option key={topic._id} value={topic._id}>
                    {topic.topic}
                  </option>
                ))}
            </select>

            {selectedTopic && (
              <QuestionForm
                onSubmit={handleSubmit}
                selectedTopic={selectedTopic}
                getEndpointForTopic={getEndpointForTopic}
                topics={topics}
                fetchTopicsForCategory={fetchTopicsForCategory}
              />
            )}
          </div>

          <center>
            <p style={{ color: "#00B4D2" }}>
              *Set a Question, add options, and set Correct Answer also
            </p>
          </center>
        </TabPanel>

        <TabPanel>
          <QuestionList />
        </TabPanel>
        <TabPanel>
          <Settings fetchTopicsForCategory={()=>{fetchTopicsForCategory("Assessment")}}/>
        </TabPanel>
        <TabPanel>
          <ViewAll />
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default Questionaire;
