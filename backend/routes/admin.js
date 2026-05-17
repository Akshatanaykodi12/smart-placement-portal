const express = require('express');
const Student = require('../models/Student');
const Job = require('../models/Job');

const router = express.Router();

router.get('/analytics', async (req, res, next) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalJobs = await Job.countDocuments({ isActive: true });
    const resumesUploaded = await Student.countDocuments({ resumePath: { $exists: true, $ne: null } });
    const branchDistribution = await Student.aggregate([
      { $group: { _id: '$branch', count: { $sum: 1 } } },
      { $project: { branch: '$_id', count: 1, _id: 0 } },
    ]);

    res.json({ totalStudents, totalJobs, resumesUploaded, branchDistribution });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
