import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeRegistration = () => {
  const [employees, setEmployees] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);
  const [selectedJobRoles, setSelectedJobRoles] = useState([]); // For multiple job roles
  const [employeeName, setEmployeeName] = useState('');
  const [employeeState, setEmployeeState] = useState('');

  useEffect(() => {
    // Fetch the available job roles from the backend
    const fetchJobRoles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/job-roles');
        setJobRoles(response.data.job_roles);
      } catch (error) {
        console.error('There was an error fetching job roles:', error);
      }
    };

    fetchJobRoles();
  }, []);

  const handleJobRoleChange = (event) => {
    const value = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedJobRoles(value);  // Update the selected job roles
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newEmployee = {
      name: employeeName,
      state: employeeState,
      jobRoles: selectedJobRoles, // Send selected job roles to the server
    };

    try {
      await axios.post('http://localhost:5000/employees', newEmployee);
      alert('Employee registered successfully!');
      // Optionally, reset the form after successful submission
      setEmployeeName('');
      setEmployeeState('');
      setSelectedJobRoles([]);
    } catch (error) {
      console.error('There was an error registering the employee:', error);
      alert('There was an error registering the employee.');
    }
  };

  return (
    <div>
      <h2>Employee Registration</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="employeeName">Name:</label>
          <input
            type="text"
            id="employeeName"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="employeeState">State:</label>
          <input
            type="text"
            id="employeeState"
            value={employeeState}
            onChange={(e) => setEmployeeState(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="jobRoles">Job Roles:</label>
          <select
            id="jobRoles"
            multiple
            value={selectedJobRoles}
            onChange={handleJobRoleChange}
          >
            {jobRoles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.role_name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Register Employee</button>
      </form>
    </div>
  );
};

export default EmployeeRegistration;
