const express = require("express");
const router = express.Router();

const {
  createDonation,
  confirmDonation,
  getAllDonations
} = require("../controllers/donationController");

const { verifyToken, allowRoles } = require("../middleware/authMiddleware");

/* =========================
   CREATE DONATION
========================= */
router.post("/create", createDonation);

/* =========================
   CONFIRM DONATION
========================= */
router.patch("/confirm/:id", confirmDonation);

/* =========================
   ADMIN VIEW ALL
========================= */
router.get(
  "/all",
  verifyToken,
  allowRoles("admin"),
  getAllDonations
);

module.exports = router;
