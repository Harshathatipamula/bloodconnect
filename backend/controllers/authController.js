const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


/* =====================================================
   REGISTER
===================================================== */
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Check if user already exists
    const [existingUsers] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Default role = recipient
    const userRole = role || "recipient";

    // Insert new user
    const [result] = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, userRole]
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: result.insertId
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during registration"
    });
  }
};


/* =====================================================
   LOGIN
===================================================== */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Find user
    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const user = users[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not defined");
      return res.status(500).json({
        success: false,
        message: "Server configuration error"
      });
    }

    // Create JWT (30 days — stable for your project)
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login"
    });
  }
};


/* =====================================================
   GOOGLE LOGIN (Temporary Stub)
   NOTE: This does NOT verify real Google token.
===================================================== */
exports.googleLogin = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email required"
      });
    }

    // Check if user exists
    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    let user;

    if (users.length === 0) {
      // Create new user
      const [result] = await db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name || "Google User", email, "google_auth", "recipient"]
      );

      user = {
        id: result.insertId,
        name: name || "Google User",
        email,
        role: "recipient"
      };

    } else {
      user = users[0];
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "365d" }
    );

    return res.status(200).json({
      success: true,
      message: "Google login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("GOOGLE LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Google login failed"
    });
  }
};


/* =====================================================
   GOOGLE USERS COUNT
===================================================== */
exports.getGoogleUsersCount = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT COUNT(*) AS total FROM users WHERE password = 'google_auth'"
    );

    res.json({
      success: true,
      total: rows[0].total
    });

  } catch (error) {
    console.error("GOOGLE COUNT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching google users count"
    });
  }
};
