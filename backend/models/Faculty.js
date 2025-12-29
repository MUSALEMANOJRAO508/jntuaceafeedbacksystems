const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
  facultyId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true   // NO DEFAULT
  },
  designation: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Faculty", facultySchema);
