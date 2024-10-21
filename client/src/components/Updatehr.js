import React, { useState } from "react";
import axios from "axios";
import "../styles/Regform.css";
import { Tooltip, message, Button } from "antd";
import useAuth from "../hooks/useAuth";

const URL = process.env.REACT_APP_API_URL;
const Updatehr = ({ closeModal }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    role: "",
    empCount: 0,
  });

  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState([]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setSearchValue(value);
    if (value.length > 1) {
      // Only fetch if input has 2 or more characters
      console.warn("token ", token);
      try {
        // Fetch data from your API (replace with your actual API endpoint)
        const response = await axios.get(`${URL}/candidates/search/${value}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.warn("url ", `${URL}/candidates/search/${value}`);
        console.warn("response ", response.data);
        console.warn("length ", response.data.length);
        // Assume response contains a list of suggestions
        setSuggestions(response.data);
        // console.warn("suggestions ", suggestions.length);
        setShowSuggestions(true); // Show suggestions dropdown
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      setShowSuggestions(false); // Hide suggestions if input length is less
    }
  };

  const handleSuggestionClick = (id, suggestion) => {
    setSearchValue(suggestion); // Set clicked suggestion as input value
    setFormData((prevData) => ({
      ...prevData,
      id: id,
      fullName: suggestion,
    }));
    setShowSuggestions(false); // Hide suggestion dropdown
  };

  const handleRoleChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      role: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const password = Math.random().toString(36).slice(-8);
    // const createdAt = new Date();
    // const fullName = `${formData.firstName} ${formData.lastName}`;

    // if (!formData.email.endsWith("@enfuse-solutions.com")) {
    //   message.error('Email must end with "@enfuse-solutions.com"');
    //   return;
    // }
    console.warn("suggestion XXX ", searchValue);
    console.warn("form data ", formData);

    //candidates/update/:id
    try {
      const response = await axios.patch(
        `${URL}/candidates/update/${formData.id}`,
        {
          ...formData,
        }
      );
      console.warn("response ", response);
      message.success("User Updated Successfully");
      setFormData({
        fullName: "",
        role: "",
        empCount: 0,
      });
      closeModal();
    } catch (error) {
      console.error("Error updating user:", error);
      message.error("Error updating user");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="formContainer">
          <div className="block">
            <div className="autocomplete-container">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyUp={handleChange}
                placeholder="Search..."
              />
              {showSuggestions && suggestions && suggestions.length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() =>
                        handleSuggestionClick(
                          suggestion._id,
                          suggestion.fullName
                        )
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {suggestion.fullName}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="block">
            <div>
              <label htmlFor="role">Role:</label>
              <select
                id="roleSelect"
                name="role"
                value={formData.role}
                onChange={handleRoleChange}
              >
                <option>Choose Role</option>
                <option value="HR">HR</option>
                <option value="Admin">Admin</option>
                <option value="Panelist">Panelist</option>
                <option value="Ops-Manager">Ops-Manager</option>
              </select>
            </div>
          </div>
        </div>
        <div id="btnWrapper">
          <Tooltip title="Submit" color="red">
            <Button
              type="submit"
              className="add-button"
              style={{ backgroundColor: "#A50707" }}
              onClick={handleSubmit}
            >
              Update User
            </Button>
          </Tooltip>
        </div>
      </form>
    </div>
  );
};

export default Updatehr;
