import React, { useState } from 'react';
import axios from 'axios';

const CreateJobRole = () => {
  // State to hold the input for the job role
  const [jobRole, setJobRole] = useState('');
  const [message, setMessage] = useState('');

  // Handle the input change
  const handleInputChange = (event) => {
    setJobRole(event.target.value);
  };

  // Handle the form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate the job role input
    if (!jobRole.trim()) {
      setMessage('Job role cannot be empty.');
      return;
    }

    // Submit the new job role to the backend API
    try {
      const response = await axios.post('http://localhost:5000/jobroles', {
        name: jobRole
      });
      setMessage('Job role created successfully!');
      setJobRole(''); // Clear the input field after successful submission
    } catch (error) {
      console.error('There was an error creating the job role:', error);
      setMessage('Error creating job role.');
    }
  };

  return (
    <div className="create-job-role-container">
      <h2>Create New Job Role</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="jobRole">Job Role Name:</label>
          <input
            type="text"
            id="jobRole"
            value={jobRole}
            onChange={handleInputChange}
            placeholder="Enter job role name"
            required
          />
        </div>
        <button type="submit">Create Job Role</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateJobRole;
