const userRouter = require("express").Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const xlsx = require('xlsx');
const multer = require("multer");

const Candidate = require("../model/CandidateModel");
const {
  authenticate,
  checkPermission,
} = require("../middleware/PermissionMiddleware");
const RoleModel = require("../model/RoleModel");
const JWT_SECRET = process.env.JWT_SECRET;

userRouter.post(
  "/api/register/candidate",
  // authenticate,
  // checkPermission("create_applicant"),
  async (req, res) => {
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
        department,
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
        history,
        role,
        state,
        district,
        taluka,
        selectedCategory,
        mgrName,
        mgrEmail,
        skills,
        lwd,
        availability,
        panelistName,
        round,
        evaluationDetails,
        reference,
        source,
        availableSlots,
        testStatus
      } = req.body;

      const encryptedPassword = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASSWORD_SECRET_KEY
      ).toString();

      let roleId;
      if (req.body.role) {
        try {
          const roleData = await RoleModel.findOne(
            { name: req.body.role },
            { name: 0, permissions: 0 }
          );
          if (roleData) {
            roleId = roleData._id;
          } else {
            console.log("Role not found");
          }
        } catch (error) {
          console.error("Error fetching role data:", error);
        }
      }

      const newCandidateData = {
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
        department,
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
        testStatus,
        selectedCategory,
        mgrName,
        mgrEmail,
        skills,
        lwd,
        availability,
        panelistName,
        round,
        evaluationDetails,
        history,
        reference,
        source,
        availableSlots,
      };

      if (roleId) {
        newCandidateData.roleId = roleId;
      }
      const newCandidate = new Candidate(newCandidateData);
      const savedCandidate = await newCandidate.save();
      res.status(201).json(savedCandidate);
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ message: "Email already in use" });
      } else {
        res.status(400).json({
          message: "Could not create candidate",
          error: error.message,
        });
      }
    }
  }
);


userRouter.post("/api/login", (req, res) => {
  Candidate.findOne({ email: req.body.email })
    .then((user) => {
      const decryptedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASSWORD_SECRET_KEY
      ).toString(CryptoJS.enc.Utf8);
      if (!user) {
        res.status(404).json({ message: "User not found" });
      } else if (decryptedPassword !== req.body.password) {
        res.json({ message: "Incorrect password" });
      } else {
        let token = "";
        if (user.roleId) {
          token = jwt.sign(
            { userId: user._id, role: user.role, roleId: user.roleId },
            JWT_SECRET
          );
        } else {
          token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET);
        }
        const userWithToken = {
          ...user.toObject(), // Convert Mongoose document to plain JavaScript object
          token: token,
        };
        res.status(200).json(userWithToken);
      }
    })
    .catch((err) =>
      res
        .status(400)
        .json({ message: "Could not login user", error: err.message })
    );
});

userRouter.get(
  "/api/hrs",
  authenticate,
  checkPermission("view_hrs"),
  async (req, res) => {
    const docs = await Candidate.find({
      role: { $in: ["HR", "Panelist", "HiringManager"] },
    });
    res.json(docs);
  }
);

