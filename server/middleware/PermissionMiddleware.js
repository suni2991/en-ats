const jwt = require("jsonwebtoken");

const RoleModel = require("../model/RoleModel");
const CandidateModel = require("../model/CandidateModel");
const PermissionModel = require("../model/PermissionModel");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = async (req, res, next) => {
  // const token = req.header('Authorization').replace('Bearer ', '');
  const bearer = req.header("Authorization").split(" ");
  // Get token from array
  const bearerToken = bearer[1];
  if (!bearerToken) return res.status(401).send("Access denied");
  try {
    const decoded = jwt.verify(bearerToken, JWT_SECRET);

    req.user = await CandidateModel.findOne({ _id: decoded.userId });
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token", error: error.message });
  }
};

const checkPermission = (permissionData) => {
  return async (req, res, next) => {
    const roleId = req.user.roleId;

    // Check if roleId is present
    if (!roleId) {
      return res.status(400).json({ error: "Role ID is missing" });
    }
    try {
      const role = await RoleModel.findOne({ _id: roleId });

      // Check if the role is found
      if (!role) {
        return res.status(404).json({ error: "Role not found" });
      }

      const permissions = role.permissions.map((permission) => permission);
      const selectedPermission = await PermissionModel.findOne(
        {
          name: permissionData,
        },
        { _id: 1 }
      );
      // Check if selectedPermission is found
      if (!selectedPermission) {
        return res.status(404).json({ error: "Permission not found" });
      }
      // Check if the user has the permission
      const hasPermission = permissions.some((id) =>
        id.equals(selectedPermission._id)
      );
      if (!hasPermission) {
        return res.status(403).json({ message: "Forbidden" });
      }
      next();
    } catch (error) {
      res.send("Server Error " + error.message);
    }
  };
};

module.exports = { authenticate, checkPermission };
