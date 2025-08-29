import mongoose from "mongoose";
import dotenv from "dotenv";
import { Blog } from "../models/blog.model.js";
import { v2 as cloudinary } from "cloudinary";

// ✅ Load env variables before anything else
dotenv.config();

// ✅ Cloudinary Config (direct env se)
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});




// ------------------ CREATE BLOG ------------------
export const createBlog = async (req, res) => {
  try {
    const blogImageFile =
      req.files?.blogimage || req.files?.blogImage || req.files?.BLOGIMAGE;

    if (!blogImageFile) {
      return res.status(400).json({ message: "Blog Image is required" });
    }

    const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedFormats.includes(blogImageFile.mimetype)) {
      return res.status(400).json({
        message: "Invalid image format. Only jpg, png and webp are allowed",
      });
    }

    const title = req.body.title?.trim();
    const category = req.body.category?.trim();
    const about = req.body.about?.trim();

    if (!title || !category || !about) {
      return res.status(400).json({
        message: "Title, category & about are required fields",
      });
    }

    const adminName = req?.user?.name;
    const adminPhoto = req?.user?.photo.url;
    const createdBy = req?.user?._id;

    const cloudinaryResponse = await cloudinary.uploader.upload(
      blogImageFile.tempFilePath,
      { folder: "blogs" }
    );

    const blog = await Blog.create({
      title,
      about,
      category,
      adminName,
      adminPhoto,
      createdBy,
      blogImage: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });

    return res.status(201).json({
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    console.error("CREATE BLOG ERROR:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

// ------------------ DELETE BLOG ------------------
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.blogImage?.public_id) {
      await cloudinary.uploader.destroy(blog.blogImage.public_id);
    }

    await blog.deleteOne();
    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("DELETE BLOG ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
};

// ------------------ GET ALL BLOGS ------------------
export const getAllBlogs = async (req, res) => {
  try {
    const allBlogs = await Blog.find().sort({ createdAt: -1 });
    return res.status(200).json(allBlogs);
  } catch (error) {
    console.error("GET ALL BLOGS ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
};

// ------------------ GET SINGLE BLOG ------------------
export const getSingleBlogs = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Blog id" });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json(blog);
  } catch (error) {
    console.error("GET SINGLE BLOG ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
};

// ------------------ GET MY BLOGS ------------------
export const getMyBlogs = async (req, res) => {
  try {
    const myBlogs = await Blog.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(myBlogs);
  } catch (error) {
    console.error("GET MY BLOGS ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
};

// ------------------ UPDATE BLOG ------------------
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Blog id" });
    }

    const updateData = {
      title: req.body.title?.trim(),
      about: req.body.about?.trim(),
      category: req.body.category?.trim(),
    };

    // ✅ Handle new image upload if provided
    const blogImageFile =
      req.files?.blogimage || req.files?.blogImage || req.files?.BLOGIMAGE;
    if (blogImageFile) {
      const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedFormats.includes(blogImageFile.mimetype)) {
        return res.status(400).json({
          message: "Invalid image format. Only jpg, png and webp are allowed",
        });
      }

      const blog = await Blog.findById(id);
      if (blog?.blogImage?.public_id) {
        await cloudinary.uploader.destroy(blog.blogImage.public_id);
      }

      const cloudinaryResponse = await cloudinary.uploader.upload(
        blogImageFile.tempFilePath,
        { folder: "blogs" }
      );
      updateData.blogImage = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      };
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json(updatedBlog);
  } catch (error) {
    console.error("UPDATE BLOG ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
};
