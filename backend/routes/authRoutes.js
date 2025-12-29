const express = require("express");
const router = express.Router();

const {
  register,
  login
} = require("../controllers/authController");

// ✅ REGISTER ROUTE
router.post("/register", register);

// ✅ LOGIN ROUTE
router.post("/login", login);

router.post("/register", (req, res) => {
  res.json({ message: "REGISTER ROUTE WORKS" });
});
module.exports = router;
