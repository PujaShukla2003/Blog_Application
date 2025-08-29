// =============================
//  IMPORTS & CONFIG
// =============================
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import fs from "fs"; // For temp file cleanup if needed

// Load env variables
dotenv.config();

// =============================
//  CLOUDINARY CONFIG
// =============================
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

// =============================
//  JWT CREATE & SAVE COOKIE
// =============================
const createTokenAndSaveCookies = async (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  await User.findByIdAndUpdate(userId, { token });
  return token;
};

// =============================
//  USER SCHEMA & MODEL
// =============================
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    education: {
      type: String,
      required: [true, "Education is required"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    photo: {
      public_id: String,
      url: String,
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

// =============================
//  REGISTER USER
// =============================
export const register = async (req, res) => {
  try {
    if (!req.files || !req.files.photo) {
      return res.status(400).json({ message: "User photo is required" });
    }

    const { photo } = req.files;
    const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedFormats.includes(photo.mimetype)) {
      return res.status(400).json({
        message: "Invalid photo format. Only jpg, png, and webp are allowed",
      });
    }

    const { email, name, password, phone, education, role } = req.body;

    if (!email || !name || !password || !phone || !education || !role) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    let cloudinaryResponse;
    try {
      cloudinaryResponse = await cloudinary.uploader.upload(
        photo.tempFilePath,
        {
          folder: "users",
        }
      );
      fs.unlinkSync(photo.tempFilePath); // Remove temp file
    } catch (err) {
      console.error("Cloudinary Error:", err);
      return res.status(500).json({ message: "Image upload failed" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email: email.toLowerCase().trim(),
      name: name.trim(),
      password: hashedPassword,
      phone,
      education,
      role: role.toLowerCase().trim(),
      photo: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });

    await newUser.save();
    const token = await createTokenAndSaveCookies(newUser._id, res);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        photo: newUser.photo.url,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// =============================
//  LOGIN USER
// =============================
export const login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Please fill required fields" });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (user.role !== role) {
      return res.status(400).json({ message: `Role mismatch: ${role}` });
    }

    const token = await createTokenAndSaveCookies(user._id, res);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        photo: user.photo?.url,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// =============================
//  LOGOUT USER
// =============================
export const logout = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// =============================
//  GET MY PROFILE
// =============================
export const getMyProfile = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// =============================
//  GET ADMINS
// =============================
export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" });
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admins" });
  }
};
