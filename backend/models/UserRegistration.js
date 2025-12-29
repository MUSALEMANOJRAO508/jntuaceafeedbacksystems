const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    admission: {
      type: String,
      required: true,
      unique: true
    },

    regulation: {
      type: String,
      required: true
    },

    // ✅ Batch year entered by user
    batchYear: {
      type: Number,
      required: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student"
    },

    // 🔹 Derived but NOT join year
    entryType: String,
    program: String,
    branch: String
  },
  { timestamps: true }
);

// 🔹 Derive ONLY academic info (NO joinYear)
UserSchema.pre("save", function (next) {
  if (!this.admission) return next();

  const admission = this.admission.toUpperCase();

  // Entry type
  const entryDigit = admission.charAt(3);
  this.entryType =
    entryDigit === "1"
      ? "regular"
      : entryDigit === "5"
      ? "lateral"
      : "unknown";

  // Program
  const programChar = admission.charAt(5);
  this.program = programChar === "A" ? "BTECH" : "UNKNOWN";

  // Branch
  const branchCode = admission.substring(6, 8);
  const branchMap = {
    "05": "CSE",
    "04": "ECE",
    "03": "EEE",
    "02": "MECH",
    "01": "CIVIL"
  };

  this.branch = branchMap[branchCode] || "UNKNOWN";

  next();
});

module.exports = mongoose.model("UserRegistration", UserSchema);
