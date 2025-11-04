import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardTest from "./pages/DashboardTest";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./pages/login/Index";
import Tickets from "./pages/Tickets";
import MyTickets from "./pages/MyTickets";
import StatusUpdateModal from "./components/StatusUpdateModal";
import Profile from "./pages/Profile";
import Schedule from "./pages/Schedule";
import ProtectedRoute from "./routes/ProtectedRoute";
// Inline placeholder for TicketDetail component (replace with the real ./pages/TicketDetail later)
const TicketDetail = () => {
  return <div>Ticket detail page (placeholder)</div>;
};

function App() {
  return (
    <Router>
      <StatusUpdateModal />
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardTest /></ProtectedRoute>} />
        <Route path="/tickets" element={<ProtectedRoute><Tickets /></ProtectedRoute>} />
        <Route path="/tickets/:id" element={<ProtectedRoute><TicketDetail /></ProtectedRoute>} />
        <Route path="/my-tickets" element={<ProtectedRoute><MyTickets /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
