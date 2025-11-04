import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardTest from "./pages/DashboardTest";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./pages/login/Index";
import Tickets from "./pages/Tickets";
import MyTickets from "./pages/MyTickets";
import StatusUpdateModal from "./components/StatusUpdateModal";

function App() {
  return (
    <Router>
      <StatusUpdateModal />
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
