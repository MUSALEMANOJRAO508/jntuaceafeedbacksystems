const FeedbackQuestion = require("../models/FeedbackQuestion");

exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await FeedbackQuestion.find({ isActive: true });
    res.json({ count: questions.length, questions });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.addQuestion = async (req, res) => {
  try {
    console.log("ADD QUESTION BODY:", req.body); // 🔥 DEBUG

    const { questionText } = req.body;

    if (!questionText) {
      return res.status(400).json({
        message: "questionText is required"
      });
    }

    const q = new FeedbackQuestion({ questionText });
    await q.save();

    res.status(201).json({
      message: "Question added",
      question: q
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
