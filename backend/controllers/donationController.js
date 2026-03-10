const db = require("../config/db");

/* =========================
   CREATE DONATION (Pending)
========================= */
exports.createDonation = async (req, res) => {
  try {
    const { donor_name, amount, payment_method } = req.body;

    if (!donor_name || !amount || !payment_method) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    const upiId = "yash2305@fam"; // <-- Replace with your real UPI

    const [result] = await db.query(
      `INSERT INTO donations 
       (donor_name, amount, payment_method, upi_id) 
       VALUES (?, ?, ?, ?)`,
      [donor_name, amount, payment_method, upiId]
    );

    return res.status(201).json({
      success: true,
      donationId: result.insertId,
      upiId
    });

  } catch (error) {
    console.error("CREATE DONATION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


/* =========================
   CONFIRM DONATION
========================= */
exports.confirmDonation = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `UPDATE donations 
       SET status = 'completed' 
       WHERE id = ?`,
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "Donation confirmed"
    });

  } catch (error) {
    console.error("CONFIRM ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


/* =========================
   ADMIN GET ALL
========================= */
exports.getAllDonations = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM donations ORDER BY created_at DESC");

    return res.status(200).json({
      success: true,
      donations: rows
    });

  } catch (error) {
    console.error("GET DONATIONS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
