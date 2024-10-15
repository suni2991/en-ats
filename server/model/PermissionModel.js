const mongoose = require('mongoose');
const { Schema } = mongoose;

const PermissionSchema = new Schema({
    name: String
});

PermissionSchema.index({ name: 1 }); // Index on 'name' field

module.exports = mongoose.model('Permission', PermissionSchema);