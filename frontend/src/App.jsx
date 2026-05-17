import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import JobList from './components/JobList';
import AdminAnalytics from './components/AdminAnalytics';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <div>
            <div className="app-brand">Smart Placement Portal</div>
            <div className="app-subtitle">A modern student job portal</div>
          </div>
          <nav className="nav">
            <Link to="/">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/jobs">Jobs</Link>
            <Link to="/admin">Admin</Link>
          </nav>
        </header>
        <main className="content-area">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/admin" element={<AdminAnalytics />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;