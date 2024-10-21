const axios = require("axios");
const { getClient } = require("../redis/redisconfig");
const Candidate = require("../model/CandidateModel");
const RoleModel = require("../model/RoleModel");
const PermissionModel = require("../model/PermissionModel");

let enfuseDataHubUrl = "";
let cacheClient = "";
(async () => {
  let redisClient = await getClient();
  enfuseDataHubUrl = await redisClient.get("enfuseDataHubUrl");
  if (!enfuseDataHubUrl) {
    throw new Error("enfuseDataHubUrl is not set in Redis");
  }
  cacheClient = await getClient();
})();

// const checkPermission = (permissionData) => {
//   return async (req, res, next) => {
//     console.warn("=====================================================================");
//     console.warn("checkPermission ", permissionData);
//     if (req.candidate.roleId) {
//       const roleId = req.candidate.roleId;
//       if (!roleId) {
//         console.warn("Step 1");
//         return res.status(400).json({ error: "Role ID is missing" });
//       }

//       console.warn("Step 2");
//       const role = await RoleModel.findOne({ _id: roleId });

//       // Check if the role is found
//       if (!role) {
//         console.warn("Step 3");
//         return res.status(404).json({ error: "Role not found" });
//       }
//       console.warn("Step 4");
//       const permissions = role.permissions.map((permission) => permission);
//       const selectedPermission = await PermissionModel.findOne(
//         {
//           name: permissionData,
//         },
//         { _id: 1 }
//       );
//       console.warn("Step 5");
//       // Check if selectedPermission is found
//       if (!selectedPermission) {
//         console.warn("Step 6");
//         return res.status(404).json({ error: "Permission not found" });
//       }
//       console.warn("Step 7");
//       const hasPermission = permissions.some((id) =>
//         id.equals(selectedPermission._id)
//       );
//       if (!hasPermission) {
//         console.warn("Step 8");
//         return res.status(403).json({ message: "Forbidden" });
//       }
//       console.warn("Step 9");
//       next();
//     }
//     // wvwcvbz8
//     // next();
//     console.warn("=====================================================================");
//   };
// };

const checkPermission = (permissionData) => {
  return async (req, res, next) => {
    // Validate presence of roleId
    if (!validateRoleId(req.candidate)) {
      return res
        .status(400)
        .json({ error: "Role ID is missing", data: req.candidate });
    }

    const roleId = req.candidate.roleId;
    // console.warn("roleId ", req.candidate);
    // Find role by ID (consider caching)
    const role = await RoleModel.findOne({ _id: roleId }, { permissions: 1 });
    if (!role) {
      return res.status(404).json({ error: "Role not found", role: roleId });
    }

    // Find permission by name (consider caching)
    const selectedPermission = await PermissionModel.findOne({
      name: permissionData,
    });
    if (!selectedPermission) {
      return res.status(404).json({ error: "Permission not found" });
    }

    // console.warn("role ", req.candidate.roleId);
    // console.warn("permissionData ", permissionData);
    // console.warn("selectedPermission ", selectedPermission);
    // console.warn("role.permissions ", role.permissions);
    // Check permission access
    if (!hasPermission(role.permissions, selectedPermission._id)) {
      return res.status(403).json({ message: "Forbidden", selectedPermission:selectedPermission, permissionData:role.permissions });
    }

    // Authorized, proceed to next middleware
    next();
  };
};

// Helper functions for cleaner logic
function validateRoleId(candidate) {
  return candidate.roleId !== undefined;
}

function hasPermission(permissions, permissionId) {
  return permissions.some((id) => id.equals(permissionId));
}

const cdbAuthenticate = async (req, res, next) => {
  console.warn("cdbAuthenticate");
  const authorizationHeader = req.header("Authorization");

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. Token in missing." });
  }

  const bearerToken = authorizationHeader.split(" ")[1];

  if (!bearerToken) {
    return res.status(401).json({ message: "Access denied. Bearer token in not given." });
  }

  // Check cache
  const cachedData = await cacheClient.get(bearerToken);
  if (cachedData) {
    req.candidate = JSON.parse(cachedData);
    return next();
  }

  try {
    const response = await axios.get(`${enfuseDataHubUrl}/auth/validateToken`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });
    if (response) {
      const candidate = await Candidate.findOne(
        {
          employeeID: response.data.data.employeeID,
        },
        {
          role: 1,
          roleId: 1, // Include only the 'roleID' field
        }
      );

      console.warn("cdbAuthenticate", "step 1");
      if (!candidate) {
        console.warn("cdbAuthenticate", "step 2");
        return res.status(404).send("Candidate not found");
      }
      console.warn("cdbAuthenticate", "step 3");
      cacheClient.set(bearerToken, JSON.stringify(candidate),'EX', 3600); // Cache for 1 hour
      console.warn("req.candidate2 ", candidate);
      req.candidate = candidate;
      // console.warn("cdbAuthenticate", req.candidate);
      next();
    } else {
      return res.status(401).json({ message: "Access denied" });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "Invalid token external authenticate", error: error });
    console.warn("error ", error);
  }
};

module.exports = { checkPermission, cdbAuthenticate };
