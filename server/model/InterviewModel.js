// Interview.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const interviewSchema = new Schema({
  role: String,
  candidateName: String,
  experience: String,
  noticePeriod: String,
  panelistName: String,
  round: { type: String, enum: ['L1', 'L2', 'HR'] }, // Assuming rounds are limited to L1, L2, and HR
  meetingDate: Date,
  meetingURL: String,
  skills: {type: [String]},
});

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview;
