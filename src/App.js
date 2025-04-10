import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import EmployeeRegistration from './components/EmployeeRegistration';
import CompetencyManagement from './components/CompetencyManagement';
import EmployeeList from './components/EmployeeList';

import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Competency Management System</h1>
        <nav>
          <Link to="/employee-registration">Employee Registration</Link>
          <span> | </span>
          <Link to="/competency-management">Competency Management</Link>
          <span> | </span>
          <Link to="/employee-list">Employee List</Link>
        </nav>
        <Routes>
          <Route path="/employee-registration" element={<EmployeeRegistration />} />
          <Route path="/competency-management" element={<CompetencyManagement />} />
          <Route path="/employee-list" element={<EmployeeList />} />
          <Route path="/" element={<EmployeeRegistration />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
