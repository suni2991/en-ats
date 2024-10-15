const mongoose = require("mongoose");
require("dotenv").config();
const CandidateModel = require("../model/CandidateModel");
const RoleModel = require("../model/RoleModel");
async function main() {
  await mongoose.connect(process.env.URL);
  await mongoose.connection.db
    .collection("candidates")
    .createIndex({ email: 1 }, { unique: true });

  console.log("db connected");
}

main().catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});
async function candidateSeed() {
  try {
    const candidates = await CandidateModel.find();
    for (const candidate of candidates) {
      console.log(candidate.role);
      const role = await RoleModel.findOne(
        { name: candidate.role },
        { name: 0, permissions: 0 }
      );

      if (role) {
        candidate.roleId = role._id;
        await candidate.save();
        console.log(
          `candidate '${candidate.firstName}' updated with roleId: ${role._id}`
        );
      } else {
        console.log(
          `Role '${candidate.role}' not found for candidate '${candidate.firstName}'`
        );
      }
    }
  } catch (err) {
    console.log("error " + err);
  }
}

candidateSeed()
  .then(() => {
    console.log("User seed successfully");
    process.exit(0);
  })
  .catch(() => {
    console.log("Error in seeding user");
    process.exit(1);
  });
