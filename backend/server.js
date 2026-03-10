require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const donorRoutes = require('./routes/donorRoutes');
const bloodBankRoutes = require("./routes/bloodBankroutes");
const donationRoutes = require("./routes/donationRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   ROUTES
========================= */

app.use('/api/auth', authRoutes);
app.use("/api/donor", donorRoutes);
app.use("/api/bloodbanks", bloodBankRoutes);
app.use("/api/donations", donationRoutes);

/* =========================
   TEST ROUTE
========================= */

app.get('/', (req, res) => {
  res.send('Backend is running');
});

/* =========================
   START SERVER
========================= */

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});


app.listen(PORT, () => {
  console.log("🔥 Backend Running Successfully 🔥");
  console.log(`Server running on port ${PORT}`);
});
