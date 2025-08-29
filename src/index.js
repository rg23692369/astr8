import express from "express";
import aiRoutes from "./routes/ai.js";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

// Routes
import authRoutes from "./routes/auth.js";
import astrologerRoutes from "./routes/astrologers.js";
import bookingRoutes from "./routes/bookings.js";
import paymentRoutes from "./routes/payments.js";

// Load environment variables
dotenv.config();

const app = express();

// ✅ Serve static uploads folder
app.use("/uploads", express.static("uploads"));

// ✅ Middleware
app.use(express.json());

// ✅ CORS setup (allow multiple client URLs if needed)
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",")
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ✅ Health check route
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "Astrotalk API" });
});

// ✅ Register API routes
app.use("/api/auth", authRoutes);
app.use("/api/astrologers", astrologerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/ai", aiRoutes);

// ✅ MongoDB connection (safe for Vercel serverless)
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
if (!MONGO_URI) {
  console.error("❌ Missing MONGO_URI/MONGODB_URI in .env");
  process.exit(1);
}

let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(MONGO_URI, { autoIndex: true });
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err?.message || err);
  }
}
connectDB();

// ✅ Export app for Vercel (no app.listen here)
export default app;
