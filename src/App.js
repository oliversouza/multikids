
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Evaluation from './components/Evaluation';
import Report from './components/Report';
import History from './components/History';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/painel" element={<Dashboard />} />
          <Route path="/categories/:childId" element={<Evaluation />} />
          <Route path="/report/:childId" element={<Report />} />
          <Route path="/history/:childId" element={<History />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
