const express = require('express');
const Job = require('../models/Job');
const Student = require('../models/Student');
const Application = require('../models/Application');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { title, company, description, minCgpa, eligibleBranches, requiredSkills } = req.body;
    const job = await Job.create({
      title,
      company,
      description,
      minCgpa: minCgpa || 0,
      eligibleBranches: Array.isArray(eligibleBranches)
        ? eligibleBranches
        : eligibleBranches?.split(',').map((b) => b.trim()) || [],
      requiredSkills: Array.isArray(requiredSkills)
        ? requiredSkills
        : requiredSkills?.split(',').map((s) => s.trim()) || [],
    });
    res.status(201).json({ message: 'Job posted', job });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { branch, minCgpa, skill } = req.query;
    const query = { isActive: true };

    if (branch) query.eligibleBranches = branch;
    if (minCgpa) query.minCgpa = { $lte: Number(minCgpa) };
    if (skill) query.requiredSkills = skill;

    const jobs = await Job.find(query);
    res.json(jobs);
  } catch (error) {
    next(error);
  }
});

router.get('/eligible/:studentId', async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const allJobs = await Job.find({ isActive: true });
    const studentBranch = student.branch.toLowerCase();
    const studentSkills = student.skills.map((skill) => skill.toLowerCase());

    const eligible = [];
    let branchMatchFound = false;
    const skillMisses = [];

    allJobs.forEach((job) => {
      const jobBranches = job.eligibleBranches.map((branch) => branch.toLowerCase());
      const jobSkills = job.requiredSkills.map((skill) => skill.toLowerCase());
      const branchMatch = jobBranches.includes(studentBranch);
      const cgpaMatch = student.cgpa >= job.minCgpa;
      const skillsMatch = jobSkills.every((skill) => studentSkills.includes(skill));

      if (branchMatch) {
        branchMatchFound = true;
      }

      if (branchMatch && cgpaMatch && skillsMatch) {
        eligible.push(job);
        return;
      }

      if (branchMatch && cgpaMatch && !skillsMatch) {
        skillMisses.push(...jobSkills.filter((skill) => !studentSkills.includes(skill)));
      }
    });

    const uniqueMissingSkills = [...new Set(skillMisses)];

    res.json({
      student: {
        branch: student.branch,
        cgpa: student.cgpa,
        skills: student.skills,
      },
      eligible,
      suggestions: {
        missingSkills: uniqueMissingSkills,
        jobsWithBranchMatch: branchMatchFound,
      },
    });

    // end eligible response
  } catch (error) {
    next(error);
  }
});

router.post('/:jobId/apply', async (req, res, next) => {
  try {
    const { studentId } = req.body;
    const { jobId } = req.params;

    if (!studentId) return res.status(400).json({ message: 'studentId is required' });

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (!job.isActive) return res.status(400).json({ message: 'Job is not active' });

    // basic eligibility checks
    if (student.cgpa < (job.minCgpa || 0)) return res.status(400).json({ message: 'Not eligible: CGPA too low' });
    if (job.eligibleBranches && job.eligibleBranches.length > 0 && !job.eligibleBranches.includes(student.branch)) {
      return res.status(400).json({ message: 'Not eligible: branch mismatch' });
    }

    const missingSkill = (job.requiredSkills || []).find((s) => !student.skills.includes(s));
    if (missingSkill) return res.status(400).json({ message: `Not eligible: missing skill ${missingSkill}` });

    const already = await Application.findOne({ student: studentId, job: jobId });
    if (already) return res.status(409).json({ message: 'Already applied for this job' });

    const application = await Application.create({
      student: studentId,
      job: jobId,
      resumePath: student.resumePath || null,
    });

    res.status(201).json({ message: 'Applied successfully', application });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

