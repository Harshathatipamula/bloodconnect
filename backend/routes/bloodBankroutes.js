const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/nearby", async (req, res) => {

  const { lat, lng, radius } = req.body;

  if (!lat || !lng) {
    return res.status(400).json({ message: "Coordinates required" });
  }

  try {

   const query = `
  [out:json];
  (
    node["amenity"="blood_bank"](around:${radius || 5000}, ${lat}, ${lng});
    node["amenity"="hospital"](around:${radius || 5000}, ${lat}, ${lng});
  );
  out;
`;


    const response = await axios.post(
      "https://overpass-api.de/api/interpreter",
      query,
      { headers: { "Content-Type": "text/plain" } }
    );

    const places = response.data.elements.map(place => ({
      name: place.tags.name || "Blood Bank",
      lat: place.lat,
      lon: place.lon,
      address: place.tags["addr:full"] || "Address not available"
    }));

    res.json({ places });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch blood banks" });
  }
});

module.exports = router;
