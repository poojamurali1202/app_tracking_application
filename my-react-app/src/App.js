import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard.js';
import RegisterUser from './components/RegisterUser.js';
import UserDashboard from './components/UserDashboard.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterUser />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />}/>
      </Routes>
    </Router>
  );
}

export default App;
