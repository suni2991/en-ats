import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Select, Input, Form, message } from 'antd';

const { Option } = Select;

const CampusReg = () => {
  const [selectedWing, setSelectedWing] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newWingName, setNewWingName] = useState('');
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [wings, setWings] = useState([]);

  useEffect(() => {
    fetchTopics();
    fetchWings();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await axios.get('http://localhost:5041/topics/Assessment');
      const { topics } = response.data;
      setTopics(topics);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const fetchWings = async () => {
    try {
      const response = await axios.get('http://localhost:5041/api/allcampus');
      setWings(response.data);
    } catch (error) {
      console.error('Error fetching wings:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCandidate = { wing: selectedWing, fullName, email, isCampusDrive: true };
    try {
      const response = await axios.post('http://localhost:5041/api/register/candidate', newCandidate);
      setCandidates([...candidates, response.data]);
      setFullName('');
      setEmail('');
      message.success("Candidate added successfully!");

      // Send email with the link
      const link = `${window.location.origin}/register-wing/${selectedWing}`;
      await axios.post('http://localhost:5041/api/send-link', { email, link });
      message.success("Email sent successfully!");
    } catch (error) {
      console.error('Error adding candidate or sending email:', error);
      message.error("Error adding candidate or sending email.");
    }
  };

  const handleAddWing = async () => {
    console.log('Adding wing:', newWingName, selectedTopics);
    const wingURL = `${window.location.origin}/register-wing/${newWingName}`;
    const newWing = { 
      name: newWingName, 
      topics: selectedTopics, 
      link: wingURL 
    };
    try {
      const response = await axios.post('http://localhost:5041/api/addwing', newWing);
      console.log('Wing added response:', response.data);
      setWings([...wings, response.data]);
      setIsModalVisible(false);
      setNewWingName('');
      setSelectedTopics([]);
      message.success("Wing added and link generated successfully!");
    } catch (error) {
      console.error('Error adding wing:', error);
      message.error("Error adding wing.");
    }
  };

  const getWingTopics = (wingName) => {
    const wing = wings.find((wing) => wing.name === wingName);
    if (wing) {
      return wing.topics.join(', ');
    }
    return '';
  };

  return (
    <div>
      <h1>Campus Drive Wings</h1>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Add Recruitment Drive
      </Button>
      <form onSubmit={handleSubmit}>
        <label>
          Select Wing:
          <select value={selectedWing} onChange={(e) => setSelectedWing(e.target.value)}>
            <option value="">Select</option>
            {wings.map((wing, index) => (
              <option key={index} value={wing.name}>
                {wing.name}
              </option>
            ))}
          </select>
        </label>
        {selectedWing && (
          <>
            <div>
              <p>Screening will be for the topics: {getWingTopics(selectedWing)}</p>
            </div>
            <div>
              <label>
                Email:
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </label>
            </div>
            <button type="submit">+ Email</button>
          </>
        )}
      </form>
      {candidates.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Wing</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate, index) => (
              <tr key={index}>
                <td>{candidate.wing}</td>
                <td>{candidate.fullName}</td>
                <td>{candidate.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Modal
        title="Add Recruitment Drive"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleAddWing}>
          <Form.Item label="Wing Name">
            <Input value={newWingName} onChange={(e) => setNewWingName(e.target.value)} />
          </Form.Item>
          <Form.Item label="Select Topics">
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Select topics"
              value={selectedTopics}
              onChange={(value) => setSelectedTopics(value)}
            >
              {topics.map((topic) => (
                <Option key={topic._id} value={topic.name}>
                  {topic.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit">Submit</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default CampusReg;