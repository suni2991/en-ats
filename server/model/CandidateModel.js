const mongoose = require("mongoose");

const { Schema } = mongoose; // Destructure Schema from mongoose

const skillSchema = new Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comments: { type: String, required: true },
});

const historySchema = new Schema({
  status: { type: String },
  updatedBy: { type: String },
  updatedAt: { type: Date, default: Date.now },
  note: { type: String },
});


const roundSchema = new Schema({
  roundName: { type: String, required: false },
  panelistName: { type: String },
  interviewDate: { type: Date },
  interviewDt: { type: String },
  feedbackProvided: { type: Boolean, default: false },
  skills: [skillSchema],
  extraComments: { type: String },
  feedback: { type: String },
  meetingURL: { type: String },
});

const bulkUploadSchema = new Schema({
  resumeStatus: {type: 'String', default: 'CV Sourced'},
  testApplicability: {type: 'String'},
  testScore: {type: 'String'},
  l1Interviewer: {type: 'String'},
  l1InterviewStatus: {type: 'String'},
  l2Interviewer: {type: 'String'},
  l2InterviewStatus: {type: 'String'},
  l3Interviewer: {type: 'String'},
  l3InterviewStatus: {type: 'String'},
  candidateFinalStatus: {type: 'String'},
  hrComments: {type: 'String'}
})

const availabilitySchema = new Schema({
  requestedDateRange: { type: [Date] },
  createAt: { type: Date, default: Date.now },
  fromTime: { type: Date },
  toTime: { type: Date },
  availableDate: { type: Date },
  booked: { type: Boolean, default: false },
})

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  actionRequired: { type: Boolean, default: true }, // If the notification requires some action (like selecting available slots)
});

const candidateSchema = new mongoose.Schema({
  id: { type: Number },
  firstName: { type: String },
  lastName: { type: String },
  fullName: { type: String, required: true },
  organisation: { type: String },
  qualification: { type: String },
  totalExperience: { type: Number },
  relevantExperience: { type: Number },
  noticePeriod: { type: String },
  contact: { type: Number },
  email: { type: String, unique: false },
  position: { type: String },
  currentLocation: { type: String },
  image: { type: String, default: "" },
  resume: { type: String },
  status: { type: String, default: "CV Sourced" },
  empCount: { type: Number, default: 0 },
  psychometric: {
    score: { type: Number, default: -1 },
    status: { type: String, enum: ['Pass', 'Fail'] },
  },
  quantitative: {
    score: { type: Number, default: -1 },
    status: { type: String, enum: ['Pass', 'Fail'] },
  },
  vocabulary: {
    score: { type: Number, default: -1 },
    status: { type: String, enum: ['Pass', 'Fail'] },
  },
  java: {
    score: { type: Number, default: -1 },
    status: { type: String, enum: ['Pass', 'Fail'] },
  },
  accounts: {
    score: { type: Number, default: -1 },
    status: { type: String, enum: ['Pass', 'Fail'] },
  },
  excel: {
    score: { type: Number, default: -1 },
    status: { type: String, enum: ['Pass', 'Fail'] },
  },
  totalScores: {
    score: { type: String },
    status: { type: String },
  },
  password: { type: String },
  confirmPassword: { type: String },
  role: {
    type: String,
    enum: ["Applicant", "HR", "Admin", "Enfusian", "Panelist", "HiringManager"],
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
  selectedCategory: { type: String, enum: ["Technical", "Non-Technical", "No-Test"] },
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
  source: { type: String },
  availableSlots: [availabilitySchema],
  notification: [notificationSchema],
  assessmentDone: { type: Boolean, default: false },
  salary: { type: String },
  expectedSalary: { type: String },
  preferedLocation: { type: String },
  atsCleared: { type: Boolean, default: false },
  bulkUpload: {type: bulkUploadSchema},
  testStatus:{type:String, enum:["Test Rejected", "Test Shortlisted", "Re-Test", "Test Feedback Awaited"]},
  isBulkUploadData: {type: Boolean, default: false},
});

const Candidate = mongoose.model("Candidate", candidateSchema);
module.exports = Candidate;
