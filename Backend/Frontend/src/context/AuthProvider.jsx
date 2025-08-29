// src/context/AuthProvider.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [blogs, setBlogs] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAuthenticated,setIsAuthenticated ] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("http://localhost:4001/api/user/my-profile", {
          withCredentials: true,headers: {"Content-Type": "application/json"},
        });
        console.log("Fetched Blogs:", data);
        setProfile(data);
        setIsAuthenticated(true);
        
      } catch (error) {
        console.error("Fetch error:", error.response?.data || error.message);
      }
    };
    const fetchBlogs = async () => {
      
      try {
        const { data } = await axios.get("http://localhost:4001/api/blogs/all-blogs", {
          withCredentials: true, // ✅ send cookies
        });
        console.log("Fetched Blogs:", data);
        setBlogs(data);
      } catch (error) {
        console.error("Fetch error:", error.response?.data || error.message);
      }
    };

    fetchBlogs();
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ blogs, profile, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
