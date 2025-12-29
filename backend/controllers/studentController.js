const User = require("../models/UserRegistration");
const FeedbackActivation = require("../models/FeedbackActivation");
const SubjectFaculty = require("../models/SubjectFaculty");
const FeedbackQuestion = require("../models/FeedbackQuestion");

/*
 GET /api/student/feedback-data?admission=22001A0501
*/
exports.getStudentFeedbackData = async (req, res) => {
  try {
    const { admission } = req.query;
    const now = new Date();

    console.log("🔍 ADMISSION RECEIVED 👉", admission);

    /* 1️⃣ Admission validation */
    if (!admission) {
      return res.status(400).json({
        message: "Admission number is required"
      });
    }

    /* 2️⃣ Fetch student */
    const student = await User.findOne({ admission });

    console.log("🔍 STUDENT FOUND 👉", student);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    const { branch, regulation, batchYear } = student;

    /* 3️⃣ Fetch active feedback activation */
    const activation = await FeedbackActivation.findOne({
      branch,
      regulation,
      batchYear,
      isActive: true,
      startTime: { $lte: now },
      endTime: { $gte: now }
    });

    console.log("🔍 ACTIVATION FOUND 👉", activation);

    if (!activation) {
      return res.json({
        active: false,
        message: "Feedback not activated for your class"
      });
    }

    const { semester } = activation; // ✅ comes from activation

    /* 4️⃣ Fetch subject–faculty mappings */
    const mappings = await SubjectFaculty.find({
      branch,
      regulation,
      batchYear,
      semester
    }).populate("subject faculty");

    /* 5️⃣ Fetch questions */
    const questions = await FeedbackQuestion.find({ isActive: true });

    /* 6️⃣ Send response */
    res.json({
      active: true,
      student: {
        admission,
        branch,
        regulation,
        batchYear
      },
      activation: {
        semester,
        startTime: activation.startTime,
        endTime: activation.endTime
      },
      subjects: mappings.map(m => ({
        subjectId: m.subject._id,
        subjectName: m.subject.subjectName,
        facultyId: m.faculty._id,
        facultyName: m.faculty.name
      })),
      questions
    });

  } catch (error) {
    console.error("STUDENT CONTROLLER ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};
