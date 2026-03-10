const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authController = require("../controllers/authController");
const { register, login, googleLogin } = require("../controllers/authController");



router.post('/register', register);
router.post('/login', login);
router.post("/google", googleLogin);

router.get("/google-users-count", authController.getGoogleUsersCount);

// ================= USER STATS =================
router.get("/stats", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        COUNT(*) AS totalUsers,
        SUM(role = 'donor') AS totalDonors,
        SUM(role = 'recipient') AS totalRecipients
      FROM users
    `);

    res.json({
      totalUsers: rows[0].totalUsers || 0,
      totalDonors: rows[0].totalDonors || 0,
      totalRecipients: rows[0].totalRecipients || 0
    });

  } catch (error) {
    console.error("STATS ERROR:", error);
    res.status(500).json({ message: "Error fetching stats" });
  }
});

router.get("/total-users", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT COUNT(*) AS total FROM users");

    return res.status(200).json({
      success: true,
      totalUsers: rows[0].total
    });

  } catch (error) {
    console.error("TOTAL USERS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch total users"
    });
  }
});


module.exports = router;
