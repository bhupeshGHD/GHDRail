const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');  // Import the pg library

const app = express();
const port = 5000;

// Enable CORS for all routes (you can restrict this if needed)
app.use(cors());

// Parse JSON requests
app.use(express.json());

// Set up PostgreSQL connection
const pool = new Pool({
  user: 'postgres',           // e.g., postgres
  host: 'localhost',
  database: 'GHDRail',        // your database name from pgAdmin
  password: 'BGHDs@123',      // your password
  port: 5432,                 // Default PostgreSQL port
});

// Route to get all employees or filter by state
app.get('/employees', async (req, res) => {
  const { state } = req.query;  // Get the state from query parameter

  try {
    let result;
    if (state) {
      // Fetch employees based on selected state
      result = await pool.query('SELECT * FROM employees WHERE state = $1', [state]);
    } else {
      // Fetch all employees
      result = await pool.query('SELECT * FROM employees');
    }
    res.json({ employees: result.rows });  // Send the employees as response
  } catch (error) {
    console.error('Error querying PostgreSQL:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to get all job roles
app.get('/job-roles', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM job_roles');
    res.json({ job_roles: result.rows });
  } catch (error) {
    console.error('Error querying job roles:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to get employee job roles (many-to-many relationship)
app.get('/employee-job-roles', async (req, res) => {
  const { employee_id } = req.query;  // Get employee_id from query parameter

  try {
    const result = await pool.query(
      `SELECT employees.name AS employee_name, job_roles.role_name, employee_job_roles.start_date, employee_job_roles.end_date
       FROM employee_job_roles
       JOIN employees ON employee_job_roles.employee_id = employees.id
       JOIN job_roles ON employee_job_roles.job_role_id = job_roles.id
       WHERE employee_job_roles.employee_id = $1`, 
      [employee_id]
    );
    res.json({ job_roles: result.rows });
  } catch (error) {
    console.error('Error querying employee job roles:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to add a new employee along with job roles
app.post('/employees', async (req, res) => {
  const { name, state, jobRoles } = req.body;  // Extract data from request body

  try {
    // Step 1: Insert the new employee
    const employeeResult = await pool.query(
      `INSERT INTO employees (name, state) 
       VALUES ($1, $2) RETURNING id`, 
      [name, state]
    );
    
    const employeeId = employeeResult.rows[0].id;  // Get the new employee's ID

    // Step 2: Insert multiple job roles for the employee in the employee_job_roles table
    if (jobRoles && jobRoles.length > 0) {
      for (const jobRoleId of jobRoles) {
        // Ensure job role is valid before inserting
        const jobRoleResult = await pool.query(
          `SELECT * FROM job_roles WHERE id = $1`,
          [jobRoleId]
        );

        if (jobRoleResult.rows.length === 0) {
          return res.status(400).json({ error: `Job role ID ${jobRoleId} not valid.` });
        }

        // Insert job role into employee_job_roles table
        await pool.query(
          `INSERT INTO employee_job_roles (employee_id, job_role_id) 
           VALUES ($1, $2)`,
          [employeeId, jobRoleId]
        );
      }
    }

    res.status(201).json({
      message: 'Employee added successfully!',
      employeeId: employeeId,
      jobRoles: jobRoles
    });
  } catch (error) {
    console.error('Error inserting employee:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
