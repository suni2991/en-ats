const mongoose = require('mongoose');


const jobSchema = new mongoose.Schema({
    position: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    
    jobLocation: {
        type: String,
        required: true,
    },
    vacancies: {
        type: Number,
        
    },
    experience: {
        type: String,
        required: true,
    },

    responsibilities:{
        type: String,

    },
   
    primarySkills:{
        type: [String],
        required: true,
    },
    secondarySkills:{
        type:[String],
    },
    postedAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        default: "Active"
    },
    postedBy: {
        type: String,
        default: "HR"
    },
    // vacancyStatus: {
    //     type: [vacancyStatusSchema],
    //     default: [
    //         { status: 'Selected', count: 0 },
    //         { status: 'Rejected', count: 0 },
    //         { status: 'L1', count: 0 },
    //         { status: 'L2', count: 0 },
    //     ]
    // }
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
