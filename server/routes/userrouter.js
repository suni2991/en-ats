const userRouter = require("express").Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const Candidate = require("../model/CandidateModel");
const {
  authenticate,
  checkPermission,
} = require("../middleware/PermissionMiddleware");
const RoleModel = require("../model/RoleModel");
const JWT_SECRET = process.env.JWT_SECRET;

//Create User - or register, a simple post request to save user in db
// userRouter.post(
//   "/register/candidate",
//   // authenticate,
//   // checkPermission("create_applicant"),
//   async (req, res) => {
//     try {
//       const {
//         firstName,
//         lastName,
//         fullName,
//         qualification,
//         totalExperience,
//         relevantExperience,
//         noticePeriod,
//         contact,
//         email,
//         position,
//         currentLocation,
//         image,
//         department,
//         resume,
//         status,
//         empCount,
//         psychometric,
//         quantitative,
//         vocabulary,
//         java,
//         accounts,
//         excel,
//         dob,
//         history,
//         role,
//         state,
//         district,
//         taluka,
//         selectedCategory,
//         mgrName,
//         mgrEmail,
//         skills,
//         lwd,
//         availability,
//         panelistName,
//         round,
//         evaluationDetails,
//         reference,
//       } = req.body;

//       const encryptedPassword = CryptoJS.AES.encrypt(
//         req.body.password,
//         process.env.PASSWORD_SECRET_KEY
//       ).toString();

//       let roleId = "";
//       if (req.body.role) {
//         try {
//           const roleData = await RoleModel.findOne(
//             { name: req.body.role },
//             { name: 0, permissions: 0 }
//           );
//           if (roleData) {
//             roleId = roleData._id;
//           } else {
//             console.log("Role not found");
//           }
//         } catch (error) {
//           console.error("Error fetching role data:", error);
//         }
//       }

//       const newCandidate = new Candidate({
//         firstName,
//         lastName,
//         fullName,
//         qualification,
//         totalExperience,
//         relevantExperience,
//         noticePeriod,
//         contact,
//         email,
//         position,
//         currentLocation,
//         image,
//         resume,
//         status,
//         department,
//         empCount,
//         psychometric,
//         quantitative,
//         vocabulary,
//         java,
//         accounts,
//         excel,
//         dob,
//         password: encryptedPassword, // Set the encrypted password
//         confirmPassword: req.body.confirmPassword,
//         role,
//         roleId,
//         state,
//         district,
//         taluka,
//         selectedCategory,
//         mgrName,
//         mgrEmail,
//         skills,
//         lwd,
//         availability,
//         panelistName,
//         round,
//         evaluationDetails,
//         history,
//         reference,
//       });

//       const savedCandidate = await newCandidate.save();
//       res.status(201).json(savedCandidate);
//     } catch (error) {
//       if (error.code === 11000) {
//         res.status(409).json({ message: "Email already in use" });
//       } else {
//         res.status(400).json({
//           message: "Could not create candidate",
//           error: error.message,
//         });
//       }
//     }
//   }
// );

userRouter.post(
  "/register/candidate",
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
  "/hrs",
  authenticate,
  checkPermission("view_hrs"),
  async (req, res) => {
    const docs = await Candidate.find({
      role: { $in: ["HR", "Panelist", "Ops-Manager"] },
    });
    res.json(docs);
  }
);

userRouter.get(
  "/candidatesreport",
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
  "/candidates-status",
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
        "In Progress": 0,
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
  "/candidate/onboarded/:position",
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
  "/users-by-role",
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

userRouter.get("/candidate/:status", async (req, res) => {
  const status = req.params.status;
  const docs = await Candidate.find({ status });
  res.json(docs);
});

userRouter.get("/candidates/:fullName", async (req, res) => {
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
  "/candidate/profile/:id",
  authenticate,
  checkPermission("view_candidate_profile"),
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

userRouter.put(
  "/evaluate/:id",
  authenticate,
  checkPermission("update_evaluate_data"),
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
  "/update-feedback/:id",
  authenticate,
  checkPermission("update_feedback_data"),
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
  "/panelists/enfusian",
  authenticate,
  checkPermission("view_employees_by_enfusian"),
  async (req, res) => {
    try {
      const panelists = await Candidate.find(
        { role: { $in: ["Panelist", "Ops-Manager"] } },
        "fullName"
      );
      res.json(panelists);
    } catch (error) {
      console.error("Error fetching panelists:", error);
      res.status(500).json({ message: "Error fetching panelists" });
    }
  }
);

userRouter.get(
  "/hrs/name",
  authenticate,
  checkPermission("view_hr_name"),
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
  "/panelist/:panelistName",
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
  "/candidate/:id",
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
  "/applicants/position/:position",
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
  "/candidates/:id",
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

module.exports = userRouter;