userRouter.get("/api/hrs/candidate-count", async (req, res) => {
  try {
    // Find HR managers with their full names
    const hrManagers = await Candidate.find({ role: "HR", fullName: { $ne: null, $ne: "" } })
      .distinct("fullName"); // Get distinct HR manager full names

    // Count candidates for each HR manager
    const counts = await Candidate.aggregate([
      { $match: { mgrName: { $in: hrManagers } } }, // Match candidates whose mgrName is in the list of HR managers
      { $group: { _id: "$mgrName", candidateCount: { $sum: 1 } } }, // Group by mgrName and count candidates
      { $sort: { candidateCount: -1 } } // Optionally sort by count (descending)
    ]);

    res.json({ hrCounts: counts });
  } catch (error) {
    console.error("Error fetching HR candidate counts:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

userRouter.get(
  "/api/candidatesreport",
  authenticate,
  checkPermission("view_candidates_report"),
  async (req, res) => {
    try {
      const { selectedCategory } = req.query;
      let query = {
        role: { $in: ["Applicant"] },
        status: { $ne: "Onboarded" },
      };

      if (selectedCategory && selectedCategory !== "all") {
        query.selectedCategory = selectedCategory;
      }
      const docs = await Candidate.find(query);
      res.json(docs);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

userRouter.get("/api/getCandidateById/:id", authenticate, checkPermission("view_candidates_report"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const candidateData = await Candidate.findOne({ _id: id });
      res.status(200).json(candidateData);
    } catch (error) {
      console.log('Error updating candidate: ', error);
      res.status(500).json({ message: "Server error" });
    }
  });

userRouter.get(
  "/api/panel/ADMIN",
  authenticate,
  // checkPermission("view_panelist_details_by_admin"),
  async (req, res) => {
    try {
      const statuses = [
        "HR Interview Cleared",
        "Selected",
        "Onboarded",
        "Rejected",
        "Document_Processing",
        "Hold",
        "Offered",
        "Drop-off"
      ];
      const candidates = await Candidate.find({
        status: { $in: statuses },
        role: "Applicant",
      });
      res.json(candidates);
    } catch (error) {
      console.error("Error retrieving candidates:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

userRouter.patch("/api/updateCandidateData/:id", authenticate, checkPermission("view_candidates_report"),
  async (req, res) => {

    try {

      const _id = req.params.id;
      const updatedCandidate = await Candidate.findByIdAndUpdate(_id, req.body, { new: true });

      if (!updatedCandidate) {
        res.json({
          status: 'Fail',
          message: 'Candidate data did not update.'
        })
      } else {
        res.json({
          status: 'Success',
          message: 'Candidate data updated successfully.',
          data: updatedCandidate
        })
      }

      // res.status(200).json(candidateData);

    } catch (error) {
      console.log('Error updating candidate: ', error);
      res.status(500).json({ message: "Server error" });
    }
  });

userRouter.get(
  "/api/candidatesreport",
  authenticate,
  checkPermission("view_candidates_report"),
  async (req, res) => {
    try {
      const { selectedCategory } = req.query;
      let query = {
        role: { $in: ["Applicant"] },
        status: { $ne: "Onboarded" },
      };

      if (selectedCategory && selectedCategory !== "all") {
        query.selectedCategory = selectedCategory;
      }
      const docs = await Candidate.find(query);
      res.json(docs);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

userRouter.get(
  "/api/candidates-status",
  authenticate,
  checkPermission("view_candidate_status"),
  async (req, res) => {
    try {
      const candidatesByStatus = await Candidate.aggregate([
        {
          $match: { role: "Applicant" }
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const formattedData = {
        Onboarded: 0,
        Rejected: 0,
        "CV Sourced": 0,
        "In Progress": 0
      };

      candidatesByStatus.forEach((candidate) => {
        if (candidate._id === "Onboarded" || candidate._id === "Rejected" || candidate._id === "CV Sourced") {
          formattedData[candidate._id] = candidate.count;
        } else {
          formattedData["In Progress"] += candidate.count;
        }
      });

      res.json([formattedData]);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

userRouter.get(
  "/api/candidate/onboarded/:position",
  authenticate,
  checkPermission("view_onboarded_candidates_by_position"),
  async (req, res) => {
    const position = req.params.position;
    const status = "Onboarded";

    try {
      const docs = await Candidate.find({ position, status });
      res.json(docs);
    } catch (error) {
      console.error("Error fetching onboarded candidates:", error);
      res.status(500).json({ error: "Failed to fetch onboarded candidates" });
    }
  }
);

userRouter.get(
  "/api/users-by-role",
  authenticate,
  checkPermission("view_users_by_role"),
  async (req, res) => {
    try {
      const usersByRole = await Candidate.aggregate([
        {
          $group: {
            _id: "$role",
            count: { $sum: 1 },
          },
        },
      ]);

      res.json(usersByRole);
    } catch (error) {
      console.error("Error fetching users by role:", error);
      res.status(500).send("Server Error");
    }
  }
);

userRouter.get("/api/candidate/:status", async (req, res) => {
  const status = req.params.status;
  const docs = await Candidate.find({ status });
  res.json(docs);
});

userRouter.get("/api/candidates/onboarded", async (req, res) => {
  try {
    const statuses = ["Onboarded", "Joined"];
    const docs = await Candidate.find({ status: { $in: statuses } });
    res.json(docs);
  } catch (error) {
    console.error("Error fetching candidates with Onboarded or Joined status:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


userRouter.get("/api/candidates/:fullName", async (req, res) => {
  try {
    const fullName = req.params.fullName;
    const regex = new RegExp(fullName, "i"); // Case-insensitive search
    const candidate = await Candidate.findOne({ fullName: regex });
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    res.json(candidate);
  } catch (error) {
    console.error("Error fetching candidate details:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

userRouter.get(
  "/api/candidate/profile/:id",
  // authenticate,
  // checkPermission("view_candidate_profile"),
  async (req, res) => {
    try {
      const _id = req.params.id;
      const result = await Candidate.findById(_id);
      if (!result) {
        res.json({
          status: "FAILED",
          message: "records not found on this ID",
        });
      } else {
        res.json({
          status: "SUCCESS",
          message: "records found",
          data: result,
        });
      }
    } catch (e) {
      res.send(e);
    }
  }
);

//update records
userRouter.put("/api/candidate/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const result = await Candidate.findByIdAndUpdate(_id, req.body, { new: true });
    if (result) {
      res.status(200).json({
        status: "SUCCESS",
        message: "records updated successfully",
        data: result
      })
    }
    else {
      res.json({
        status: "FAILED",
        message: "record is not updated successfully"
      })

    }
  }
  catch (e) {
    res.send(e)
  }
})


userRouter.put(
  "/api/evaluate/:id",
  // authenticate,
  // checkPermission("update_evaluate_data"),
  async (req, res) => {
    const { id } = req.params;
    const { round, status, history } = req.body;

    try {
      const candidate = await Candidate.findById(id);

      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }

      candidate.round.push(round);

      if (history && Array.isArray(history)) {
        history.forEach((entry) => {
          candidate.history.push({
            status: entry.status,
            updatedBy: entry.updatedBy,
            updatedAt: entry.updatedAt,
            note: entry.note,
          });
        });
      }
      candidate.status = status;

      await candidate.save();

      res
        .status(200)
        .json({ message: "Interview assigned successfully.", candidate });
    } catch (error) {
      console.error("Error updating interview details:", error);
      res.status(500).json({
        message: "Failed to assign interview. Please try again later.",
      });
    }
  }
);

userRouter.put(
  "/api/update-feedback/:id",
  // authenticate,
  // checkPermission("update_feedback_data"),
  async (req, res) => {
    try {
      const candidateId = req.params.id;
      const { roundIndex, feedback, feedbackProvided, extraComments, skills, panelistName } = req.body;

      if (
        roundIndex === undefined ||
        feedback === undefined ||
        feedbackProvided === undefined
      ) {
        return res.status(400).json({
          message: "RoundIndex, feedback, and feedbackProvided are required",
        });
      }

      const candidate = await Candidate.findById(candidateId);
      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }

      if (roundIndex < 0 || roundIndex >= candidate.round.length) {
        return res.status(400).json({ message: "Invalid round index" });
      }

      candidate.round[roundIndex].feedback = feedback;
      candidate.round[roundIndex].extraComments = extraComments;
      candidate.round[roundIndex].feedbackProvided = feedbackProvided;

      if (skills && Array.isArray(skills)) {
        candidate.round[roundIndex].skills = skills;
      }

      candidate.history.push({
        status: candidate.status,
        updatedBy: panelistName, // Use panelistName from frontend
        updatedAt: new Date(),
        note: "Feedback updated",
      });

      await candidate.save();
      res.status(200).json(candidate);
    } catch (error) {
      console.error("Error updating feedback:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// userRouter.put(
//   "/api/update-feedback/:id",
//   // authenticate,
//   // checkPermission("update_feedback_data"),
//   async (req, res) => {
//     try {
//       const candidateId = req.params.id;
//       const { roundIndex, feedback, feedbackProvided, skills, history } =
//         req.body;

//       if (
//         roundIndex === undefined ||
//         feedback === undefined ||
//         feedbackProvided === undefined
//       ) {
//         return res.status(400).json({
//           message: "RoundIndex, feedback, and feedbackProvided are required",
//         });
//       }

//       const candidate = await Candidate.findById(candidateId);
//       if (!candidate) {
//         return res.status(404).json({ message: "Candidate not found" });
//       }

//       if (roundIndex < 0 || roundIndex >= candidate.round.length) {
//         return res.status(400).json({ message: "Invalid round index" });
//       }

//       candidate.round[roundIndex].feedback = feedback;
//       candidate.round[roundIndex].feedbackProvided = feedbackProvided;

//       if (skills && Array.isArray(skills)) {
//         candidate.round[roundIndex].skills = skills;
//       }

//       candidate.history.push({
//         status: candidate.status,
//         updatedBy: req.user.id, // Assuming you have user info in req.user
//         updatedAt: new Date(),
//         note: "Feedback updated",
//       });

//       await candidate.save();
//       res.status(200).json(candidate);
//     } catch (error) {
//       console.error("Error updating feedback:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   }
// );

userRouter.get(
  "/api/panelists/enfusian",
  // authenticate,
  // checkPermission("view_employees_by_enfusian"),
  async (req, res) => {
    try {
      const panelists = await Candidate.find(
        { role: { $in: ["Panelist", "HiringManager", "HR"] } },
        "fullName email availableSlots"
      );
      res.json(panelists);
    } catch (error) {
      console.error("Error fetching panelists:", error);
      res.status(500).json({ message: "Error fetching panelists" });
    }
  }
);

userRouter.get(
  "/api/hrs/name",
  // authenticate,
  // checkPermission("view_hr_name"),
  async (req, res) => {
    try {
      const hrs = await Candidate.find({ role: "HR" }, "fullName email");
      res.status(200).json(hrs);
    } catch (error) {
      console.error("Error fetching HRs:", error);
      res.status(500).json({ message: "Error fetching HRs" });
    }
  }
);

userRouter.get(
  "/api/panelist/:panelistName",
  authenticate,
  checkPermission("view_panelist_details_by_name"),
  async (req, res) => {
    const { panelistName } = req.params;
    try {
      const candidates = await Candidate.find({
        "round.panelistName": panelistName,
        role: "Applicant",
      });
      if (candidates.length === 0) {
        return res
          .status(404)
          .json({ error: "Candidates not found for this panelist" });
      }
      res.json(candidates);
    } catch (error) {
      console.error("Error retrieving candidates:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

//Delete records
userRouter.delete(
  "/api/candidate/:id",
  authenticate,
  checkPermission("delete_candidate_by_id"),
  async (req, res) => {
    try {
      const _id = req.params.id;
      const result = await Candidate.findByIdAndDelete(_id);
      if (!result) {
        res.json({
          status: "FAILED",
          message: "records is Delete successfully",
        });
      } else {
        res.json({
          status: "SUCCESS",
          message: "records not Delete successfully",
          data: result,
        });
      }
    } catch (e) {
      res.send(e);
    }
  }
);

userRouter.get(
  "/api/applicants/position/:position",
  authenticate,
  checkPermission("view_candidates_by_position"),
  async (req, res) => {
    try {
      const { position } = req.params;
      const candidates = await Candidate.find({ position });
      res.json(candidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

userRouter.put(
  "/api/candidates/:id",
  authenticate,
  checkPermission("update_candidate_by_id"),
  async (req, res) => {

    const _id = req.params.id;
    const {
      email,
      status,
      joiningDate,
      role,
      historyUpdate,
      mgrName,
      city,
      totalExperience,
      selectedCategory,
    } = req.body;

    try {
      const updates = {
        email,
        status,
        mgrName,
        city,
        totalExperience,
      };
      if (joiningDate) {
        updates.joiningDate = joiningDate;
      }
      if (role) {
        updates.role = role;
      }
      if (selectedCategory && selectedCategory !== "") {
        updates.selectedCategory = selectedCategory;
      }
      // if (roundIndex >= 0)
      // {
      //   for
      // }

      const candidate = await Candidate.findByIdAndUpdate({ _id, updates, round: requestBody.roundDetails }, {
        new: true,
      });

      if (!candidate) {
        return res.status(404).json({ error: "Candidate not found" });
      }

      if (historyUpdate && historyUpdate.status) {
        candidate.history.push(historyUpdate);
      } else {
        return res.status(400).json({ error: "History update status is required" });
      }

      await candidate.save();
      res.json({ status: "SUCCESS" });
    } catch (error) {
      console.error("Error updating candidate:", error);
      res.status(500).json({ error: "Failed to update candidate" });
    }
  }
);

userRouter.post("/api/candidates/:id/availability", async (req, res) => {
  const { id } = req.params;
  const { availableSlot, notification } = req.body;

  try {
    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    candidate.availableSlots.push({
      availableDate: new Date(availableSlot.availableDate),
      fromTime: new Date(availableSlot.fromTime),
      toTime: new Date(availableSlot.toTime),
      booked: false,
    });

    candidate.notification.push(notification);

    await candidate.save();

    res.status(200).json({ message: "Availability slot and notification added successfully", candidate });
  } catch (error) {
    console.error("Error adding availability slot:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET endpoint to fetch availability slots
userRouter.get("/api/candidates/:id/availability", async (req, res) => {
  const { id } = req.params;
  try {
    const candidate = await Candidate.findById(id).select("availableSlots");
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    res.status(200).json({ availableSlots: candidate.availableSlots });
  } catch (error) {
    console.error("Error fetching availability slots:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// userRouter.get("/api/mgr/:mgrName/status-count", async (req, res) => {
//   try {
//     const mgrName = req.params.mgrName;

//     // Aggregate the data to count the status of candidates and gather their names under the specified mgrName
//     const statusCounts = await Candidate.aggregate([
//       { $match: { mgrName: mgrName } },
//       {
//         $group: {
//           _id: "$status",
//           count: { $sum: 1 },
//           names: { $push: "$fullName" },
//           positions: { $push: "$position" } // Collecting the full names of the candidates
//         }
//       },
//       {
//         $project: {
//           _id: 0,
//           status: "$_id",
//           count: 1,
//           names: 1,
//           positions: 1
//         }
//       }
//     ]);

//     res.status(200).json(statusCounts);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });


userRouter.get("/api/mgr/:mgrName/status-count", async (req, res) => {
  try {
    // const mgrName = req.params.mgrName;

    const { mgrName } = req.params;
    const { startDate, endDate } = req.query;

    let matchQuery = { mgrName };

    // Add date filtering only if both dates are provided
    if (startDate && endDate) {
      matchQuery.dateCreated = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Aggregate the data to count the status of candidates and gather their names under the specified mgrName
    const statusCounts = await Candidate.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          names: { $push: "$fullName" },
          positions: { $push: "$position" } // Collecting the full names of the candidates
        }
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
          names: 1,
          positions: 1
        }
      }
    ]);

    res.status(200).json(statusCounts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});




userRouter.put("/api/panelists/slot/:panelistEmail", async (req, res) => {
  try {
    const { slotId, booked, email } = req.body; // slotId, booked status, and candidate email from the request body
    const { panelistEmail } = req.params; // Email from request params

    // Find the panelist (Candidate with role Panelist) by email (prefer the one in request body if provided)
    const panelist = await Candidate.findOne({ email: email || panelistEmail });

    if (!panelist) {
      return res.status(404).json({ message: "Panelist not found" });
    }

    // Find the specific slot by ID in availableSlots and update booked status
    const slotIndex = panelist.availableSlots.findIndex(slot => slot._id.toString() === slotId);

    if (slotIndex === -1) {
      return res.status(404).json({ message: "Slot not found" });
    }

    // Update the slot's booked status
    panelist.availableSlots[slotIndex].booked = booked;

    // Save the updated panelist
    await panelist.save();

    return res.status(200).json({ message: "Slot booked successfully", panelist });
  } catch (error) {
    console.error("Error updating slot:", error);
    return res.status(500).json({ message: "Server error, unable to book slot" });
  }
});

userRouter.get(
  "/api/panelists/enfusianslot",
  // authenticate,
  // checkPermission("view_employees_by_enfusian"),
  async (req, res) => {
    try {
      const panelists = await Candidate.find(
        { role: { $in: ["Panelist", "HiringManager", "HR"] } },
        "fullName email availableSlots"
      );
      res.json(panelists);
    } catch (error) {
      console.error("Error fetching panelists:", error);
      res.status(500).json({ message: "Error fetching panelists" });
    }
  }
);


userRouter.put("/api/candidate/:id/reset-scores", async (req, res) => {
  try {
    const _id = req.params.id;
    let { subject, history } = req.body; // Use 'let' so 'subject' can be modified

    // Convert the subject to lowercase to make the check case-insensitive
    subject = subject.toLowerCase();

    // List of valid subjects (in lowercase)
    const validSubjects = ['psychometric', 'quantitative', 'vocabulary', 'java', 'accounts', 'excel'];

    if (!validSubjects.includes(subject)) {
      return res.status(400).json({
        status: "FAILED",
        message: "Invalid subject provided"
      });
    }

    candidate.history.push({
      status: candidate.status,
      updatedBy: req.user.id, // Assuming you have user info in req.user
      updatedAt: new Date(),
      note: "Score reset",
    });

    // Build the update object dynamically based on the subject
    const resetFields = {
      [`${subject}.score`]: -1,
      [`${subject}.status`]: null // Optionally reset status to null or another value if needed
    };

    // Perform the update
    const result = await Candidate.findByIdAndUpdate(
      _id,
      { $set: resetFields }, // Dynamically reset the specific subject score
      { new: true }
    );

    if (!result) {
      return res.json({
        status: "FAILED",
        message: `Failed to reset score for ${subject}`
      });
    }

    res.json({
      status: "SUCCESS",
      message: `Score reset for ${subject}`,
      data: result
    });
  } catch (e) {
    res.status(500).json({
      status: "FAILED",
      message: "An error occurred while resetting the score",
      error: e.message
    });
  }
});

userRouter.delete("/api/candidate/slot/:slotId", async (req, res) => {
  const { slotId } = req.params;

  try {
    // Check if the slot exists
    const candidateWithSlot = await Candidate.findOne({
      "availableSlots._id": slotId,
    });

    if (!candidateWithSlot) {
      return res.status(404).json({
        status: 'FAILED',
        message: 'Slot not found',
      });
    }

    // Remove the slot
    const result = await Candidate.updateOne(
      { "availableSlots._id": slotId },
      { $pull: { availableSlots: { _id: slotId } } }
    );

    if (result.modifiedCount > 0) {
      return res.status(200).json({
        status: 'SUCCESS',
        message: 'Slot deleted successfully',
      });
    } else {
      return res.status(500).json({
        status: 'ERROR',
        message: 'Slot deletion failed. Please try again.',
      });
    }
  } catch (error) {
    console.error('Error deleting slot:', error);
    return res.status(500).json({
      status: 'ERROR',
      message: 'An error occurred while deleting the slot',
    });
  }
});


const storageCV = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/bulk");
  },
  filename: function (req, file, cb) {
    const originalName = file.originalname;
    const fileExtension = originalName.slice(
      originalName.lastIndexOf("."),
      originalName.length
    );
    timeValue = Date.now();
    fileName = `${file.fieldname}-${timeValue}${fileExtension}`;
    cb(null, fileName);
  },
});


const fileFilter = (req, file, cb) => {
  let filename = file.originalname;
  let fileExtension = filename.slice(
    filename.lastIndexOf("."),
    filename.length
  );
  if (
    fileExtension === ".xlsx"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "file format not supported. Supported file types are xlsx"
      ),
      false
    );
  }
};

const bulkUpload = multer({
  storage: storageCV,
  fileFilter: fileFilter,
}).single("file");
const validateAndFormatDriveLink = (link) => {
  if (!link) return null;

  // Common Google Drive link patterns
  // /\((.*?)\)/
  const drivePatterns = [
    /https:\/\/drive\.google\.com\/file\/d\/(.*?)\/view/,
    /https:\/\/drive\.google\.com\/open\?id=(.*)/,
    /https:\/\/docs\.google\.com\/spreadsheets\/d\/(.*?)(\/?|\/edit.*$)/
  ];

  for (const pattern of drivePatterns) {
    const match = link.match(pattern);
    if (match) {
      return {
        originalLink: link,
        fileId: match[1],
        isValid: true
      };
    }
  }

  return {
    originalLink: link,
    isValid: false
  };
};


userRouter.post("/api/bulkupload", async (req, res) => {

  try {
    const validRows = req.body.validRows;

    if (!validRows || validRows.length === 0) {
      return res.status(400).json({ status: "ERROR", message: "No valid rows provided." });
    }

    const password = Math.random().toString(36).slice(-8);

    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      process.env.PASSWORD_SECRET_KEY
    ).toString();

    // Iterate through each valid row
    for (const validRow of validRows) {
      const candidate = await Candidate.findOne({ email: validRow["Email ID"] });
      validRow.bulkUpload = {};

      if (candidate) {
        const nameParts = validRow["Candidate Name"].split(' ');

        validRow.isBulkUploadData = true;
        validRow.fullName = validRow['Candidate Name'];
        validRow.firstName = nameParts[0];
        validRow.lastName = nameParts[nameParts.length - 1];
        validRow.contact = validRow['Mobile Number'];
        validRow.organisation = validRow['Organisation'];
        validRow.position = validRow['Role/Designation'];
        validRow.totalExperience = validRow['Total Experience'];
        validRow.relevantExperience = validRow['Relevant Experience'];
        validRow.qualification = validRow['Education'];
        validRow.salary = validRow['Salary'];
        validRow.expectedSalary = validRow['Expected Salary'];
        validRow.noticePeriod = validRow['Notice Period/ LWD'];
        validRow.currentLocation = validRow['Current Location'];
        validRow.preferedLocation = validRow['Prefered Location'];
        validRow.bulkUpload.resumeStatus = validRow['Resume Status'];
        validRow.bulkUpload.testApplicability = validRow['Test Applicability'];
        validRow.bulkUpload.testStatus = validRow['Test Status'];
        validRow.bulkUpload.testScore = validRow['Test Score'];
        validRow.bulkUpload.l1Interviewer = validRow['L1 Interviewer'];
        validRow.bulkUpload.l1InterviewStatus = validRow['L1 Interview Status'];
        validRow.bulkUpload.l2Interviewer = validRow['L2 Interviewer'];
        validRow.bulkUpload.l2InterviewStatus = validRow['L2 Interview Status'];
        validRow.bulkUpload.l3Interviewer = validRow['L3 Interviewer'];
        validRow.bulkUpload.l3InterviewStatus = validRow['L3 Interview Status'];
        validRow.status = validRow['Candidate Final Status'];
        validRow.bulkUpload.hrComments = validRow['HR Comments'];
        validRow.resume = validRow['Resume Link'];
        validRow.mgrName = validRow["HR Name"];

        const manager = await Candidate.findOne({
          fullName: validRow.mgrName,
          role: 'HR'
        });
        validRow.mgrEmail = manager.email;

        // Update existing candidate
        await Candidate.updateOne({ _id: candidate._id }, { $set: validRow });

      } else {
        const nameParts = validRow["Candidate Name"].split(' ');

        validRow.isBulkUploadData = true;
        validRow.fullName = validRow['Candidate Name'];
        validRow.firstName = nameParts[0];
        validRow.lastName = nameParts[nameParts.length - 1];
        validRow.contact = validRow['Mobile Number'];
        validRow.email = validRow['Email ID'];
        validRow.organisation = validRow['Organisation'];
        validRow.designation = validRow['Role/Designation'];
        validRow.totalExperience = validRow['Total Experience'];
        validRow.relevantExperience = validRow['Relevant Experience'];
        validRow.qualification = validRow['Education'];
        validRow.salary = validRow['Salary'];
        validRow.expectedSalary = validRow['Expected Salary'];
        validRow.noticePeriod = validRow['Notice Period/ LWD'];
        validRow.currentLocation = validRow['Current Location'];
        validRow.preferedLocation = validRow['Prefered Location'];
        validRow.bulkUpload.resumeStatus = validRow['Resume Status'];
        validRow.bulkUpload.testApplicability = validRow['Test Applicability'];
        validRow.bulkUpload.testStatus = validRow['Test Status'];
        validRow.bulkUpload.testScore = validRow['Test Score'];
        validRow.bulkUpload.l1Interviewer = validRow['L1 Interviewer'];
        validRow.bulkUpload.l1InterviewStatus = validRow['L1 Interview Status'];
        validRow.bulkUpload.l2Interviewer = validRow['L2 Interviewer'];
        validRow.bulkUpload.l2InterviewStatus = validRow['L2 Interview Status'];
        validRow.bulkUpload.l3Interviewer = validRow['L3 Interviewer'];
        validRow.bulkUpload.l3InterviewStatus = validRow['L3 Interview Status'];
        validRow.status = validRow['Candidate Final Status'];
        validRow.bulkUpload.hrComments = validRow['HR Comments'];
        validRow.mgrName = validRow["HR Name"];
        validRow.resume = validRow['Resume Link'];

        const manager = await Candidate.findOne({
          fullName: validRow.mgrName,
          role: 'HR'
        });
        validRow.mgrEmail = manager.email;

        validRow.password = encryptedPassword; // Set the encrypted password
        validRow.confirmPassword = password;

        // Insert new candidate
        await Candidate.create(validRow);
      }
    }

    res.status(200).json({ data: 'data stored and updated.' });

  } catch (error) {
    console.error('Error uploading data from excel:', error);
    return res.status(500).json({
      status: 'ERROR',
      message: 'An error occurred while uploading data from excel file.',
    });
  }

});

function convertYearsToNumber(yearsString) {
  // Use a regular expression to extract the numeric part
  const match = yearsString.match(/(\d+)/);
  return match ? parseInt(match[0], 10) : null; // Return the number or null if not found
}


module.exports = userRouter;
