const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    branch: { type: String, required: true },
    cgpa: { type: Number, required: true, min: 0, max: 10 },
    skills: [{ type: String }],
    resumePath: { type: String },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
