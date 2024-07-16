const jobRouter = require("express").Router();
const Job = require('../model/JobpostModel');
const Candidate = require('../model/CandidateModel')

// POST route to create a new job post
jobRouter.post('/createjob', async (req, res) => {
  const { position, department, description, jobLocation, vacancies, experience, primarySkills, secondarySkills, postedBy, status, mgrRole } = req.body;

    const newJob = new Job({
        position,
        department,
        description,
        jobLocation,
        vacancies,
        experience,
        primarySkills,
        secondarySkills,
        postedBy,
        status,
        mgrRole,
        history: [{
            updatedBy: postedBy,
            updatedAt: new Date(),
            note: 'New Job created & sent for Approval'
        }]
    });

    try {
        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// GET route to fetch all job posts
jobRouter.get('/viewjobs', async (req, res) => {
  const { mgrRole, fullName } = req.query;
 
  try {
    let jobs;
    if (mgrRole === 'HR' || mgrRole === 'Admin') {
      jobs = await Job.find({ status: { $nin: ['Approval Pending', 'Denied'] } });
    } else {
      const fullNameRegex = new RegExp(fullName, 'i');
      jobs = await Job.find({ 
        postedBy: fullNameRegex,
        status: { $nin: ['Approval Pending', 'Denied'] }
      });
    }
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching jobs' });
  }
});
//by postedBy
jobRouter.get('/viewpositions/postedBy/:fullName', async (req, res) => {
  const { fullName } = req.params;

  try {
    // Retrieve jobs posted by the specific user and not in 'Approval Pending' status
    const fullNameRegex = new RegExp(`^${fullName}$`, 'i');
    const jobPosts = await Job.find({ 
      postedBy: fullNameRegex, 
      status: { $ne: 'Approval Pending' } 
    });
    res.status(200).json(jobPosts);
  } catch (error) {
    console.error('Error fetching job posts:', error);
    res.status(500).json({ error: 'Error fetching job posts' });
  }
});

jobRouter.get('/pendingjobs', async (req, res) => {
  const { mgrRole, fullName } = req.query;

  try {
    let jobPosts;
    if (mgrRole === 'HR' || mgrRole === 'Admin') {
      jobPosts = await Job.find({ status: { $in: ['Approval Pending', 'Denied'] } });
    } else {
      const fullNameRegex = new RegExp(fullName, 'i');
      jobPosts = await Job.find({ 
        postedBy: fullNameRegex,
        status: { $in: ['Approval Pending', 'Denied'] }
      });
    }
    res.status(200).json(jobPosts);
  } catch (error) {
    console.error('Error fetching job posts:', error);
    res.status(500).json({ error: 'Error fetching job posts' });
  }
});

jobRouter.get('/job/:id', async (req, res) => {
  const jobId = req.params.id;

  try {
      const job = await Job.findById(jobId);

      if (!job) {
          return res.status(404).json({ message: 'Job not found' });
      }

      res.status(200).json(job);
  } catch (error) {
      console.error('Error fetching job by ID:', error);
      res.status(500).json({ message: 'Server error' });
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
        const vacanciesByDepartmentAndPosition = await Job.aggregate([
            {
                $unwind: "$vacancyStatus"
            },
            {
                $group: {
                    _id: { department: "$department", position: "$position", status: "$vacancyStatus.status" },
                    count: { $sum: "$vacancyStatus.count" }
                }
            },
            {
                $group: {
                    _id: { department: "$_id.department", position: "$_id.position" },
                    vacancyStatus: {
                        $push: { status: "$_id.status", count: "$count" }
                    }
                }
            },
            {
                $group: {
                    _id: "$_id.department",
                    positions: {
                        $push: { position: "$_id.position", vacancyStatus: "$vacancyStatus" }
                    }
                }
            }
        ]);

        res.json(vacanciesByDepartmentAndPosition.map(item => ({
            department: item._id,
            positions: item.positions
        })));
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
  
  

  jobRouter.get('/positions', async (req, res) => {
    try {
        // Fetch all jobs
        const jobs = await Job.find();

        // Fetch all candidates and group by position
        const candidates = await Candidate.aggregate([
            { $group: { _id: "$position", count: { $sum: 1 } } }
        ]);

        // Create a map to store consolidated data
        const consolidatedData = {};

        // Populate the map with job positions and their vacancies
        jobs.forEach(job => {
            consolidatedData[job.position] = {
                position: job.position,
                department: job.department,
                description: job.description,
                responsibilities: job.responsibilities,
                jobLocation: job.jobLocation,
                vacancies: job.vacancies,
                registeredCandidates: 0,
               
                experience: job.experience,
              
                postedAt: job.postedAt,
                status: job.status
            };
        });

        // Count the number of candidates for each position
        candidates.forEach(candidate => {
            const position = candidate._id;
            if (consolidatedData[position]) {
                consolidatedData[position].registeredCandidates = candidate.count;
            } else {
                consolidatedData[position] = {
                    position,
                    vacancies: 0,
                    registeredCandidates: candidate.count
                };
            }
        });

        // Convert the consolidated data into an array format
        const result = Object.values(consolidatedData);

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching positions data', error });
    }
});

//11-06-2024

jobRouter.get('/positions-with-vacancies/:department', async (req, res) => {
    const department = req.params.department;
    try {
      const positions = await Job.find({ department: department, vacancies: { $gt: 0 } }, 'position vacancies');
      res.json({ positions });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

jobRouter.get('/vacancy-status/:position', async (req, res) => {
    const position = req.params.position;
    try {
      const vacancyStatusCounts = await Candidate.aggregate([
        { $match: { position: position } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);
      res.json(vacancyStatusCounts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  jobRouter.put('/job-posts/:id', async (req, res) => {
    const jobId = req.params.id;
    const {
        position,
        department,
        jobLocation,
        experience,
        vacancies,
        postedBy,
        status,
        description,
        responsibilities,
        history
    } = req.body;

    try {
        // Find the job by ID
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Add a new history entry
        if (history && history.length > 0) {
            job.history.push(history[history.length - 1]);
        }

        // Update job details
        job.position = position;
        job.department = department;
        job.jobLocation = jobLocation;
        job.experience = experience;
        job.vacancies = vacancies;
        job.postedBy = postedBy;
        job.status = status;
        job.description = description;
        job.responsibilities = responsibilities;

        // Save the updated job
        const updatedJob = await job.save();

        res.status(200).json(updatedJob);
    } catch (error) {
        console.error('Error updating job details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
  
  

module.exports = jobRouter;
