const PermissionModel = require("../model/PermissionModel");
const mongoose = require("mongoose");
require("dotenv").config()
async function main() {
  await mongoose.connect(process.env.URL);
  await mongoose.connection.db
    .collection("candidates")
    .createIndex({ email: 1 }, { unique: true });
  
  console.log("db connected");
}
 console.log(process.env.URL);
main().catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

const permissions = [
  {
    name: "create_applicant",
    description: "Create Or Register Applicant",
  },
  {
    name: "login",
    description: "Login",
  },
  {
    name: "view_hrs",
    description: "View HRs",
  },
  {
    name: "view_candidates_report",
    description: "View Candidate Report",
  },
  {
    name: "view_candidate_status",
    description: "View Candidate Status",
  },
  {
    name: "view_onboarded_candidates_by_position",
    description: "View Onboarded Candidates by Position",
  },
  {
    name: "view_users_by_role",
    description: "View Users By Role",
  },
  {
    name: "view_candidate_profile",
    description: "View Candidate Profile By Profile ID",
  },
  {
    name: "update_evaluate_data",
    description: "Update Candidate Interview Data",
  },
  {
    name: "update_feedback_data",
    description: "Update Candidate Feedback Data",
  },
  {
    name: "view_candidates_by_position",
    description: "View Candidates By Position",
  },
  {
    name: "view_employees_by_enfusian",
    description: "View Employees By Enfusian (Feedback Providers)",
  },
  {
    name: "view_hr_name",
    description: "View HR Name",
  },
  {
    name: "view_panelist_details_by_name",
    description: "View Panelist Details By Name",
  },
  {
    name: "delete_candidate_by_id",
    description: "Delete Candidate By ID",
  },
  {
    name: "update_candidate_by_id",
    description: "Update Candidate By ID",
  },
  {
    name: "create_new_job",
    description: "Create New Job",
  },
  {
    name: "view_jobs",
    description: "View Jobs",
  },
  {
    name: "view_pending_jobs",
    description: "View Pending Jobs",
  },
  {
    name: "view_job_post_by_id",
    description: "View Job Post By ID",
  },
  {
    name: "delete_job_post_by_id",
    description: "Delete Job Post By ID",
  },
  {
    name: "view_all_positions",
    description: "View All Positions",
  },
  {
    name: "view_positions_with_vacancies_by_department",
    description: "View Positions With Vacancies By Department",
  },
  {
    name: "view_vacancy_status_by_position",
    description: "View Vacancy Status By Position",
  },
  {
    name: "update_job_post_by_id",
    description: "Update Job Post By ID",
  },
  {
    name: "user_register_email",
    description: "User Registration Email",
  },
  {
    name: "job_approve_email",
    description: "Job Approval Email",
  },
  {
    name: "request_for_slot",
    description:"Request panelist for Available slot"
  }
];

async function seedPermission() {
  const createPermissionIfNotExists = async (permission) => {
    const existingPermission = await PermissionModel.findOne({
      name: permission.name,
    });

    if (existingPermission) {
      console.log(`Permission already exists: ${existingPermission.name}`);
    } else {
      const newPermission = await PermissionModel.create({
        name: permission.name,
      });
      console.log(`Permission created: ${permission.name}`);
    }
  };

  for (const permission of permissions) {
    await createPermissionIfNotExists(permission);
  }
}

// Execute the permission seeder
seedPermission()
  .then(() => {
    console.log("Permission seeding completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error seeding permissions:", err);
    process.exit(1);
  });
