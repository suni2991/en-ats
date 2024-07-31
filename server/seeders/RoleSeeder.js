const mongoose = require("mongoose");
const RoleModel = require("../model/RoleModel");
const PermissionModel = require("../model/PermissionModel");
require("dotenv").config()
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
  

const roles = [
  {
    name: "Admin",
  },
  {
    name: "HR",
  },
  {
    name: "Applicant",
  },
  {
    name: "Panelist",
  },
  {
    name: "Enfusian",
  },
  {
    name: "Ops-Manager",
  },
];
const adminPermissionJson = [
  "create_applicant",
  "login",
  "view_hrs",
  "view_candidates_report",
  "view_candidate_status",
  "view_onboarded_candidates_by_position",
  "view_users_by_role",
  "view_candidate_profile",
  "view_candidates_by_position",
  "view_hr_name",
  "view_panelist_details_by_name",
  "delete_candidate_by_id",
  "update_candidate_by_id",
  "create_new_job",
  "view_jobs",
  "view_pending_jobs",
  "view_job_post_by_id",
  "delete_job_post_by_id",
  "view_all_positions",
  "view_positions_with_vacancies_by_department",
  "view_vacancy_status_by_position",
  "update_job_post_by_id",
  "job_approve_email",
];
const hrPermissionJson = [
  "create_applicant",
  "login",
  "view_hrs",
  "view_candidates_report",
  "view_candidate_status",
  "view_onboarded_candidates_by_position",
  "view_users_by_role",
  "view_candidate_profile",
  "update_evaluate_data",
  "update_feedback_data",
  "view_candidates_by_position",
  "view_employees_by_enfusian",
  "view_hr_name",
  "view_panelist_details_by_name",
   "update_candidate_by_id",
  "create_new_job",
  "view_jobs",
  "view_pending_jobs",
  "view_job_post_by_id",
  "delete_job_post_by_id",
  "view_all_positions",
  "view_positions_with_vacancies_by_department",
  "view_vacancy_status_by_position",
  "update_job_post_by_id",
  "update_job_post_by_id",
  "user_register_email",
  "job_approve_email",
];
const applicantPermissionData = ["login", "update_candidate_by_id"];
const panelistPermissionData = [
  "login",
  "view_candidate_profile",
  "update_feedback_data",
  "update_candidate_by_id",
  "update_evaluate_data",
  "view_panelist_details_by_name",
  "update_candidate_by_id",
];
const enfusianPermissionData = [];
const opsManagerPermissionData = [
  "login",
  "view_hrs",
  "view_candidate_profile",
  "update_feedback_data",
  "view_panelist_details_by_name",
  "update_candidate_by_id",
  "create_new_job",
  "view_jobs",
  "update_candidate_by_id",
  "update_evaluate_data",
  "view_pending_jobs",
  "view_job_post_by_id",
  "delete_job_post_by_id",
  "view_all_positions",
  "update_job_post_by_id",
];

const allPermissionData = {
	Admin: adminPermissionJson,
	HR: hrPermissionJson,
	Applicant: applicantPermissionData,
	Panelist: panelistPermissionData,
	Enfusian: enfusianPermissionData,
	"Ops-Manager": opsManagerPermissionData,
  };
async function getAllPermission() {
  try {
    for (const roleName in allPermissionData) {
      const permissionNames = allPermissionData[roleName];
      const permissionIds = await fetchPermissionIds(permissionNames);
      // check existing role
      const existingRole = await RoleModel.findOne({
        name: roleName,
      });

      // if found then update permissions
      if (existingRole) {
        console.log(`Role already exists: ${existingRole.name}`);
        existingRole.permissions = permissionIds;
        await existingRole.save();
      } else {
        // create new role with permissions
        const roleResult = await RoleModel.create({
          name: roleName,
          permissions: permissionIds, // Assign fetched permission ObjectIds
        });
        console.log(`New role created with ID: ${roleResult._id}`);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    // Optionally close mongoose connection if needed
    // mongoose.connection.close();
  }
}

async function fetchPermissionIds(permissionJson) {
  try {
    const permissions = await PermissionModel.find(
      {
        name: { $in: permissionJson },
      },
      "_id"
    ); // Fetching only _id

    // Extracting only the ObjectId values
    const permissionIds = permissions.map((permission) => permission._id);

    return permissionIds;
  } catch (error) {
    console.error("Error fetching permission ObjectIds:", error);
    throw error;
  }
}

getAllPermission()
  .then(() => {
    console.log("Role seeding completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error seeding role:", err);
    process.exit(1);
  });

// seedRole();
// console.log(roles);
