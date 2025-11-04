import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardTest from "./pages/DashboardTest";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./pages/login/Index";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardTest />} />
        <Route path="/Login" element={<Login/>} />
      </Routes>
    </Router>
  );
}

export default App;
