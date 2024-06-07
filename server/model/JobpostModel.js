const mongoose = require('mongoose');

// Define the schema for vacancy status
const vacancyStatusSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['Active', 'Inactive','Hold'],
        required: true,
    },
    count: {
        type: Number,
        required: true,
        default: 0
    }
});

// Define the schema for job posts
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
    jobType: {
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
    modeOfJob: {
        type: String,
        required: true,
    },
    primarySkills:{
        type: String,
        
    },
    secondarySkills:{
        type:String,
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
    vacancyStatus: {
        type: [vacancyStatusSchema],
        default: [
            { status: 'Active', count: 0 },
            { status: 'Inactive', count: 0 },
            { status: 'Hold', count: 0 }
        ]
    }
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
