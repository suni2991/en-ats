const userRouter = require("express").Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const Candidate = require("../model/CandidateModel");
const {
  cdbAuthenticate,
  checkPermission,
} = require("../middleware/PermissionMiddleware");
const RoleModel = require("../model/RoleModel");
const JWT_SECRET = process.env.JWT_SECRET;
const axios = require("axios");
const { getClient } = require("../redis/redisconfig");

let enfuseDataHubUrl = "";
let logoutClient = "";
(async () => {
  let redisClient = await getClient();
  enfuseDataHubUrl = await redisClient.get("enfuseDataHubUrl");
  if (!enfuseDataHubUrl) {
    throw new Error("enfuseDataHubUrl is not set in Redis");
  }
  logoutClient = await getClient();
})();

//Create User - or register, a simple post request to save user in db
// userRouter.post(
//   "/register/candidate",
//   //
//   //
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
  //
  //
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

userRouter.post("/api/v2/login", async (req, res) => {
  try {
    console.warn("step 1");
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }
    console.warn("step 2");
    const response = await axios.post(`${enfuseDataHubUrl}/auth/login`, {
      identifier: email,
      password: password,
      appName: "ATS",
    });
    let candidate = [];
    if (response) {
      console.warn("step 3");
      candidate = await Candidate.findOne({
        employeeID: response.data.employeeID,
      });
    }
    console.warn("step 4");
    const userWithToken = {
      ...candidate.toObject(), // Convert Mongoose document to plain JavaScript object
      token: response.data.token,
    };
    console.warn("step 5");
    res.status(200).json(userWithToken);
  } catch (error) {
    // db.candidates.updateOne({employeeID: "02977"}, {role: "Admin", roleId: ObjectId('66ffb728da76e65e39b265ad')});
    console.warn("error occurred: ", error);
    if (error.response) {
      res
        .status(error.response.status)
        .json({ message: error.response.data.message || "Login failed" });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

userRouter.get(
  "/hrs",
  cdbAuthenticate,
  checkPermission("view_hrs"),
  async (req, res) => {
    const docs = await Candidate.find({
      role: { $in: ["HR", "Panelist", "Ops-Manager"] },
    });
    res.json(docs);
  }
);

userRouter.get("/candidatesreport", cdbAuthenticate, async (req, res) => {
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
});

userRouter.get("/candidates-status", cdbAuthenticate, async (req, res) => {
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
});

userRouter.get(
  "/candidate/onboarded/:position",
  cdbAuthenticate,
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
  cdbAuthenticate,
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
  cdbAuthenticate,
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
  cdbAuthenticate,
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
  cdbAuthenticate,
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
  cdbAuthenticate,
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
  cdbAuthenticate,
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
  cdbAuthenticate,
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
  cdbAuthenticate,
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
  cdbAuthenticate,
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
  cdbAuthenticate,
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

// The function below searches for candidates for the autocomplete feature
userRouter.get(
  "/candidates/search/:search",
  cdbAuthenticate,
  async (req, res) => {
    try {
      const fullName = req.params.search;
      const regex = new RegExp(fullName, "i"); // Case-insensitive search
      const candidate = await Candidate.find({
        fullName: regex,
        role: "Applicant",
      }).select({
        employeeID: 1,
        fullName: 1,
      });
      if (!candidate) {
        return res.status(404).json({ error: "Candidate not found" });
      }
      res.json(candidate);
    } catch (error) {
      console.error("Error fetching candidate details:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// function is used to assign a role to a candidate.
userRouter.patch(
  "/candidates/update/:id",
  cdbAuthenticate,
  async (req, res) => {
    try {
      const id = req.params.id;
      const { role, fullName, empCount } = req.body;

      let roleData = {};
      if (role) {
        roleData = await RoleModel.findOne({
          name: role,
        }).select({ _id: 1 });
      }
      const updateData = {
        role,
        roleId: roleData._id,
        fullName,
        empCount,
      };
      const updatedCandidate = await Candidate.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true, // return the updated document
          runValidators: true, // ensure the data follows model validation rules
        }
      );

      if (!updatedCandidate) {
        return res.status(404).json({ message: "candidate not found" });
      }

      res
        .status(200)
        .json({ message: "candidate updated", data: updatedCandidate });
    } catch (error) {
      console.error("Error fetching candidate details:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Logout endpoint
userRouter.post("/logout", async (req, res) => {
  const authorizationHeader = req.header("Authorization");

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied. Bearer is not defined." });
  }

  const bearerToken = authorizationHeader.split(" ")[1];

  if (!bearerToken) {
    return res.status(401).json({ message: "Access denied" });
  }
  try {
    // Delete the token from Redis cache
    const deleteCacheResult = await logoutClient.del(bearerToken);

    if (deleteCacheResult === 0) {
      // Handle the case where the key doesn't exist or was already deleted
      return res.status(404).json({ message: "Token not found" });
    } else if (deleteCacheResult === 1) {
      // Token deleted successfully
      return res.status(200).json({ message: "Logged out successfully" });
    } else {
      // Unexpected result, handle as an error
      return res.status(500).json({ message: "Error deleting cache" });
    }
  } catch (error) {
    console.error("Error deleting token:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

module.exports = userRouter;
