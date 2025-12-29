const mongoose = require("mongoose");

const FeedbackActivationSchema = new mongoose.Schema(
  {
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

    // ✅ SEMESTER AS STRING (e.g. "1-1", "2-2")
    semester: {
      type: String,
      required: true,
      trim: true
    },

    // ⏰ Feedback time window
    startTime: {
      type: Date,
      required: true
    },

    endTime: {
      type: Date,
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "FeedbackActivation",
  FeedbackActivationSchema
);
