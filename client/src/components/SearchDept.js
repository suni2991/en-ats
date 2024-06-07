import React, {useState} from 'react'

const SearchDept = () => {
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const deptList = [
        'Data and Digital-DND', 
        'PACS', 
        'EdTech & Catalog Operations (ECO)', 
        'Analytics Practice', 
        'Adobe_Team', 
        'Software Services', 
        'Business Development', 
        'Human Resources', 
        'Administration', 
        'IT & Governance'
      ];

      const handleDepartmentChange = (event) => {
        setSelectedDepartment(event.target.value);
       
      };

  return (
    <div>
    <select
    name="department"
    id="department"
    value={selectedDepartment}
    onChange={handleDepartmentChange}
    required
  >
    <option value="">Select Department</option>
    {deptList.map((dept, index) => (
      <option key={index} value={dept}>
        {dept}
      </option>
    ))}
  </select>
    </div>
  )
}

export default SearchDept