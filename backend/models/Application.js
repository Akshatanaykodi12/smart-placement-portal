const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    resumePath: { type: String },
  },
  { timestamps: { createdAt: 'appliedAt' } }
);

module.exports = mongoose.model('Application', applicationSchema);
