const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

/**
 * Student/admin signup.
 * Students default to pending approval; admins can be seeded manually with role=admin.
 */
const signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, grade, governorate, classNumber, schoolName, role, password } =
      req.body;

    const duplicate = await User.findOne({
      name: name.trim(),
      classNumber,
      schoolName,
    });
    if (duplicate) {
      return res.status(409).json({ message: "User already registered." });
    }

    const isAdmin = role === "admin";

    const user = await User.create({
      name: name.trim(),
      grade,
      governorate,
      classNumber,
      schoolName,
      role: isAdmin ? "admin" : "student",
      isApproved: isAdmin ? true : false,
      password,
    });

    return res.status(201).json({
      message: "Signup successful. Await admin approval if you are a student.",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        isApproved: user.isApproved,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Login via MongoDB _id + name. Admins with a password will be validated against it.
 */
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id, name, password } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id format." });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // basic name match (case-insensitive) to reduce trivial mismatches
    if (user.name.trim().toLowerCase() !== name.trim().toLowerCase()) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    if (user.role === "student" && !user.isApproved) {
      return res
        .status(403)
        .json({ message: "Account pending admin approval." });
    }

    if (user.role === "admin" && user.password) {
      const valid = await user.comparePassword(password || "");
      if (!valid) {
        return res.status(401).json({ message: "Invalid admin password." });
      }
    }

    const token = generateToken({ id: user._id, role: user.role });

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        isApproved: user.isApproved,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login };
