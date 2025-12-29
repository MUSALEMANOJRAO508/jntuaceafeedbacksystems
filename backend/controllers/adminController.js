const Faculty = require("../models/Faculty");

// ================= ADD FACULTY =================
exports.addFaculty = async (req, res) => {
  try {
    console.log("REQ BODY 👉", req.body); // debug

    const {
      facultyId,
      name,
      department,
      designation,
      email,
      phone,
      status
    } = req.body;

    // basic validation
    if (!facultyId || !name || !department || !designation || !email || !status) {
      return res.status(400).json({
        message: "All required fields must be provided"
      });
    }

    const faculty = new Faculty({
      facultyId,
      name,
      department,
      designation,
      email,
      phone,
      status
    });

    await faculty.save();

    res.status(201).json({
      message: "Faculty added successfully",
      faculty
    });

  } catch (error) {
    console.error("ERROR 👉", error);

    res.status(400).json({
      message: "Error adding faculty",
      error: error.message
    });
  }
};
