import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardTest from "./pages/DashboardTest";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardTest />} />
      </Routes>
    </Router>
  );
}

export default App;
