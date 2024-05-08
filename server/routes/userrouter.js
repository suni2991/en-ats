const userRouter = require("express").Router();
const CryptoJS = require("crypto-js");

const Candidate = require("../model/CandidateModel");

//Create User - or register, a simple post request to save user in db
userRouter.post('/register/candidate', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      fullName,
      qualification,
      totalExperience,
      relevantExperience,
      noticePeriod,
      contact,
      email,
      position,
      currentLocation,
      image,
      resume,
      status,
      empCount,
      psychometric,
      quantitative,
      vocabulary,
      java,
      accounts,
      excel,
      dob,
     
      role,
      state,
      district,
      taluka,
      selectedCategory,
      mgrName,
      mgrEmail,
      skills,
     
      availability,
      panelistName,
      round,
      evaluationDetails,
    } = req.body;

    const encryptedPassword = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SECRET_KEY
    ).toString();

    const newCandidate = new Candidate({
      firstName,
      lastName,
      fullName,
      qualification,
      totalExperience,
      relevantExperience,
      noticePeriod,
      contact,
      email,
      position,
      currentLocation,
      image,
      resume,
      status,
      empCount,
      psychometric,
      quantitative,
      vocabulary,
      java,
      accounts,
      excel,
     dob,
      password: encryptedPassword, // Set the encrypted password
      confirmPassword: req.body.confirmPassword,
      role,
      state,
      district,
      taluka,
      selectedCategory,
      mgrName,
      mgrEmail,
      skills,
    
      availability,
      panelistName,
      round,
      evaluationDetails,
    });

    const savedCandidate = await newCandidate.save();
    res.status(201).json(savedCandidate);
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ message: 'Email already in use' });
    } else {
      res.status(400).json({ message: 'Could not create candidate', error: error.message });
    }
  }
});


//Login User
userRouter.post("/api/login", (req, res) => {
  Candidate.findOne({ email: req.body.email })
    .then((user) => {
      const decryptedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASSWORD_SECRET_KEY
      ).toString(CryptoJS.enc.Utf8);
      if (!user) {
        res.status(404).json({ message: "User not found" });
      }
      else if (decryptedPassword !== req.body.password) {
        res.json({ message: "Incorrect password" });
      } else {
        res.status(200).json(user); //return _id and role as a JSON at least..account Type is a must...in here I return the whole user object
      }
    })
    .catch((err) => res.status(400).json({ message: "Could not login user" }));
});

userRouter.get('/candidates', async (req, res) => {
  const docs = await Candidate.find({ role: "Candidate" });
  res.json(docs)
})

userRouter.get('/hrs', async (req, res) => {
  const docs = await Candidate.find({ role: { $in: ["HR", "Enfusian"] } });
  res.json(docs)
})

userRouter.get('/candidatesreport', async (req, res) => {
  const docs = await Candidate.find({ role: "Candidate" });
  res.json(docs)
})

userRouter.get('/candidates/:email', async (req, res) => {
  const docs = await Candidate.find({ email: req.params.email });
  res.json(docs)
})

userRouter.get('/candidate/status', async (req, res) => {
  const docs = await Candidate.find({ status: "SELECTED" });
  res.json(docs)
})

userRouter.get("/candidate/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const result = await Candidate.findById(_id);
    if (!result) {
      res.json({
        status: "FAILED",
        message: "records not found on this ID"
      })
    }
    else {
      res.json({
        status: "SUCCESS",
        message: "records found",
        data: result
      })
    }
  }
  catch (e) {
    res.send(e)
  }

})

//update records
userRouter.put('/candidate/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const result = await Candidate.findByIdAndUpdate(_id, req.body, { new: true });
    if (!result) {
      res.json({
        status: "FAILED",
        message: "record is not updated successfully"
      })
    }
    else {
      res.json({
        status: "SUCCESS",
        message: "records updated successfully",
        data: result
      })
    }
  }
  catch (e) {
    res.send(e)
  }
})

userRouter.put('/evaluate/:candidateId', async (req, res) => {
  const { candidateId } = req.params;
  const { skills } = req.body;

  try {
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      candidateId,
      { $set: { skills } }, // Update candidate skills
      { new: true }
    );
    res.json(updatedCandidate);
  } catch (error) {
    console.error('Error updating candidate skills:', error);
    res.status(400).json({ message: 'Error updating candidate skills', error });
  }
});
// //To update Evaluation status
// userRouter.put('/evaluate/:candidateId', async (req, res) => {
//   const { candidateId } = req.params;
//   const {
//     firstName,
//     lastName,
//     fullName,
//     qualification,
//     totalExperience,
//     relevantExperience,
//     noticePeriod,
//     contact,
//     email,
//     position,
//     currentLocation,
//     image,
//     dob,
//     resume,
//     status,
//     empCount,
//     psychometric,
//     quantitative,
//     vocabulary,
//     java,
//     accounts,
//     excel,
   
