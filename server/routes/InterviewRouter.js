// interviewRoutes.js

const express = require('express');
const interviewRouter = express.Router();
const Interview = require('../model/InterviewModel');

// POST route to create a new interview
interviewRouter.post('/assignInterview', async (req, res) => {
    try {
      const {
        role,
        candidateName,
        experience,
        noticePeriod,
        panelistName,
        round,
        meetingDate,
        meetingURL,
        skills,
      } = req.body;
  
      // Create a new interview record
      const newInterview = await Interview.create({
        role,
        candidateName,
        experience,
        noticePeriod,
        panelistName,
        round,
        meetingDate,
        meetingURL,
        skills,
      });
  
      res.status(201).json(newInterview);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

// GET route to fetch all interviews
interviewRouter.get('/interviews', async (req, res) => {
  try {
    const interviews = await Interview.find();
    res.status(200).json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET route to fetch a specific interview by ID
interviewRouter.get('/interviews/:id', async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    res.status(200).json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = interviewRouter;
