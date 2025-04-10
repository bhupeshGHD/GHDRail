import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';  // Import useParams to get the employee ID from the URL

function ProfileViewer() {
  const { id } = useParams();  // Get the employee ID from the URL
  const [employeeDetails, setEmployeeDetails] = useState(null);

  useEffect(() => {
    // Fetch the employee profile based on the employee ID
    const fetchEmployeeProfile = async () => {
      try {
        const response = await axios.get(`/api/employee/${id}/profile`);  // Adjust API URL
        setEmployeeDetails(response.data);
      } catch (error) {
        console.error('Error fetching employee profile:', error);
      }
    };

    if (id) {
      fetchEmployeeProfile();
    }
  }, [id]);  // Re-fetch when the employee ID changes

  if (!employeeDetails) return <div>Loading...</div>;

  return (
    <div>
      <h2>{employeeDetails.name}'s Profile</h2>
      <h3>Job Roles:</h3>
      <ul>
        {employeeDetails.jobRoles.map((jobRole) => (
          <li key={jobRole.id}>
            <h4>{jobRole.name}</h4>
            <ul>
              {jobRole.competencies.map((competency) => (
                <li key={competency.id}>
                  <span>{competency.name} - Validity: {competency.isValid ? 'Valid' : 'Expired'}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProfileViewer;
