import express from "express";
import cors from "cors";
import contractRoutes from "./routes/contract.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Aurora Backend API Running ⚡ (Sui Enabled)");
});

// Register API routes correctly
app.use("/api", contractRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Sui Backend running at: http://localhost:${PORT}`);
});
