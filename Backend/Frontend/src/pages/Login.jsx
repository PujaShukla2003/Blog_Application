import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function Login () {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  
   const handleRegister = async (e) => {
    e.preventDefault();

    if(!email || !password || !role){
      toast.error("Please fill all fields");
      ;
    }

     try {
      const { data } = await axios.post(
        "http://localhost:4001/api/user/login",
        {email,password,role},
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // ✅ Important for cookies
        }
      );

      console.log(data);
      toast.success(data.message || "User Logined successfully");

      // Clear form
      
      setEmail("");
      setPassword("");
      setRole("");
      
    } catch (error) {
      console.log (error);
      toast.error(error.message || "Please fill the required field"
        
      );
    }
  };

  return (
    <div>
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <form onSubmit={handleRegister} encType="multipart/form-data">
          <div className="font-semibold text-xl items-center text-center ">
            Cilli<span className="text-blue-500">Blog</span>
          </div>

          <h1 className="text-xl font-semibold mb-6 ">Login</h1>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md"
          >
            <option value="">Select Role</option>
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>

             <input
            type="email"
            placeholder="Your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md"
          />

          <input
            type="password"
            placeholder="Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md"
          />
             <p className="text-center mb-4">
            New User?{" "}
            <Link className="text-blue-600 font-medium" to="/login">
              Register Now
            </Link>
          </p>

          <button
            type="submit"
            className="w-full p-2 bg-blue-500 hover:bg-blue-800 duration-300 rounded-md text-white"
          >
            Login
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}

export default Login;
