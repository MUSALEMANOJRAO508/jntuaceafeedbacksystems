const express = require("express");
const router = express.Router();

const Faculty = require("../models/Faculty");
const FeedbackActivation = require("../models/FeedbackActivation");
const Question = require("../models/FeedbackQuestion");
const SubjectFaculty = require("../models/SubjectFaculty");
const Subject = require("../models/Subject");
// ================= FACULTY =================

// ADD FACULTY
router.post("/add-faculty", async (req, res) => {
  try {
    const faculty = await Faculty.create(req.body);
    res.status(201).json({
      message: "Faculty added successfully",
      faculty
    });
  } catch (error) {
    res.status(400).json({
      message: "Error adding faculty",
      error: error.message
    });
  }
});

// GET ACTIVE FACULTY
router.get("/faculty", async (req, res) => {
  const faculty = await Faculty.find({ status: "Active" });
  res.json(faculty);
});

// ================= FEEDBACK ACTIVATION =================

router.post("/activate-feedback", async (req, res) => {
  const { branch, semester, entryType, startTime, endTime } = req.body;

  await FeedbackActivation.deleteMany({ branch, semester, entryType });

  const activation = await FeedbackActivation.create({
    branch,
    semester,
    entryType,
    startTime,
    endTime
  });

  res.json({ message: "Feedback activated", activation });
});

// ================= QUESTIONS =================

router.post("/add-question", async (req, res) => {
  const q = await Question.create(req.body);
  res.json(q);
});

// ================= SUBJECT–FACULTY MAP =================

router.post("/add-subject", async (req, res) => {
  const map = await SubjectFaculty.create(req.body);
  res.json(map);
});


router.post("/add-subjects", async (req, res) => {
  try {
    console.log("REQ BODY 👉", req.body);

    const { branch, regulation, year, semester, subjects } = req.body;

    const docs = subjects.map(s => ({
      subjectCode: s.subjectCode,
      subjectName: s.subjectName,
      branch,
      regulation,
      year: Number(year),   // 👈 force number
      semester
    }));

    console.log("DOCS TO INSERT 👉", docs);

    const result = await Subject.insertMany(docs, { ordered: true });

    console.log("INSERT RESULT 👉", result);

    res.json({
      message: "Subjects added",
      count: result.length
    });
  } catch (error) {
    console.error("INSERT ERROR 👉", error);
    res.status(400).json({
      message: "Insert failed",
      error: error.message
    });
  }
});


// GET SUBJECTS BY BRANCH + REGULATION + YEAR + SEMESTER (STRING)
router.get("/subjects", async (req, res) => {
  try {
    const { branch, regulation, year, semester } = req.query;

    if (!branch || !regulation || !year || !semester) {
      return res.status(400).json({
        message: "branch, regulation, year and semester are required"
      });
    }

    const subjects = await Subject.find({
      branch,
      regulation,
      year: Number(year),   // year is number
      semester              // semester is STRING like "1-1"
    });

    res.json(subjects);
  } catch (error) {
    console.error("FETCH SUBJECT ERROR 👉", error);
    res.status(500).json({
      message: "Error fetching subjects",
      error: error.message
    });
  }
});



/* ================= MAP SUBJECT → FACULTY (SINGLE + MULTIPLE) ================= */
router.post("/map-subject-faculty", async (req, res) => {
  try {
    const {
      branch,
      regulation,
      batchYear,
      semester,      // ✅ STRING like "1-1"
      subjectId,
      facultyId,
      mappings       // optional array
    } = req.body;

    /* ===== BASIC VALIDATION ===== */
    if (!branch || !regulation || batchYear === undefined || !semester) {
      return res.status(400).json({
        message: "branch, regulation, batchYear, semester are required"
      });
    }

    let operations = [];

    /* ========= MULTIPLE MAPPING ========= */
    if (Array.isArray(mappings) && mappings.length > 0) {
      operations = mappings.map(m => ({
        updateOne: {
          filter: {
            subject: m.subjectId,
            branch,
            regulation,
            batchYear: Number(batchYear),
            semester              // ✅ STRING
          },
          update: {
            $set: {
              faculty: m.facultyId
            }
          },
          upsert: true
        }
      }));
    }

    /* ========= SINGLE MAPPING ========= */
    else if (subjectId && facultyId) {
      operations.push({
        updateOne: {
          filter: {
            subject: subjectId,
            branch,
            regulation,
            batchYear: Number(batchYear),
            semester              // ✅ STRING
          },
          update: {
            $set: {
              faculty: facultyId
            }
          },
          upsert: true
        }
      });
    } else {
      return res.status(400).json({
        message: "Provide either subjectId + facultyId OR mappings array"
      });
    }

    /* ===== EXECUTE BULK OPERATION ===== */
    const result = await SubjectFaculty.bulkWrite(operations);

    res.json({
      message: "Faculty mapping saved successfully",
      count: operations.length
    });

  } catch (error) {
    console.error("MAPPING ERROR 👉", error);
    res.status(500).json({
      message: "Mapping error",
      error: error.message
    });
  }
});

/* ================= GET SUBJECTS WITH FACULTY ================= */
router.get("/subjects-with-faculty", async (req, res) => {
  try {
    const { branch, regulation, batchYear, semester, year } = req.query;

    if (!branch || !regulation || !batchYear || !semester || !year) {
      return res.status(400).json({
        message: "branch, regulation, batchYear, year, semester are required"
      });
    }

    /* 1️⃣ Fetch subjects for that class */
    const subjects = await Subject.find({
      branch,
      regulation,
      year: Number(year),
      semester          // ✅ STRING like "1-1"
    });

    /* 2️⃣ Fetch faculty mappings */
    const mappings = await SubjectFaculty.find({
      branch,
      regulation,
      batchYear: Number(batchYear),
      semester,         // ✅ STRING
      subject: { $in: subjects.map(s => s._id) }
    }).populate("faculty");

    /* 3️⃣ Merge subject + faculty */
    const result = subjects.map(sub => {
      const map = mappings.find(
        m => m.subject.toString() === sub._id.toString()
      );

      return {
        subjectId: sub._id,
        subjectName: sub.subjectName,
        facultyId: map ? map.faculty._id : null,
        facultyName: map ? map.faculty.name : null
      };
    });

    res.json(result);

  } catch (err) {
    console.error("FETCH SUBJECTS WITH FACULTY ERROR 👉", err);
    res.status(500).json({ message: "Fetch error" });
  }
});


const {
  getSubjectFacultyBarChart
} = require("../controllers/adminFeedbackController");

router.get(
  "/subject-faculty-bar-chart",
  getSubjectFacultyBarChart
);

module.exports = router;
