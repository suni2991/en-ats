const express = require('express');
const Campus = require('../model/CampusModel.js');

const campusRouter = express.Router();

// Get all campuses
campusRouter.get('/api/allcampus', async (req, res) => {
  try {
    const campuses = await Campus.find();
    res.json(campuses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single campus by ID
campusRouter.get('/api/campus/:id', async (req, res) => {
  try {
    const campus = await Campus.findById(req.params.id);
    if (!campus) return res.status(404).json({ message: 'Campus not found' });
    res.json(campus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new campus
campusRouter.post('/api/addwing', async (req, res) => {
  const { name, topics, link } = req.body;
  const campus = new Campus({ name, topics, link });

  try {
    const newCampus = await campus.save();
    res.status(201).json(newCampus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a campus
campusRouter.put('/:id', async (req, res) => {
  const { name, topics, link } = req.body;

  try {
    const campus = await Campus.findById(req.params.id);
    if (!campus) return res.status(404).json({ message: 'Campus not found' });

    campus.name = name || campus.name;
    campus.topics = topics || campus.topics;
    campus.link = link || campus.link;

    const updatedCampus = await campus.save();
    res.json(updatedCampus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = campusRouter;