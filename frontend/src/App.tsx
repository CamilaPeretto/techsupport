import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardTest from "./pages/DashboardTest";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./pages/login/Index";
import Tickets from "./pages/Tickets";
import MyTickets from "./pages/MyTickets";
import StatusUpdateModal from "./components/StatusUpdateModal";
import Profile from "./pages/Profile";
import Schedule from "./pages/Schedule";

function App() {
  return (
    <Router>
      <StatusUpdateModal />
      <Routes>
        <Route path="/" element={<DashboardTest />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/my-tickets" element={<MyTickets />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/schedule" element={<Schedule />} />
      </Routes>
    </Router>
  );
}

export default App;
