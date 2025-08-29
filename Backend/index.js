import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import mongoose from "mongoose";

import blogRoutes from "./routes/blog.route.js";
import userRoutes from "./routes/user.route.js"; // optional

// Load environment variables
dotenv.config();

// Create express app
const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5176",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));

// Routes
app.use("/api/blogs", blogRoutes);
if (userRoutes) {
    app.use("/api/user", userRoutes);
}

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
    dbName: process.env.DB_NAME || "blogApp",
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1); // Stop server if DB fails
});

// Start Server
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
