const mongoose = require('mongoose');
const { Schema } = mongoose;

const historySchema = new Schema({
    updatedBy: { type: String },
    updatedAt: { type: Date, default: Date.now  },
    note: { type: String }
});

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
        default: "Approval Pending"
    },
    postedBy: {
        type: String,
        default: "HR"
    },
   mgrRole:{
    type: String,
    enum:["HR", "Admin", "Ops-Manager"]
   },
   history:[historySchema],

   

});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
