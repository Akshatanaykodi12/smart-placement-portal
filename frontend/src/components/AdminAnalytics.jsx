import { useEffect, useState } from 'react';
import { getAdminAnalytics, postJob } from '../services/api';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    description: '',
    minCgpa: '',
    eligibleBranches: '',
    requiredSkills: '',
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const data = await getAdminAnalytics();
      setAnalytics(data);
    } catch (error) {
      alert('Failed to load analytics: ' + error.message);
    }
  };

  const handleJobChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    try {
      await postJob(jobData);
      alert('Job posted successfully');
      setJobData({
        title: '',
        company: '',
        description: '',
        minCgpa: '',
        eligibleBranches: '',
        requiredSkills: '',
      });
      fetchAnalytics();
    } catch (error) {
      alert('Job post failed: ' + error.message);
    }
  };

  if (!analytics) return <div className="container"><div className="card">Loading...</div></div>;

  return (
    <div className="container">
      <div className="card">
        <h2>Admin Analytics</h2>
        <p className="lead">Overview of platform activity</p>
        <p><strong>Total Students:</strong> {analytics.totalStudents}</p>
        <p><strong>Total Jobs:</strong> {analytics.totalJobs}</p>
        <p><strong>Resumes Uploaded:</strong> {analytics.resumesUploaded}</p>
        <p>Branch Distribution</p>
        <ul>
          {analytics.branchDistribution.map((branch) => (
            <li key={branch.branch}>
              {branch.branch}: {branch.count}
            </li>
          ))}
        </ul>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h2>Post a Job</h2>
        <p className="lead">Create a new job that students can apply to.</p>
        <form onSubmit={handleJobSubmit}>
          <input
            name="title"
            placeholder="Job title"
            value={jobData.title}
            onChange={handleJobChange}
            required
          />
          <input
            name="company"
            placeholder="Company"
            value={jobData.company}
            onChange={handleJobChange}
            required
          />
          <textarea
            name="description"
            placeholder="Job description"
            value={jobData.description}
            onChange={handleJobChange}
            required
            rows={4}
          />
          <input
            name="minCgpa"
            type="number"
            step="0.1"
            placeholder="Minimum CGPA"
            value={jobData.minCgpa}
            onChange={handleJobChange}
            required
          />
          <input
            name="eligibleBranches"
            placeholder="Eligible branches (comma separated)"
            value={jobData.eligibleBranches}
            onChange={handleJobChange}
            required
          />
          <input
            name="requiredSkills"
            placeholder="Required skills (comma separated)"
            value={jobData.requiredSkills}
            onChange={handleJobChange}
            required
          />
          <button className="btn btn-primary" type="submit">Post Job</button>
        </form>
      </div>
    </div>
  );
};

export default AdminAnalytics;