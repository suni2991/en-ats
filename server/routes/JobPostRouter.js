const jobRouter = require("express").Router();
const Job = require('../model/JobpostModel');

// POST route to create a new job post
jobRouter.post('/createjob', async (req, res) => {
    try {
        const {
            position,
            department,
            description,
            jobType,
            jobLocation,
            vacancies,
           
            salaryRange,
            experience,
            modeOfJob,
            status
        } = req.body;
       
        const newJob = new Job({
            position,
            department,
            description,
            jobType,
            jobLocation,
            vacancies,
           
            salaryRange,
            experience,
            modeOfJob,
            status,
        });

        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (error) {
        res.status(500).json({ error: 'Error creating job post' });
    }
});


// GET route to fetch all job posts
jobRouter.get('/viewjobs', async (req, res) => {
    try {
        const jobPosts = await Job.find();
        res.status(200).json(jobPosts);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching job posts' });
    }
});

// GET route to fetch a single job post by ID
jobRouter.get('/job-posts/:id', async (req, res) => {
    try {
        const jobPost = await Job.findById(req.params.id);
        if (!jobPost) {
            return res.status(404).json({ error: 'Job post not found' });
        }
        res.status(200).json(jobPost);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching job post' });
    }
});

// DELETE route to delete a job post by ID
jobRouter.delete('/job-posts/:id', async (req, res) => {
    try {
        const deletedJob = await Job.findByIdAndDelete(req.params.id);
        if (!deletedJob) {
            return res.status(404).json({ error: 'Job post not found' });
        }
        res.status(200).json(deletedJob);
    } catch (error) {
        res.status(500).json({ error: 'Error deleting job post' });
    }
});

jobRouter.get('/vacancies-by-date', async (req, res) => {
    try {
      const vacanciesByDate = await Job.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$postedAt" } },
            vacancies: { $sum: "$vacancies" }
          }
        },
        { $sort: { _id: 1 } } // Sort by date ascending
      ]);
  
      res.json(vacanciesByDate);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

  jobRouter.get('/vacancies-by-position', async (req, res) => {
    try {
      const vacanciesByPosition = await Job.aggregate([
        {
          $group: {
            _id: "$position", // Group by position
            vacancies: { $sum: "$vacancies" }
          }
        }
      ]);
  
      res.json(vacanciesByPosition.map(item => ({ name: item._id, value: item.vacancies })));
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });
  
  

module.exports = jobRouter;
