import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import contractRoutes from "./routes/contract.js";
import slushRoutes from "./routes/slush.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  res.send("Aurora Backend API Running ⚡ (Sui + Walrus + Seal + Nautilus)");
});

// Register all API routes
app.use("/api/contract", contractRoutes);  // Scanner API
app.use("/api/slush", slushRoutes);        // Walrus Slush Status API

// PORT setup
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
