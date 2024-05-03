import React, { useState } from 'react';

const SkillModal = ({ visible, onCancel, onOk }) => {
  const [selectedSkills, setSelectedSkills] = useState([]);

  const handleSkillSelect = (skill) => {
    setSelectedSkills((prevSkills) => {
      if (prevSkills.includes(skill)) {
        return prevSkills.filter((s) => s !== skill);
      } else {
        return [...prevSkills, skill];
      }
    });
  };

  const handleSubmit = () => {
    onOk(selectedSkills);
  };

  const handleCancel = () => {
    setSelectedSkills([]); // Clear selected skills
    onCancel(); // Close the modal
  };

  return (
    <div className={`modal ${visible ? 'visible' : ''}`}>
      <div className="modal-content">
        <h1>Select Skills</h1>
        <div>
          <label>
            <input type="checkbox" value="HTML_CSS_UI_Development" onChange={() => handleSkillSelect('HTML_CSS_UI_Development')} />
            HTML/CSS/UI Development
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" value="ES6_JavaScript_jQuery" onChange={() => handleSkillSelect('ES6_JavaScript_jQuery')} />
            ES6/JavaScript/jQuery
          </label>
        </div>
        {/* Add other skills checkboxes here */}
        <div>
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default SkillModal;
