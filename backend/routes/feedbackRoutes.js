const express = require("express");
const router = express.Router();

/* ================= CONTROLLERS ================= */

// Activation Controller
const {
  activateFeedback,
  deactivateFeedback,
  getActiveFeedback
} = require("../controllers/feedbackController");

// Feedback Response Controller
const {
  submitFeedback
} = require("../controllers/feedbackController");

// Questions Controller
const {
  getAllQuestions,
  addQuestion
} = require("../controllers/feedbackQuestionController");

/* ================= TEST ================= */
router.get("/test", (req, res) => {
  res.send("✅ Feedback route working");
});

/* ================= FEEDBACK ACTIVATION ================= */
router.post("/activate", activateFeedback);
router.get("/active", getActiveFeedback);
router.put("/deactivate/:id", deactivateFeedback);

/* ================= QUESTIONS ================= */
router.get("/questions", getAllQuestions);
router.post("/questions", addQuestion);

/* ================= FEEDBACK SUBMISSION (🔥 REQUIRED) ================= */
router.post("/submit", submitFeedback);

module.exports = router;
