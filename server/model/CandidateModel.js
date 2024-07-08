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
    status: {type: String, default: "Processing"},
    empCount: {type: Number, default: 0},
    psychometric: { type: Number, default: -1 },
    quantitative: { type: Number, default: -1 },
    vocabulary: { type: Number, default: -1 },
    java: { type: Number, default: -1 },
    accounts: { type: Number, default: -1 },
    excel: { type: Number, default: -1 },
    password:{type: String},
    confirmPassword:{type: String},
    role:{type: String, enum: ['Applicant', 'HR', 'Admin', 'Enfusian', 'Panelist', 'Ops-Manager'], default: "Applicant"},
	  dateCreated:{type:Date, default: Date.now},
    createdAt:{type:Date, default: Date.now},
    department:{type: String},
    state:{type: String},
    lwd:{type:Date},
    joiningDate:{type:Date},
    district:{type: String}, 
    city:{type: String},
    selectedCategory:{type: String},
    mgrName: {type: String},
    mgrEmail: {type: String},

    
  notes: { type: String },
  availability: { type: String},
  
  round:[ {
    
    roundName:{type:String, enum:["L1", "L2", "HR"] },
    panelistName:{type:String},
    interviewDate:{type:Date},
    feedbackProvided:{type: Boolean},
    skills: [
      {
        name: {
          type: String,
          required: true,
        },
        
        rating:{type: Number, default: 0},
        comments:{type: String, default: "No comments"},
      },
    ],
  } ],
  evaluationDetails: { type: Boolean, default: false },
  dob: {type:Date},
  meetingDate: {type: Date}
});

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;

