const FeedbackActivation = require("../models/FeedbackActivation");

console.log("🔥 feedbackController.js LOADED");

/* ================= ACTIVATE FEEDBACK ================= */
exports.activateFeedback = async (req, res) => {
  try {
    const {
      branch,
      regulation,
      batchYear,
      semester,       // ✅ STRING
      startTime,
      endTime
    } = req.body;

    /* 🔒 Validation */
    if (
      !branch ||
      !regulation ||
      batchYear === undefined ||
      !semester ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({
        message:
          "branch, regulation, batchYear, semester, startTime, endTime are required"
      });
    }

    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({
        message: "Start time must be before end time"
      });
    }

    /* ❌ Prevent duplicate active feedback (same class) */
    const existing = await FeedbackActivation.findOne({
      branch,
      regulation,
      batchYear: Number(batchYear),
      semester: semester.trim(),   // ✅ STRING MATCH
      isActive: true
    });

    if (existing) {
      return res.status(400).json({
        message: "Feedback already active for this class"
      });
    }

    /* ✅ Create activation */
    const feedback = new FeedbackActivation({
      branch: branch.trim(),
      regulation: regulation.trim(),
      batchYear: Number(batchYear),
      semester: semester.trim(),   // ✅ STRING
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      isActive: true
    });

    await feedback.save();

    res.status(201).json({
      message: "Feedback activated successfully",
      feedback
    });

  } catch (error) {
    console.error("ACTIVATE FEEDBACK ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= CHECK ACTIVE FEEDBACK ================= */
exports.getActiveFeedback = async (req, res) => {
  try {
    const { branch, regulation, batchYear, semester } = req.query;
    const now = new Date();

    if (!branch || !regulation || !batchYear || !semester) {
      return res.status(400).json({
        message: "branch, regulation, batchYear, semester are required"
      });
    }

    const feedback = await FeedbackActivation.findOne({
      branch: branch.trim(),
      regulation: regulation.trim(),
      batchYear: Number(batchYear),
      semester: semester.trim(),    // ✅ STRING
      isActive: true,
      startTime: { $lte: now },
      endTime: { $gte: now }
    });

    res.json({
      active: !!feedback,
      feedback
    });

  } catch (error) {
    console.error("CHECK FEEDBACK ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= DEACTIVATE FEEDBACK ================= */
exports.deactivateFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await FeedbackActivation.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({
        message: "Feedback not found"
      });
    }

    res.json({
      message: "Feedback deactivated successfully",
      feedback
    });

  } catch (error) {
    console.error("DEACTIVATE FEEDBACK ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};
const FeedbackResponse = require("../models/FeedbackResponse");

exports.submitFeedback = async (req, res) => {
  try {
    console.log("📥 FEEDBACK BODY:", req.body);

    const {
      admission,
      branch,
      regulation,
      batchYear,
      semester,
      responses
    } = req.body;

    /* ================= VALIDATION ================= */

    if (!admission)
      return res.status(400).json({ message: "admission is required" });

    if (!branch)
      return res.status(400).json({ message: "branch is required" });

    if (!regulation)
      return res.status(400).json({ message: "regulation is required" });

    if (batchYear === undefined)
      return res.status(400).json({ message: "batchYear is required" });

    if (!semester)
      return res.status(400).json({ message: "semester is required" });

    if (!responses || typeof responses !== "object")
      return res.status(400).json({ message: "responses are required" });

    if (Object.keys(responses).length === 0)
      return res.status(400).json({ message: "responses cannot be empty" });

    /* ================= SAVE ================= */

    const feedback = new FeedbackResponse({
      admission: admission.trim(),
      branch: branch.trim(),
      regulation: regulation.trim(),
      batchYear: Number(batchYear),
      semester: semester.trim(),
      responses
    });

    await feedback.save();

    res.status(201).json({
      message: "Feedback submitted successfully"
    });

  } catch (err) {

    // Duplicate protection
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Feedback already submitted for this semester"
      });
    }

    console.error("❌ SUBMIT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
