import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardTest from "./pages/DashboardTest";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./pages/login/Index";
import Tickets from "./pages/Tickets";
import MyTickets from "./pages/MyTickets";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardTest />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/my-tickets" element={<MyTickets />} />
      </Routes>
    </Router>
  );
}

export default App;
