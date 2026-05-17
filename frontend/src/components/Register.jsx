import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerStudent } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    branch: '',
    cgpa: '',
    skills: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerStudent(formData);
      navigate('/');
    } catch (error) {
      alert('Registration failed: ' + error.message);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Student Registration</h2>
        <p className="lead">Create your profile to see eligible jobs.</p>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            name="branch"
            placeholder="Branch"
            value={formData.branch}
            onChange={handleChange}
            required
          />
          <input
            name="cgpa"
            type="number"
            step="0.1"
            placeholder="CGPA"
            value={formData.cgpa}
            onChange={handleChange}
            required
          />
          <input
            name="skills"
            placeholder="Skills (comma-separated)"
            value={formData.skills}
            onChange={handleChange}
          />
          <button className="btn btn-primary" type="submit">Register</button>
        </form>
        <p className="lead">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;