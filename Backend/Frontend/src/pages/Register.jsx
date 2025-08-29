import axios from "axios";
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [education, setEducation] = useState("");
  const [photo, setPhoto] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");

  const fileInputRef = useRef(null); // ✅ File input reset के लिए

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !password || !role || !education || !photo) {
      toast.error("Please fill all fields and upload a photo.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("email", email.trim().toLowerCase());
    formData.append("phone", phone.trim());
    formData.append("password", password.trim());
    formData.append("role", role.trim().toLowerCase()); // ✅ lowercase
    formData.append("education", education.trim());
    formData.append("photo", photo);

    try {
      const { data } = await axios.post(
        "http://localhost:4001/api/user/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log("Registered:", data);
      toast.success(data.message || "User registered successfully");

      // ✅ Clear form
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setRole("");
      setEducation("");
      setPhoto("");
      setPhotoPreview("");

      // ✅ Reset file input field
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }

    } catch (error) {
      console.log("Registration error:", error);
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <form onSubmit={handleRegister} encType="multipart/form-data">
          <div className="font-semibold text-xl text-center mb-4">
            Cilli<span className="text-blue-500">Blog</span>
          </div>

          <h1 className="text-xl font-semibold mb-6">Register</h1>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md"
          >
            <option value="">Select Role</option>
            <option value="user">User</option> {/* ✅ lowercase */}
            <option value="admin">Admin</option> {/* ✅ lowercase */}
          </select>

          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md"
          />

          <input
            type="email"
            placeholder="Your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md"
          />

          <input
            type="tel" // ✅ type tel instead of number
            placeholder="Your Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md"
          />

          <input
            type="password"
            placeholder="Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md"
          />

          <select
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md"
          >
            <option value="">Select Your Education</option>
            <option value="BCA">BCA</option>
            <option value="MCA">MCA</option>
            <option value="MBA">MBA</option>
            <option value="BBA">BBA</option>
            <option value="B.Tech">B.Tech</option>
          </select>

          <div className="flex items-center mb-4 gap-3">
            <div className="photo w-20 h-20 border rounded-md overflow-hidden">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  Preview
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={changePhotoHandler}
              ref={fileInputRef} // ✅ Ref added for reset
              className="w-full p-2 border rounded-md"
            />
          </div>

          <p className="text-center mb-4">
            Already Registered?{" "}
            <Link className="text-blue-600 font-medium" to="/login">
              Login Now
            </Link>
          </p>

          <button
            type="submit"
            className="w-full p-2 bg-blue-500 hover:bg-blue-800 duration-300 rounded-md text-white"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
