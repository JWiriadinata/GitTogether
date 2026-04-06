const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// Creates and returns a JWT token for an authenticated user
// The token stores the user's id and expires in 7 days
function signToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    const err = new Error("JWT_SECRET is not configured");
    err.statusCode = 500;
    throw err;
  }

  return jwt.sign({ id: user._id.toString() }, secret, { expiresIn: "7d" });
}

// Checks the User model to see whether the password field is named
// "passwordHash" or "password" 
function getPasswordFieldName() {
  if (User.schema.path("passwordHash")) return "passwordHash";
  if (User.schema.path("password")) return "password";
  return null;
}

// Checks whether the password field is hidden by default in the schema
// used during login so the password field can be selected if needed
function isSelectFalse(fieldName) {
  const p = fieldName ? User.schema.path(fieldName) : null;
  return Boolean(p && p.options && p.options.select === false);
}

// Registers a new user by validating input, checking for duplicates,
// hashing the password, creating the user, and returning a JWT token
exports.register = async (req, res) => {
  try {
    const { username, name, email, college, password } = req.body || {};

    // Normalizes incoming string values 
    // Email is converted to lowercase 
    const normalizedUsername = typeof username === "string" ? username.trim() : "";
    const normalizedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";
    const normalizedName = typeof name === "string" ? name.trim() : "";
    const normalizedCollege = typeof college === "string" ? college.trim() : "";

    // Determines which password field exists in the User schema
    // Returns an error if the model is missing a valid password field
    const passwordField = getPasswordFieldName();
    if (!passwordField) {
      return res.status(500).json({ message: "User model password field missing" });
    }

    // Ensures all required registration fields are present
    // Returns a 400 error if anything important is missing
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

    // Checks whether a user already exists with the same email or username
    // Prevents duplicate accounts from being created
    const existing = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });

    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Generates a salt and hashes the user's password before storing it
    // This keeps plaintext passwords out of the database
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Builds the user object to save into MongoDB, using the password field 
    // name that exists in the schema
    const userDoc = {
      username: normalizedUsername,
      name: normalizedName,
      email: normalizedEmail,
      college: normalizedCollege,
      [passwordField]: passwordHash,
    };

    // Creates the new user document in the database
    const user = await User.create(userDoc);

    // Creates a JWT token for the newly registered user
    const token = signToken(user);

    // Returns the token and basic user info to the client
    return res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    // Handles unexpected server errors and returns a safe message
    const status = err.statusCode || 500;
    return res.status(status).json({ message: err.message || "Server error" });
  }
};

// Logs in an existing user by checking credentials,
// comparing the password hash, and returning a JWT token
exports.login = async (req, res) => {
  try {
    const { identifier, email, username, password } = req.body || {};

    // Determines which password field exists in the User schema
    // Returns an error if the model is missing a valid password field
    const passwordField = getPasswordFieldName();
    if (!passwordField) {
      return res.status(500).json({ message: "User model password field missing" });
    }

    // Allows login using identifier, email, or username
    // Trims the value before using it in the query
    const rawIdentifier = identifier || email || username;
    const trimmedIdentifier =
      typeof rawIdentifier === "string" ? rawIdentifier.trim() : "";

    // Makes sure the user provided both a login identifier and password
    if (!trimmedIdentifier || !password) {
      return res.status(400).json({
        message: "Missing credentials",
        required: ["identifier (or email/username)", "password"],
      });
    }

    // Lowercases the identifier for matching emails consistently
    const identifierLower = trimmedIdentifier.toLowerCase();

    // Searches for a user whose email or username matches the login input
    const query = {
      $or: [{ email: identifierLower }, { username: trimmedIdentifier }],
    };

    // Builds the user query and includes the password field if the schema hides it
    let userQuery = User.findOne(query);
    if (isSelectFalse(passwordField)) {
      userQuery = userQuery.select(`+${passwordField}`);
    }

    // Runs the query and checks whether a matching user was found
    const user = await userQuery;
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compares the entered password with the stored hashed password
    const ok = await bcrypt.compare(password, user[passwordField]);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Creates a JWT token for the successfully authenticated user
    const token = signToken(user);

    // Returns the token and basic user info to the client
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    // Handles unexpected server errors and returns a safe message
    const status = err.statusCode || 500;
    return res.status(status).json({ message: err.message || "Server error" });
  }
};