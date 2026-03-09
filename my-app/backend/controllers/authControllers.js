const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

function signToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    const err = new Error("JWT_SECRET is not configured");
    err.statusCode = 500;
    throw err;
  }

  return jwt.sign({ id: user._id.toString() }, secret, { expiresIn: "7d" });
}

function getPasswordFieldName() {
  if (User.schema.path("passwordHash")) return "passwordHash";
  if (User.schema.path("password")) return "password";
  return null;
}

function isSelectFalse(fieldName) {
  const p = fieldName ? User.schema.path(fieldName) : null;
  return Boolean(p && p.options && p.options.select === false);
}

exports.register = async (req, res) => {
  try {
    const { username, name, email, college, password } = req.body || {};

    const normalizedUsername = typeof username === "string" ? username.trim() : "";
    const normalizedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";
    const normalizedName = typeof name === "string" ? name.trim() : "";
    const normalizedCollege = typeof college === "string" ? college.trim() : "";

    const passwordField = getPasswordFieldName();
    if (!passwordField) {
      return res.status(500).json({ message: "User model password field missing" });
    }

    if (
      !normalizedUsername ||
      !normalizedEmail ||
      !password ||
      !normalizedName ||
      !normalizedCollege
    ) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["username", "name", "email", "college", "password"],
      });
    }

    const existing = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });

    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userDoc = {
      username: normalizedUsername,
      name: normalizedName,
      email: normalizedEmail,
      college: normalizedCollege,
      [passwordField]: passwordHash,
    };

    const user = await User.create(userDoc);

    const token = signToken(user);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ message: err.message || "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { identifier, email, username, password } = req.body || {};

    const passwordField = getPasswordFieldName();
    if (!passwordField) {
      return res.status(500).json({ message: "User model password field missing" });
    }

    const rawIdentifier = identifier || email || username;
    const trimmedIdentifier =
      typeof rawIdentifier === "string" ? rawIdentifier.trim() : "";

    if (!trimmedIdentifier || !password) {
      return res.status(400).json({
        message: "Missing credentials",
        required: ["identifier (or email/username)", "password"],
      });
    }

    const identifierLower = trimmedIdentifier.toLowerCase();

    const query = {
      $or: [{ email: identifierLower }, { username: trimmedIdentifier }],
    };

    let userQuery = User.findOne(query);
    if (isSelectFalse(passwordField)) {
      userQuery = userQuery.select(`+${passwordField}`);
    }

    const user = await userQuery;
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user[passwordField]);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ message: err.message || "Server error" });
  }
};

