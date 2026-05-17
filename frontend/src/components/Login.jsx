import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginStudent } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginStudent({ email, password });
      localStorage.setItem('studentId', response.studentId);
      navigate('/dashboard');
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Student Login</h2>
        <p className="lead">Access your dashboard and apply to jobs.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn btn-primary" type="submit">Login</button>
        </form>
        <p className="lead">Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;