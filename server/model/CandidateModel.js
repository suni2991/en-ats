// 
const mongoose = require('mongoose');



const candidateSchema = new mongoose.Schema({
  
    id: {type: Number},
    firstName:{type:String},
    lastName:{type:String},
    fullName: {type: String, require:true},
    qualification:{type:String},
    totalExperience:{type: Number },
    relevantExperience:{type: Number},
    noticePeriod:{type: String},
    contact: {type: Number},
    email:{type: String, unique: true, require:true},
    position:{type: String},
    currentLocation: {type: String},
    image: {type: String, default: ''},
    resume:{type: String},
    status: {type: String, default: "In Progress"},
    empCount: {type: Number, default: 0},
    psychometric: { type: Number, default: -1 },
    quantitative: { type: Number, default: -1 },
    vocabulary: { type: Number, default: -1 },
    java: { type: Number, default: -1 },
    accounts: { type: Number, default: -1 },
    excel: { type: Number, default: -1 },
    
    password:{type: String},
    confirmPassword:{type: String},
    role:{type: String, enum: ['Candidate', 'HR', 'Admin', 'Enfusian'], default: "Candidate"},
	dateCreated:{type:Date, default: Date.now},
    createdAt:{type:Date, default: Date.now},
    state:{type: String},
    district:{type: String}, 
    taluka:{type: String},
    selectedCategory:{type: String},
    mgrName: {type: String},
    mgrEmail: {type: String},
    skills: [
      {
        name: {
          type: String,
          required: true,
        },
        rating:{type: Number},
        comments:{type: String},
      },
    ],
  notes: { type: String },
  availability: { type: String},
  panelistName: { type: String, default: 'HR'},
  round: { type: String },
  evaluationDetails: { type: Boolean },
  dob: {type:Number},
  meetingDate: {type: Date}
});

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;

