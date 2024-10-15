const mongoose = require("mongoose");

const { Schema } = mongoose; // Destructure Schema from mongoose

const skillSchema = new Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comments: { type: String },
});

const historySchema = new Schema({
  _id: false,
  updatedBy: { type: String },
  updatedAt: { type: Date, default: Date.now },
  note: { type: String },
});

const roundSchema = new Schema({
  roundName: { type: String, required: false },
  panelistName: { type: String },
  interviewDate: { type: Date },
  feedbackProvided: { type: Boolean, default: false },
  skills: [skillSchema],
  feedback: { type: String },
});

const candidateSchema = new mongoose.Schema({
  id: { type: Number },
  firstName: { type: String },
  lastName: { type: String },
  fullName: { type: String, required: true },
  qualification: { type: String },
  totalExperience: { type: Number },
  relevantExperience: { type: Number },
  noticePeriod: { type: String },
  contact: { type: Number },
  email: { type: String, unique: true },
  position: { type: String },
  currentLocation: { type: String },
  image: { type: String, default: "" },
  resume: { type: String },
  status: { type: String, default: "Processing" },
  empCount: { type: Number, default: 0 },
  psychometric: { type: Number, default: -1 },
  quantitative: { type: Number, default: -1 },
  vocabulary: { type: Number, default: -1 },
  java: { type: Number, default: -1 },
  accounts: { type: Number, default: -1 },
  excel: { type: Number, default: -1 },
  password: { type: String },
  confirmPassword: { type: String },
  role: {
    type: String,
    enum: ["Applicant", "HR", "Admin", "Enfusian", "Panelist", "Ops-Manager"],
    default: "Applicant",
  },
  roleId: {
    type: Schema.Types.ObjectId,
    ref: "Role",
  },
  dateCreated: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  department: { type: String },
  state: { type: String },
  lwd: { type: Date },
  joiningDate: { type: Date },
  district: { type: String },
  city: { type: String },
  selectedCategory: { type: String },
  mgrName: { type: String },
  mgrEmail: { type: String },
  notes: { type: String },
  availability: { type: String },
  round: [roundSchema],
  evaluationDetails: { type: Boolean, default: false },
  dob: { type: Date },
  meetingDate: { type: Date },
  history: [historySchema],
  reference: { type: String },
  source:{type: String},
});

const Candidate = mongoose.model("Candidate", candidateSchema);
module.exports = Candidate;
