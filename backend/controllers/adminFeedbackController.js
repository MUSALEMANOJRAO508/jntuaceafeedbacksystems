const FeedbackResponse = require("../models/FeedbackResponse");
const SubjectFaculty = require("../models/SubjectFaculty");
const Subject = require("../models/Subject");

exports.getSubjectFacultyBarChart = async (req, res) => {
  try {
    const { branch, regulation, batchYear, semester } = req.query;

    if (!branch || !regulation || !batchYear || !semester) {
      return res.status(400).json({
        message: "branch, regulation, batchYear, semester are required"
      });
    }

    /* ================= STEP 1: SUBJECT–FACULTY MAPPING ================= */
    const mappings = await SubjectFaculty.find({
      branch,
      regulation,
      batchYear: Number(batchYear),
      semester
    }).populate("faculty");

    if (!mappings.length) {
      return res.json({ data: [] });
    }

    // Fetch subject names
    const subjectIds = mappings.map(m => m.subject);
    const subjects = await Subject.find(
      { _id: { $in: subjectIds } },
      "subjectName"
    );

    const subjectNameMap = {};
    subjects.forEach(s => {
      subjectNameMap[s._id.toString()] = s.subjectName;
    });

    const mappingMap = {};
    mappings.forEach(m => {
      mappingMap[m.subject.toString()] = {
        subjectName: subjectNameMap[m.subject.toString()],
        facultyName: m.faculty?.name || "Unknown Faculty"
      };
    });

    /* ================= STEP 2: FETCH FEEDBACK ================= */
    const feedbacks = await FeedbackResponse.find({
      branch,
      regulation,
      batchYear: Number(batchYear),
      semester
    });

    if (!feedbacks.length) {
      return res.json({ data: [] });
    }

    /* ================= STEP 3: AGGREGATE (FIXED FOR MAP) ================= */
    const stats = {};

    feedbacks.forEach(fb => {
      if (!fb.responses) return;

      // ✅ CORRECT WAY FOR MONGOOSE MAP
      fb.responses.forEach((answers, subjectId) => {
        const map = mappingMap[subjectId];
        if (!map || !answers) return;

        let score = 0;
        let count = 0;

        // answers itself is ALSO a Map
        if (answers instanceof Map) {
          answers.forEach(v => {
            if (typeof v === "number") {
              score += v;
              count++;
            }
          });
        }

        if (!count) return;

        const label = `${map.subjectName} (${map.facultyName})`;

        if (!stats[label]) {
          stats[label] = { total: 0, max: 0 };
        }

        stats[label].total += score;
        stats[label].max += count * 5;
      });
    });

    /* ================= FINAL RESULT ================= */
    const result = Object.entries(stats).map(([label, v]) => ({
      label,
      percentage: Number(((v.total / v.max) * 100).toFixed(2))
    }));

    res.json({ data: result });

  } catch (error) {
    console.error("ADMIN BAR CHART ERROR 👉", error);
    res.status(500).json({
      message: error.message
    });
  }
};
