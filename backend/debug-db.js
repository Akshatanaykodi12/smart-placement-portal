const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Student = require('./models/Student');
const Job = require('./models/Job');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const students = await Student.find().lean();
    const jobs = await Job.find().lean();
    console.log(JSON.stringify({ students, jobs }, null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
})();
