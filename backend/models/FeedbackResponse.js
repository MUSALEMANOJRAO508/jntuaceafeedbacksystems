const mongoose = require("mongoose");

const feedbackResponseSchema = new mongoose.Schema({
  admission: {
    type: String,
    required: true,
    trim: true
  },

  branch: {
    type: String,
    required: true,
    trim: true
  },

  regulation: {
    type: String,
    required: true,
    trim: true
  },

  batchYear: {
    type: Number,
    required: true
  },

  semester: {
    type: String,
    required: true,
    trim: true
  },

  // ⭐ Core feedback data
  responses: {
    type: Map,
    of: Map,   // subjectId -> questionId -> rating
    required: true
  },

  submittedAt: {
    type: Date,
    default: Date.now
  }
});

/* ❌ Prevent duplicate submission */
feedbackResponseSchema.index(
  { admission: 1, semester: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "FeedbackResponse",
  feedbackResponseSchema
);
