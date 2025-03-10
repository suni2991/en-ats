const mongoose = require('mongoose');



const campusSchema = new mongoose.Schema({
  name: { type: String, required: true },
  topics: [
    {
  type: String, 
  required: true 
    }
  ],
  link: { type: String, required: true }
});

const Campus = mongoose.model('Campus', campusSchema);

module.exports = Campus;