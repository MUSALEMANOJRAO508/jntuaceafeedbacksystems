const express = require("express");
const router = express.Router();

const {
  getStudentFeedbackData
} = require("../controllers/studentController");


router.get("/feedback-data", getStudentFeedbackData);

module.exports = router;
