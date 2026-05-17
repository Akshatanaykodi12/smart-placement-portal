const API_BASE = 'http://localhost:5000/api';

export const registerStudent = async (data) => {
  const response = await fetch(`${API_BASE}/students/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export const loginStudent = async (data) => {
  const response = await fetch(`${API_BASE}/students/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export const getStudentProfile = async (id) => {
  const response = await fetch(`${API_BASE}/students/${id}`);
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export const uploadResume = async (id, formData) => {
  const response = await fetch(`${API_BASE}/students/${id}/resume`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export const getEligibleJobs = async (studentId) => {
  const response = await fetch(`${API_BASE}/jobs/eligible/${studentId}`);
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export const applyJob = async (jobId, studentId) => {
  const response = await fetch(`${API_BASE}/jobs/${jobId}/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId }),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export const postJob = async (data) => {
  const response = await fetch(`${API_BASE}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export const getAdminAnalytics = async () => {
  const response = await fetch(`${API_BASE}/admin/analytics`);
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};