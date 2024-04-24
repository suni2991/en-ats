// 
const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    id: {type: Number},
    firstName:{type:String, require:true},
    lastName:{type:String, require:true},
    fullName: {type: String, require:true},
    qualification:{type:String, require:true},
    totalExperience:{type: Number },
    relevantExperience:{type: Number, require:true},
    noticePeriod:{type: String, require:true},
    contact: {type: Number},
    email:{type: String, unique: true},
    appliedPosition:{type: String, require: true},
    currentLocation: {type: String, require:true},
    image: {type: String, require: true, default: ''},
    status: {type: String, default: "In Progress"},
    psychometric: { type: Number, default: -1 },
    quantitative: { type: Number, default: -1 },
    vocabulary: { type: Number, default: -1 },
    java: { type: Number, default: -1 },
    accounts: { type: Number, default: -1 },
    excel: { type: Number, default: -1 },
    username:{type: String},
    password:{type: String},
    confirmPassword:{type: String},
    role:{type: String, default: "Candidate"},
	dateCreated:{type:Date, default: ""},
    createdAt:{type:Date},
    state:{type: String},
    district:{type: String},
    taluka:{type: String},
    selectedCategory:{type: String}
});

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;

