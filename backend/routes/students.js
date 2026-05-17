const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const Student = require('../models/Student');

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf' && ext !== '.doc' && ext !== '.docx') {
      return cb(new Error('Only PDF/DOC/DOCX resumes are allowed'));
    }
    cb(null, true);
  },
});

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, branch, cgpa, skills } = req.body;
    const existing = await Student.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const student = await Student.create({
      name,
      email,
      password: hashed,
      branch,
      cgpa,
      skills: Array.isArray(skills) ? skills : skills?.split(',').map((s) => s.trim()) || [],
    });

    res.status(201).json({ message: 'Student registered', student });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, student.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({ message: 'Logged in', studentId: student._id });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const students = await Student.find().select('-password');
    res.json(students);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/resume', upload.single('resume'), async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.resumePath = req.file.path;
    await student.save();

    res.json({ message: 'Resume uploaded', resumePath: student.resumePath });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
