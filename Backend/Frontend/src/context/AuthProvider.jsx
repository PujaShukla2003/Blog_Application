import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [blogs, setBlogs] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4001/api/user/my-profile",
          { withCredentials: true }
        );
        console.log("Fetched Profile:", data);
        setProfile(data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Profile fetch error:", error.response?.data || error.message);
        setProfile(null);
        setIsAuthenticated(false);
      }
    };

    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4001/api/blogs/all-blogs",
          { withCredentials: true }
        );
        console.log("Fetched Blogs:", data);
        setBlogs(data);
      } catch (error) {
        console.error("Blogs fetch error:", error.response?.data || error.message);
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

