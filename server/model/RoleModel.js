const mongoose = require("mongoose");
const { Schema } = mongoose;

const RoleSchema = new Schema({
  name: String,
  permissions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Permission",
    },
  ],
});

RoleSchema.index({ name: 1 });
module.exports = mongoose.model("Role", RoleSchema);
