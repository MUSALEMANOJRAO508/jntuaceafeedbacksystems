const mongoose = require("mongoose");

const SubjectFacultySchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  regulation: {
    type: String,
    required: true
  },
  batchYear: {
    type: Number,
    required: true
  },
  semester: {
    type: String,   // keep STRING because "1-1", "2-2"
    required: true
  }
});

/* ✅ COMPOUND UNIQUE INDEX */
SubjectFacultySchema.index(
  { subject: 1, branch: 1, regulation: 1, batchYear: 1, semester: 1 },
  { unique: true }
);

module.exports = mongoose.model("SubjectFaculty", SubjectFacultySchema);
