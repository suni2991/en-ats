import React, { useState, useEffect } from "react";
import { Input, Button, List, message as AntMessage } from "antd";
import axios from "axios";
import "../styles/ChatBox.css"
import { DownOutlined, UpOutlined } from "@ant-design/icons"; // For toggle icons

const deptList = [
  "Data and Digital-DND",
  "PACS",
  "EdTech & Catalog Operations (ECO)",
  "Analytics Practice",
  "Adobe_Team",
  "Software Services",
  "Business Development",
  "Human Resources",
  "Administration",
  "IT & Governance",
];

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage chat window visibility
  const [isMinimized, setIsMinimized] = useState(false); // State to manage chat minimize/maximize
  const [step, setStep] = useState(1); // Steps: 1 = ask name, 2 = ask query, 3 = complete
  const [username, setUsername] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [department, setDepartment] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  // Show welcome message initially with a 1-second gap
  useEffect(() => {
    if (isOpen) {
      setMessages([{ text: "Welcome! How may I assist you today?", sender: "Bot" }]);

      const timer = setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Before we proceed further, may I know your name?", sender: "Bot" },
        ]);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (currentMessage.trim() === "") return;

    // Show user message
    const newMessage = { text: currentMessage, sender: "You" };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    if (step === 1) {
      // First step: get user's name
      setUsername(currentMessage);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `Nice to meet you, ${currentMessage}! Please choose your department.`, sender: "Bot" },
      ]);
      setStep(2);
    } else if (step === 2) {
      // Second step: get department
      setDepartment(currentMessage);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Please enter your query.", sender: "Bot" },
      ]);
      setStep(3);
    } else if (step === 3) {
      // Third step: get user's query and send email
      setUserQuery(currentMessage);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Thank you for your query. A corresponding person will be assigned to you shortly. Please wait.", sender: "Bot" },
      ]);
      sendEmail(username, department, currentMessage); // Send the query as an email
      setStep(4);
    }

    setCurrentMessage(""); // Clear input field
  };

  const sendEmail = async (name, department, query) => {
    try {
      // Make an API call to your backend (assuming you have an email-sending endpoint)
      await axios.post("/api/send-query-email", { name, department, query });
      AntMessage.success("Your query has been sent successfully!");
    } catch (error) {
      AntMessage.error("Failed to send the email. Please try again.");
    }
  };

  // Function to toggle the chat window
  const toggleChatWindow = () => {
    setIsOpen(!isOpen);
  };

  // Function to minimize/maximize the chat window
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="chat-container">
      {/* Button to open the chat window */}
      {!isOpen && (
        <Button type="primary" onClick={toggleChatWindow}>
          Chat with us
        </Button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="chat-box" style={{ position: "fixed", bottom: "20px", right: "20px", width: "300px", border: "1px solid #ccc", borderRadius: "8px" }}>
          <div className="chat-header" style={{ backgroundColor: "#1890ff", color: "#fff", padding: "10px", borderRadius: "8px 8px 0 0", display: "flex", justifyContent: "space-between" }}>
            <div>Chat with us now</div>
            <Button type="link" style={{ color: "#fff" }} onClick={toggleMinimize}>
              {isMinimized ? <DownOutlined /> : <UpOutlined />}
            </Button>
          </div>

          {!isMinimized && (
            <>
              <div className="chat-messages" style={{ height: "200px", overflowY: "scroll", padding: "10px" }}>
                <List
                  bordered={false}
                  dataSource={messages}
                  renderItem={(item) => (
                    <List.Item>
                      <strong>{item.sender}:</strong> {item.text}
                    </List.Item>
                  )}
                />
              </div>

              <div className="chat-input" style={{ padding: "10px", borderTop: "1px solid #ccc" }}>
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder={
                    step === 1
                      ? "Please enter your name..."
                      : step === 2
                      ? "Choose your department..."
                      : "Type your query..."
                  }
                  onPressEnter={handleSendMessage}
                />
                <Button type="primary" onClick={handleSendMessage} style={{ marginTop: "10px" }}>
                  Send
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBox;
