import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";

const Blogs = ({ blog }) => {
  const { updateBlog } = useAuth();

  const [title, setTitle] = useState(blog.title);
  const [category, setCategory] = useState(blog.category);
  const [about, setAbout] = useState(blog.about);
  const [blogImage, setBlogImage] = useState(null);

  const handleUpdate = () => {
    const updatedData = { title, category, about, blogImage };
    updateBlog(blog._id, updatedData);
  };

  return (
    <div>
      <h2>Edit Blog</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
      />
      <textarea
        value={about}
        onChange={(e) => setAbout(e.target.value)}
        placeholder="About"
      />
      <input
        type="file"
        onChange={(e) => setBlogImage(e.target.files[0])}
      />
      <button onClick={handleUpdate}>Update Blog</button>
    </div>
  );
};

export default Blogs;
