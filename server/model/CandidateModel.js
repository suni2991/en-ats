// 
const mongoose = require('mongoose');

const skillsSchema = new mongoose.Schema({
    HTML_CSS_UI_Development: { type: Number, default: 0 },
    ES6_JavaScript_jQuery: { type: Number, default: 0 },
    ReactJS: { type: Number, default: 0 },
    SCSS: { type: Number, default: 0 },
    Any_other_UI_Framework: { type: Number, default: 0 },
    AEM_Any_other_CMS: { type: Number, default: 0 },
    Code_Debugging_Skills: { type: Number, default: 0 },
    Coding_Test: { type: Number, default: 0 },
    General: { type: Number, default: 0 },
    Communication: { type: Number, default: 0 },
    AEM : { type: Number, default: 0 },	 	 
AEMasCloud :{ type: Number, default: 0 },	 	 
Java: { type: Number, default: 0 },	 	 
Sevlet_Services	: { type: Number, default: 0 }, 	 
OSGi:{ type: Number, default: 0 },	 	 
SlingModel:{ type: Number, default: 0 },	 	 
Static_Editable_Template:{ type: Number, default: 0 },	 	 
Frontend_Expertise: { type: Number, default: 0 },	 	 
NodeJS:{ type: Number, default: 0 },
OOPS:{ type: Number, default: 0 },	 	 
RestfulAPI:{ type: Number, default: 0 },	 	 
MongoDB:{ type: Number, default: 0 },	 	 
JavaScript:{ type: Number, default: 0 },
Typescript:{ type: Number, default: 0 },	 	 
HTML:{ type: Number, default: 0 },
CSS:{ type: Number, default: 0 }, 	 
AngularJS:{ type: Number, default: 0 },	 	 
AWS_Experience:{ type: Number, default: 0 },
  });

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
    skills: { type: skillsSchema},
  rating: { type: Number, min: 1, max: 5 },
  notes: { type: String },
  availability: { type: String},
  panelistName: { type: String, default: 'HR'},
  round: { type: String },
  evaluationDetails: { type: Boolean },
  dob: {type:Number}
});

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;