//     role,
//     dateCreated,
//     createdAt,
//     state,
//     district,
//     taluka,
//     selectedCategory,
//     mgrName,
//     mgrEmail,
//     skills,
    
//     availability,
//     panelistName,
//     round,
//     evaluationDetails,
//   } = req.body;

//   try {
//      let candidate = await Candidate.findById(candidateId);
//     if (!candidate) {
//       return res.status(404).json({ error: 'Candidate not found' });
//     }

//     candidate.firstName = firstName;
//     candidate.lastName = lastName;
//     candidate.fullName = fullName;
//     candidate.qualification = qualification;
//     candidate.totalExperience = totalExperience;
//     candidate.relevantExperience = relevantExperience;
//     candidate.noticePeriod = noticePeriod;
//     candidate.contact = contact;
//     candidate.email = email;
//     candidate.position = position;
//     candidate.currentLocation = currentLocation;
//     candidate.image = image;
//     candidate.resume = resume;
//     candidate.status = status;
//     candidate.empCount = empCount;
//     candidate.psychometric = psychometric;
//     candidate.quantitative = quantitative;
//     candidate.vocabulary = vocabulary;
//     candidate.java = java;
//     candidate.accounts = accounts;
//     candidate.excel = excel;
   
//     candidate.dob= dob;
   
//     candidate.role = role;
//     candidate.dateCreated = dateCreated;
//     candidate.createdAt = createdAt;
//     candidate.state = state;
//     candidate.district = district;
//     candidate.taluka = taluka;
//     candidate.selectedCategory = selectedCategory;
//     candidate.mgrName = mgrName;
//     candidate.mgrEmail = mgrEmail;
//     candidate.skills = skills;
//     candidate.rating = rating;
//     candidate.notes = notes;
//     candidate.availability = availability;
//     candidate.panelistName = panelistName;
//     candidate.round = round;
//     candidate.evaluationDetails = evaluationDetails;

//     // Save the updated candidate data
//     candidate = await candidate.save();
//     res.json(candidate);
//   } catch (error) {
//     console.error('Error updating candidate:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// })

//fetch by panelist names
userRouter.get('/panelist/:panelistName', async (req, res) => {
  const { panelistName } = req.params;

  try {
    // Find candidates where panelistName matches
    const candidates = await Candidate.find({ panelistName });

    if (candidates.length === 0) {
      return res.status(404).json({ error: 'Candidates not found for this panelist' });
    }

    res.json(candidates);
  } catch (error) {
    console.error('Error retrieving candidates:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//Delete records
userRouter.delete("/candidate/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const result = await Candidate.findByIdAndDelete(_id);
    if (!result) {
      res.json({
        status: "FAILED",
        message: "records is Delete successfully"
      })
    }
    else {
      res.json({
        status: "SUCCESS",
        message: "records not Delete successfully",
        data: result
      })
    }
  }
  catch (e) {
    res.send(e)
  }
})

userRouter.get('/status-analysis', async (req, res) => {
  try {
    // Aggregate data to count candidates based on application status
    const statusData = await Candidate.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(statusData);
  } catch (error) {
    console.error('Error fetching status analysis data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

userRouter.get('/skills-analysis', async (req, res) => {
  try {
    // Aggregate data to calculate average scores for each skill
    const skillsData = await Candidate.aggregate([
      {
        $group: {
          _id: null,
          avgJava: { $avg: '$java' },
          avgAccounts: { $avg: '$accounts' },
          avgExcel: { $avg: '$excel' },
          avgOthers: { $avg: { $subtract: [100, { $avg: ['$java', '$accounts', '$excel'] }] } },
        },
      },
    ]);

    // Format data to match frontend expectations
    const formattedData = [
      { skill: 'Java', averageScore: Math.round(skillsData[0].avgJava) },
      { skill: 'Accounts', averageScore: Math.round(skillsData[0].avgAccounts) },
      { skill: 'Excel', averageScore: Math.round(skillsData[0].avgExcel) },
      { skill: 'Others', averageScore: Math.round(skillsData[0].avgOthers) },
    ];

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching skills analysis data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = userRouter;
