const Candidate = require("../model/CandidateModel");
const RoleModel = require("../model/RoleModel");
const { getClient, getSubscribeClient } = require("./redisconfig");

const ATS_CHANNEL = process.env.ATS_CHANNEL;
// Subscribe to the channel
consumeMessage = async () => {
  // Create a Redis client for subscribing
  let redisClient = await getSubscribeClient();
  try {
    // Subscribe to the channel
    const channel = ATS_CHANNEL;
    await redisClient.subscribe(channel, async (message) => {
      console.log(`Received message from ${channel}: ${message}`);
      const parsedMessage = JSON.parse(message);
      const date = new Date();

      let roleData = null;
      if (parsedMessage.role !== null && parsedMessage.role !== "undefined") {
        roleData = await RoleModel.findOne(
          {
            name: parsedMessage.role,
          },
          { _id: 1 }
        );
      } else {
        const role = "Applicant";
        roleData = await RoleModel.findOne(
          {
            name: role,
          },
          { _id: 1 }
        );
      }
      let candidateData = {
        employeeID: parsedMessage.employeeID,
        firstName: parsedMessage.firstName,
        lastName: parsedMessage.lastName,
        fullName: parsedMessage.firstName + " " + parsedMessage.lastName,
        qualification: null,
        totalExperience: null,
        relevantExperience: null,
        noticePeriod: null,
        contact: null,
        email: parsedMessage.email,
        position: null, // edit in future
        currentLocation: null,
        image: null,
        resume: null,
        status: parsedMessage.currentStatus,
        empCount: null,
        psychometric: -1,
        quantitative: -1,
        vocabulary: -1,
        java: -1,
        accounts: -1,
        excel: -1,
        role: parsedMessage?.role ? parsedMessage.role : "Applicant",
        roleId: roleData._id,
        dateCreated: date,
        createdAt: date,
        department: parsedMessage.department,
        state: null,
        lwd: null,
        joiningDate: parsedMessage.dateOfJoining,
        district: null,
        city: null,
        selectedCategory: null,
        mgrName: parsedMessage.reportingManager,
        mgrEmail: parsedMessage.reportingManagerEmail,
        notes: null,
        availability: null,
        round: null,
        evaluationDetails: false,
        dob: null,
        meetingDate: null,
        history: null,
        reference: null,
        source: null,
      };

      const checkExistCandidate = await Candidate.findOne({
        email: parsedMessage.email,
      });
      if (!checkExistCandidate) {
        const newCandidate = new Candidate(candidateData);
        await newCandidate.save();
      } else {
        await Candidate.updateOne(
          {
            email: parsedMessage.email, // Filter condition
          },
          candidateData
        );
      }
    });
    console.log(`Subscribed to ${channel} `);

    // setTimeout(() => {
    //   redisClient.quit();
    // }, 6000); // Keep listening for 60 seconds before quitting
  } catch (err) {
    console.error("Error:", err);
  } finally {
  }
};

consumeMessage();
