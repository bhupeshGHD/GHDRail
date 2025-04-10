import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Store the selected employee
  const [employeeJobRoles, setEmployeeJobRoles] = useState([]); // Store employee job roles
  const [states, setStates] = useState(["NSW", "VIC", "ACT", "TAS", "SA", "WA"]); // List of states
  const [selectedState, setSelectedState] = useState(""); // Selected state

  // Fetch employees based on the selected state
  useEffect(() => {
    const fetchEmployees = async () => {
      console.log("Fetching employees for state:", selectedState);  // Log the state being used
      try {
        const response = await axios.get(`http://localhost:5000/employees?state=${selectedState}`);
        console.log("Employee Data:", response.data);  // Log the response data
        setEmployees(response.data.employees || []);
      } catch (error) {
        console.error("There was an error fetching the employee data:", error);
      }
    };

    // Fetch employees when state changes or on initial load (if no state selected)
    fetchEmployees();
  }, [selectedState]);

  // Handle state change in dropdown
  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  // Handle the selection of an employee from the gallery
  const handleEmployeeClick = async (employee) => {
    setSelectedEmployee(employee);
  
    try {
      const response = await axios.get(`http://localhost:5000/employee-job-roles?employee_id=${employee.id}`);
      setEmployeeJobRoles(response.data.job_roles || []);
    } catch (error) {
      console.error("Error fetching job roles:", error);
      setEmployeeJobRoles([]);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Employee List</h2>

      {/* State Filter */}
      <label htmlFor="state">Select State: </label>
      <select id="state" value={selectedState} onChange={handleStateChange}>
        <option value="">All</option>
        {states.map(state => (
          <option key={state} value={state}>{state}</option>
        ))}
      </select>

      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        {/* Left side: Employee gallery */}
        <Grid item xs={4}>
          <List>
            {employees.length === 0 ? (
              <Typography>No employees found for selected state.</Typography>
            ) : (
              employees.map(employee => (
                <ListItem
                  key={employee.id}
                  button
                  onClick={() => handleEmployeeClick(employee)}
                  style={{
                    border: '1px solid #ccc',
                    marginBottom: '10px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <ListItemText primary={employee.name} secondary={employee.state} />
                </ListItem>
              ))
            )}
          </List>
        </Grid>

        {/* Right side: Employee details */}
        <Grid item xs={8}>
          {selectedEmployee ? (
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Employee Details: {selectedEmployee.name}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>State:</strong> {selectedEmployee.state}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Employee ID:</strong> {selectedEmployee.id}
                </Typography>

                {/* Job Roles */}
                <Typography variant="h6" gutterBottom>
                  Job Roles
                </Typography>
                {employeeJobRoles && employeeJobRoles.length > 0 ? (
                  employeeJobRoles.map((jobRole, index) => (
                    <div key={index}>
                      <Typography variant="body1" paragraph>
                        <strong>{jobRole.role_name}</strong>
                      </Typography>
                      {/* Competencies */}
                      <Typography variant="body2" color="textSecondary">
                        Competencies:
                      </Typography>
                      {jobRole.competencies && jobRole.competencies.length > 0 ? (
                        <List>
                          {jobRole.competencies.map((competency, competencyIndex) => (
                            <ListItem key={competencyIndex}>
                              <ListItemText 
                                primary={`${competency.name} (Valid until: ${competency.validity})`} 
                              />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography>No competencies available for this role.</Typography>
                      )}
                      <Divider style={{ margin: '10px 0' }} />
                    </div>
                  ))
                ) : (
                  <Typography>No job roles found for this employee.</Typography>
                )}
              </CardContent>
            </Card>
          ) : (
            <Typography>Please select an employee to see details.</Typography>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default EmployeeList;
