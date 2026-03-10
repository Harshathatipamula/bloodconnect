const express = require("express");
const router = express.Router();
const { searchDonors } = require("../controllers/donorController");

router.post("/search-donors", searchDonors);

const { verifyToken, allowRoles } = require("../middleware/authMiddleware");

const {
  registerDonor,
  saveProfile,
  toggleAvailability,
  getAllDonors
} = require("../controllers/donorController");


/* =====================================================
   REGISTER AS DONOR (Upgrade role)
   Only recipient can become donor
===================================================== */
router.post(
  "/register",
  verifyToken,
  allowRoles("recipient"),
  registerDonor
);


/* =====================================================
   SAVE OR UPDATE DONOR PROFILE
===================================================== */
router.post(
  "/profile",
  verifyToken,
  allowRoles("recipient", "donor"),
  saveProfile
);


/* =====================================================
   TOGGLE DONOR AVAILABILITY
===================================================== */
router.patch(
  "/availability",
  verifyToken,
  allowRoles("donor"),
  toggleAvailability
);


/* =====================================================
   GET ALL DONORS
===================================================== */
router.get(
  "/all",
  verifyToken,
  allowRoles("recipient", "admin"),
  getAllDonors
);


module.exports = router;
