const db = require("../config/db");


/* =====================================================
   REGISTER AS DONOR (Transaction Safe)
===================================================== */
exports.registerDonor = async (req, res) => {
  const userId = req.user.id;
  const { bloodGroup } = req.body;

  if (!bloodGroup) {
    return res.status(400).json({ message: "Blood group is required" });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 🔎 Check if already donor
    const [existing] = await connection.query(
      "SELECT id FROM donors WHERE user_id = ?",
      [userId]
    );

    if (existing.length > 0) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({ message: "Already registered as donor" });
    }

    // 🆕 Insert donor
    await connection.query(
      `INSERT INTO donors (user_id, blood_group, is_available)
       VALUES (?, ?, 1)`,
      [userId, bloodGroup]
    );

    // 🔄 Upgrade role
    await connection.query(
      `UPDATE users SET role = "donor" WHERE id = ?`,
      [userId]
    );

    await connection.commit();
    connection.release();

    res.json({ message: "User upgraded to donor successfully" });

  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error("REGISTER DONOR ERROR:", error);
    res.status(500).json({ message: "Database transaction failed" });
  }
};


/* =====================================================
   SAVE OR UPDATE DONOR PROFILE
===================================================== */

exports.saveProfile = async (req, res) => {
  const userId = req.user.id;

  const {
  full_name,
  dob,
  address,
  pincode,
  phone,
  area,
  blood_group,
  gender
} = req.body;


  if (!full_name || !dob || !gender || !address || !pincode || !phone || !area) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await db.query(
      `INSERT INTO donor_profiles
       (user_id, full_name, dob, gender, address, pincode, phone, area, blood_group)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, full_name, dob, gender, address, pincode, phone, area, blood_group]
    );

    res.status(201).json({ message: "Profile saved successfully" });

  } catch (error) {
    console.error("SAVE PROFILE ERROR:", error);
    res.status(500).json({ message: "Database error" });
  }
};


/* =====================================================
   TOGGLE DONOR AVAILABILITY
===================================================== */
exports.toggleAvailability = async (req, res) => {
  const userId = req.user.id;

  try {
    await db.query(
      `UPDATE donors
       SET is_available = NOT is_available
       WHERE user_id = ?`,
      [userId]
    );

    res.json({ message: "Availability updated successfully" });

  } catch (error) {
    console.error("TOGGLE AVAILABILITY ERROR:", error);
    res.status(500).json({ message: "Database error" });
  }
};


/* =====================================================
   GET ALL AVAILABLE DONORS
===================================================== */
exports.getAllDonors = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT 
         users.id,
         users.name,
         users.email,
         donors.blood_group,
         donors.is_available,
         donor_profiles.area,
         donor_profiles.phone
       FROM donors
       JOIN users ON donors.user_id = users.id
       LEFT JOIN donor_profiles ON donor_profiles.user_id = users.id
       WHERE donors.is_available = 1`
    );

    res.json({ donors: results });

  } catch (error) {
    console.error("GET DONORS ERROR:", error);
    res.status(500).json({ message: "Database error" });
  }
};


/* =====================================================
   SEARCH DONORS BY PINCODE + BLOOD GROUP
===================================================== */
exports.searchDonors = async (req, res) => {
  try {
    const { pincode, blood_group } = req.body;

    if (!pincode || !blood_group) {
      return res.status(400).json({
        success: false,
        message: "Pincode and blood group required"
      });
    }

    const [donors] = await db.query(
      `SELECT full_name, phone, blood_group 
       FROM donor_profiles 
       WHERE pincode = ? 
       AND blood_group = ?`,
      [pincode.trim(), blood_group.trim()]
    );

    return res.status(200).json({
      success: true,
      donors
    });

  } catch (error) {
    console.error("SEARCH DONOR ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


