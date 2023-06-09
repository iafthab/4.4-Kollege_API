const Teacher = require("./../models/Teacher");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Auth Login
// @route POST /auth/login
// @access Public
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  console.log(new Date());

  if (!username || !password) {
    return res.status(400).json({ message: "All Fields are required" });
  }
  const teacher = await Teacher.findOne({ username }).exec();

  if (!teacher) {
    return res.status(404).json({ message: "User not found" });
  }
  if (!teacher.roles.length) {
    return res.status(418).json({ message: "User not Approved" });
  }

  const match = await bcrypt.compare(password, teacher.password);
  if (!match) return res.status(401).json({ message: "Unauthorized" });
  else {
    const isHOD = teacher.roles.includes("HOD");
    res
      .status(200)
      .json({ _id: teacher.id, isHOD, department: teacher.department });
    console.log(new Date());
  }
});

// // @desc Auth Logout
// // @route POST /auth/logout
// // @access Public
// const logout = asyncHandler(async (req, res) => {});

module.exports = { login };
