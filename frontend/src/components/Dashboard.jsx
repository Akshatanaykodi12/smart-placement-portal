import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentProfile, uploadResume } from '../services/api';

const Dashboard = () => {
  const [student, setStudent] = useState(null);
  const [resume, setResume] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
      navigate('/');
      return;
    }
    fetchProfile(studentId);
  }, [navigate]);

  const fetchProfile = async (id) => {
    try {
      const data = await getStudentProfile(id);
      setStudent(data);
    } catch (error) {
      alert('Failed to load profile: ' + error.message);
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resume) return;

    const formData = new FormData();
    formData.append('resume', resume);

    try {
      await uploadResume(localStorage.getItem('studentId'), formData);
      alert('Resume uploaded successfully');
      fetchProfile(localStorage.getItem('studentId'));
      navigate('/jobs');
    } catch (error) {
      alert('Upload failed: ' + error.message);
    }
  };

  if (!student) return <div className="content-area"><div className="page-card">Loading...</div></div>;

  return (
    <div className="content-area">
      <div className="section-grid">
        <div className="page-card summary-card">
          <h2 className="page-title">Student Dashboard</h2>
          <p className="page-subtitle">Track your profile, upload your resume, and explore job matches.</p>
          <ul className="info-list">
            <li><strong>Name:</strong><span>{student.name}</span></li>
            <li><strong>Email:</strong><span>{student.email}</span></li>
            <li><strong>Branch:</strong><span>{student.branch}</span></li>
            <li><strong>CGPA:</strong><span>{student.cgpa}</span></li>
            <li><strong>Skills:</strong><span>{student.skills.join(', ')}</span></li>
            <li><strong>Resume:</strong><span>{student.resumePath ? 'Uploaded' : 'Not uploaded'}</span></li>
          </ul>
        </div>

        <div className="page-card form-card">
          <h3>Resume Upload</h3>
          <p className="lead">Submit your latest resume so recruiters can view your profile.</p>
          <form onSubmit={handleResumeUpload}>
            <label htmlFor="resume-upload">Choose file</label>
            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files[0])}
              required
            />
            <button className="btn btn-primary" type="submit">Upload Resume</button>
          </form>
          <div>
            <button className="btn btn-ghost" onClick={() => navigate('/jobs')}>View Jobs</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;