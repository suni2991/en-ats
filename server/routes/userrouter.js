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

userRouter.get("/api/getCandidateById/:id", authenticate, checkPermission("view_candidates_report"),
  async (req, res) => {

    try {

      const { id } = req.params;
      console.log('Candidate id: ', id);

      const candidateData = await Candidate.findOne({ _id: id });
      console.log('candidateData', candidateData);

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
      console.log('Candidate id: ', _id);

      const updatedCandidate = await Candidate.findByIdAndUpdate(_id, req.body, { new: true });
      console.log('updatedCandidate: ', updatedCandidate);

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
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const formattedData = {
        Onboarded: 0,
        Rejected: 0,
        Processing: 0,
        Selected: 0,
      };

      candidatesByStatus.forEach((candidate) => {
        formattedData[candidate._id] = candidate.count;
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
      const { roundIndex, feedback, feedbackProvided, skills, history } =
        req.body;

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
      candidate.round[roundIndex].feedbackProvided = feedbackProvided;

      if (skills && Array.isArray(skills)) {
        candidate.round[roundIndex].skills = skills;
      }

      await candidate.save();
      res.status(200).json(candidate);
    } catch (error) {
      console.error("Error updating feedback:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

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
    const { id } = req.params;
    const {
      email,
      status,
      joiningDate,
      role,
      historyUpdate,
      mgrName,
      city,
      totalExperience,

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

      const candidate = await Candidate.findByIdAndUpdate(id, updates, {
        new: true,
      });

      if (!candidate) {
        return res.status(404).json({ error: "Candidate not found" });
      }

      if (historyUpdate) {
        candidate.history.push(historyUpdate);
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

userRouter.get("/api/mgr/:mgrName/status-count", async (req, res) => {
  try {
    const mgrName = req.params.mgrName;

    // Aggregate the data to count the status of candidates and gather their names under the specified mgrName
    const statusCounts = await Candidate.aggregate([
      { $match: { mgrName: mgrName } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          names: { $push: "$fullName" } // Collecting the full names of the candidates
        }
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
          names: 1
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
    let { subject } = req.body; // Use 'let' so 'subject' can be modified

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

userRouter.put("/api/candidate/:id/reset-scores", async (req, res) => {
  try {
    const _id = req.params.id;
    let { subject } = req.body; // Use 'let' so 'subject' can be modified

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

userRouter.post("/api/bulk-upload", bulkUpload, async (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0]; // Assuming you want to read the first sheet
    const worksheet = workbook.Sheets[sheetName];

    try {
      // const data = xlsx.utils.sheet_to_json(worksheet);
      // console.log("data", data)
      const processedLinks = [];
      const invalidLinks = [];
      const extractedUrls = [];

      const hyperlinks = [];
      const data = [];
      // const sheetNames = workbook.SheetNames;s
      // Loop through each sheet
      const range = xlsx.utils.decode_range(worksheet['!ref']); // Get the range of the sheet

      // Loop through each cell in the range
      for (let row = range.s.r + 1; row <= range.e.r; row++) { // Start from row 2
        const rowData = { totalScores: {}, round: [] };
        let roundNameHeader1;
        let panelistName1;
        let feedback1;
        let roundNameHeader2;
        let panelistName2;
        let feedback2;
        let roundNameHeader3;
        let panelistName3;
        let feedback3;
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellAddress = xlsx.utils.encode_cell({ r: row, c: col });
          const cell = worksheet[cellAddress];

          const headerRow = range.s.r;

          if (cell) {
            const headerCellAddress = xlsx.utils.encode_cell({ r: headerRow, c: col });
            const headerCell = worksheet[headerCellAddress];
            const headerName = headerCell ? headerCell.v : null;

            if (headerName === "Candidate Name") {
              rowData.fullName = cell.v; // Name
              const nameParts = cell.v.trim().split(' ');

              // Assuming the first part is the first name and the last part is the last name
              const firstName = nameParts[0];
              const lastName = nameParts[nameParts.length - 1];
              rowData.firstName = firstName;
              rowData.lastName = lastName;
            }

            else if (headerName === "Organisation") {
              rowData.organisation = cell.v;
            }

            else if (headerName === "Email ID") {
              rowData.email = cell.v; // Email
            }
            else if (headerName === "Mobile Number") {
              rowData.contact = cell.v; // Mobile Number
            }
            else if (headerName === "Organisation") {
              rowData.organisation = cell.v; // Sr No
            }
            else if (headerName === "Role/Designation") {
              rowData.position = cell.v; // Role/Designation
            }
            else if (headerName === "Total Years of Experience") {
              rowData.totalExperience = convertYearsToNumber(cell.v); // totalExperience
            }
            else if (headerName === "Relevant Experience") {
              rowData.relevantExperience = convertYearsToNumber(cell.v); // relevantExperience
            }
            else if (headerName === "Education") {
              rowData.qualification = cell.v; // qualification
            }
            else if (headerName === "Salary") {
              rowData.salary = cell.v; // salary
            }
            else if (headerName === "Expected Salary") {
              rowData.expectedSalary = cell.v; // expectedSalary
            }
            else if (headerName === "Notice Period/ LWD") {
              rowData.noticePeriod = cell.v; // noticePeriod
            }
            else if (headerName === "Current Location") {
              rowData.currentLocation = cell.v; // currentLocation
            }
            else if (headerName === "Prefered Location") {
              rowData.preferedLocation = cell.v; // preferedLocation
            }
            else if (headerName === "Resume Status") {
              rowData.status = cell.v; // resume status
            }
            else if (headerName === "Test Applicabiilty") {
              rowData.testApplicability = cell.v; // testApplicability(No)
            }
            else if (headerName === "Test Status") {
              console.warn("psychometric.status", cell.v);
              if (cell.v === "-") {
              }

              else {
                rowData.totalScores.status = cell.v; // test status
              }

              if (cell.v === "Shortlisted") {
                rowData.assessmentDone = true;
              }
            }
            else if (headerName === "Test Score") {
              if (cell.v === "-") {
              } else {
                rowData.totalScores.score = cell.v; // Default to -1 if conversion fails
              }
            }
            else if (headerName === "L1 Interviewer") {
              // Get the header name for column 16
              const headerCellAddress = xlsx.utils.encode_cell({ r: range.s.r, c: col }); // Column 16
              const headerCell = worksheet[headerCellAddress];

              roundNameHeader1 = headerCell ? headerCell.v : null; // Get the header value or null if it doesn't exist
              panelistName1 = cell.v;
            }
            else if (headerName === "L1 Interview Status") {
              feedback1 = cell.v;
            }
            else if (headerName === "L2 Interviewer") {
              // Get the header name for column 18
              const headerCellAddress = xlsx.utils.encode_cell({ r: range.s.r, c: col }); // Column 16
              const headerCell = worksheet[headerCellAddress];

              roundNameHeader2 = headerCell ? headerCell.v : null; // Get the header value or null if it doesn't exist
              panelistName2 = cell.v;
            }
            else if (headerName === "L2 Interview Status") {
              feedback2 = cell.v;
            }

            else if (headerName === "L3 Interviewer") {
              // Get the header name for column 20
              const headerCellAddress = xlsx.utils.encode_cell({ r: range.s.r, c: col }); // Column 16
              const headerCell = worksheet[headerCellAddress];

              roundNameHeader3 = headerCell ? headerCell.v : null; // Get the header value or null if it doesn't exist
              panelistName3 = cell.v;
            }
            else if (headerName === "L3 Interview Status") {
              feedback3 = cell.v;
            }

            else if (headerName === "Candidate Final Status") {
              if (cell.v !== "-") {
                rowData.status = cell.v;
              }
            }
            // Candidate Final Status	HR Comments	HR Name
            else if (headerName === "HR Comments") {
              rowData.notes = cell.v;
            }
            else if (headerName === "HR Name") {
              rowData.mgrName = cell.v;
            }
            else if (headerName === "Resume Link" && cell.l) {
              rowData.hyperlinkText = cell.v; // Hyperlink Text
              rowData.resume = cell.l.Target; // Hyperlink URL
            }
          }

        }
        if (roundNameHeader1 && panelistName1 && feedback1) {
          rowData.round.push({ roundName: roundNameHeader1, panelistName: panelistName1, feedback: feedback1 });
        }
        if (roundNameHeader2 && panelistName2 && feedback2) {
          rowData.round.push({ roundName: roundNameHeader2, panelistName: panelistName2, feedback: feedback2 });
        }
        if (roundNameHeader3 && panelistName3 && feedback3) {
          rowData.round.push({ roundName: roundNameHeader3, panelistName: panelistName3, feedback: feedback3 });
        }
        if (rowData.fullName) {
          // data.push(rowData);
          // Check if candidate exists by email or mobile number
          const existingCandidate = await Candidate.findOne({
            $or: [
              { email: rowData.email },
              { contact: rowData.contact }
            ]
          });

          if (existingCandidate) {
            // Update existing candidate
            await Candidate.updateOne({ _id: existingCandidate._id }, { $set: rowData });
          } else {
            // Insert new candidate
            await Candidate.create(rowData);
          }
        }


      }
      // if (data.length > 0) {
      //   await Candidate.insertMany(data);
      // }


      res.status(200).json({ message: "bulk upload done", data });
    } catch (error) {
      console.error('Error parsing Excel data:', error);
      // Check for specific errors like "unexpected field"
      if (error.message.includes('unexpected field')) {
        return res.status(400).json({
          status: 'ERROR',
          message: 'The uploaded Excel file contains unexpected fields. Please check the file format and try again.',
        });
      } else {
        // Handle other parsing errors
        return res.status(500).json({
          status: 'ERROR',
          message: 'An error occurred while processing the Excel file.',
        });
      }
    }
  } catch (error) {
    console.error('Error uploading excel file:', error);
    return res.status(500).json({
      status: 'ERROR',
      message: 'An error occurred while uploading excel file.',
    });
  }
});


function convertYearsToNumber(yearsString) {
  // Use a regular expression to extract the numeric part
  const match = yearsString.match(/(\d+)/);
  return match ? parseInt(match[0], 10) : null; // Return the number or null if not found
}


module.exports = userRouter;
