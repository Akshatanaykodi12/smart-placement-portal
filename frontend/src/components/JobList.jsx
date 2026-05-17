import { useEffect, useState } from 'react';
import { getEligibleJobs, applyJob } from '../services/api';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [student, setStudent] = useState(null);
  const [suggestions, setSuggestions] = useState(null);

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (studentId) {
      fetchEligibleJobs(studentId);
    }
  }, []);

  const fetchEligibleJobs = async (studentId) => {
    try {
      const data = await getEligibleJobs(studentId);
      setJobs(data.eligible);
      setStudent(data.student);
      setSuggestions(data.suggestions);
    } catch (error) {
      alert('Failed to load jobs: ' + error.message);
    }
  };

  const handleApply = async (jobId) => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) return alert('Please login first');
    try {
      await applyJob(jobId, studentId);
      alert('Applied successfully');
    } catch (error) {
      alert('Application failed: ' + error.message);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Eligible Jobs</h2>
        <p className="lead">Jobs tailored to your profile</p>
        {jobs.length === 0 ? (
          <div>
            <p>No eligible jobs were found for your profile.</p>
            {student && (
              <div className="card" style={{ padding: '14px', marginTop: '10px' }}>
                <h3>Profile Summary</h3>
                <p><strong>Branch:</strong> {student.branch}</p>
                <p><strong>CGPA:</strong> {student.cgpa}</p>
                <p><strong>Skills:</strong> {student.skills.join(', ') || 'None'}</p>
              </div>
            )}
            {suggestions?.missingSkills?.length > 0 && (
              <div className="card" style={{ padding: '14px', marginTop: '10px' }}>
                <h3>Suggested skills to add</h3>
                <p>{suggestions.missingSkills.join(', ')}</p>
              </div>
            )}
            {suggestions?.jobsWithBranchMatch ? (
              <p style={{ marginTop: '10px' }}>
                There are jobs for your branch, but they require additional skills.
              </p>
            ) : (
              <p style={{ marginTop: '10px' }}>
                No jobs currently match your branch. Ask the admin to add more jobs for your field.
              </p>
            )}
          </div>
        ) : (
          <ul>
            {jobs.map((job) => (
              <li key={job._id}>
                <h3>{job.title}</h3>
                <p>Company: {job.company}</p>
                <p>Description: {job.description}</p>
                <p>Min CGPA: {job.minCgpa}</p>
                <p>Eligible Branches: {job.eligibleBranches.join(', ')}</p>
                <p>Required Skills: {job.requiredSkills.join(', ')}</p>
                <button onClick={() => handleApply(job._id)}>Apply</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default JobList;