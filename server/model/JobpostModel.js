const mongoose = require('mongoose');

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
        required: true,
    },
    // fulfilledBy: {
    //     type: Date,
    //     required: true,
    // },
    salaryRange: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    modeOfJob: {
        type: String,
       
        required: true,
    },
    postedAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        default: "Processing"
    }
});

// Create the Job model based on the schema
const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
