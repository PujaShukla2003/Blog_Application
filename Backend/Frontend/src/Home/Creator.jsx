import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

function Creator() {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4001/api/user/admins",
          { withCredentials: true }
        );
        console.log("Admins data:", data);

        // Agar backend array bhejta hai direct
        const adminsArray = Array.isArray(data) ? data : data.Admins || [];
        setAdmins(adminsArray.slice(-4)); // ✅ Sirf last 4 users
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };
    fetchAdmins();
  }, []);

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 4 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6">Popular Creators</h1>

      {admins.length > 0 ? (
        <Carousel responsive={responsive}>
          {admins.map((element) => (
            <div
              key={element._id}
              className="flex flex-col items-center bg-white rounded-lg p-4 hover:shadow-lg transform hover:scale-105 transition-transform duration-300"
            >
              <div className="group relative">
                <img
                  src={element.photo?.url || "https://via.placeholder.com/150"}
                  alt={element.name}
                  className="w-32 h-32 object-cover rounded-full border-4 border-yellow-200 shadow-md"
                />
              </div>
              <div className="text-center mt-3">
                <p className="font-semibold text-gray-800">{element.name}</p>
                <p className="text-gray-500 text-sm">{element.role || "Creator"}</p>
              </div>
            </div>
          ))}
        </Carousel>
      ) : (
        <div>No creators found</div>
      )}
    </div>
  );
}

export default Creator;


