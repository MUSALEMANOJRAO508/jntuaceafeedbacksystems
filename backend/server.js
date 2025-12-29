const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middleware
app.use(cors({
  origin: "https://jntuaceafeedbacksystems-dibf.vercel.app",
  credentials: true
}));
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Backend running");
});

// port (Render uses process.env.PORT)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
