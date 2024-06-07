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
            vacancyStatus,
            secondarySkills,
            primarySkills,
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
            vacancyStatus,
            secondarySkills,
            primarySkills,
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
                jobType: job.jobType,
                jobLocation: job.jobLocation,
                vacancies: job.vacancies,
                registeredCandidates: 0,
                salaryRange: job.salaryRange,
                experience: job.experience,
                modeOfJob: job.modeOfJob,
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
  
  

module.exports = jobRouter;
