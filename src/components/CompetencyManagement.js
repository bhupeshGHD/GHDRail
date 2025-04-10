import React, { useState, useEffect } from 'react';
import axios from 'axios';

//import './App.css';


function CompetencyManagement() {
  const [competencies, setCompetencies] = useState([]);

  useEffect(() => {
    async function fetchCompetencies() {
      try {
        const response = await axios.get('https://your-api-endpoint.com/competencies');
        setCompetencies(response.data);
      } catch (error) {
        console.error('Error fetching competencies:', error);
      }
    }

    fetchCompetencies();
  }, []);

  return (
    <div>
      <h2>Competency Management</h2>
      <ul>
        {competencies.map((competency) => (
          <li key={competency.id}>{competency.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default CompetencyManagement;
