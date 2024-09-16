// MainContent.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MainContent = () => {
  const [query, setQuery] = useState("");
  const [mediaTypes, setMediaTypes] = useState([]);
  const [media, setMedia] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  const fetchMedia = async () => {
    try {
      const mediaTypesQuery = mediaTypes.join(",");
      const response = await axios.get(
        `https://images-api.nasa.gov/search?q=${query}&media_type=${mediaTypesQuery}`
      );
      setMedia(response.data.collection.items);
    } catch (error) {
      console.error("Error fetching media:", error);
    }
  };

  const handleSearch = () => {
    fetchMedia();
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setMediaTypes((prev) =>
      checked ? [...prev, value] : prev.filter((type) => type !== value)
    );
  };

  const handleImageClick = (id) => {
    navigate(`/asset/${id}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
        >
          Search
        </button>
      </div>
      <div className="mb-4 flex space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            value="audio"
            onChange={handleCheckboxChange}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="text-gray-700">Audio</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            value="video"
            onChange={handleCheckboxChange}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="text-gray-700">Video</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            value="image"
            onChange={handleCheckboxChange}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="text-gray-700">Pictures</span>
        </label>
      </div>
      <div className="grid grid-cols-4 gap-4 w-full max-w-6xl">
        {media.slice(0, 8).map((item, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg p-4 text-center cursor-pointer"
            onClick={() => handleImageClick(item.data[0]?.nasa_id)}
          >
            <p className="mb-2 font-semibold">
              {item.data[0]?.title || "No Title"}
            </p>
            {item.links && item.links[0]?.href && (
              <img
                src={item.links[0].href}
                alt={item.data[0]?.title}
                className="w-full h-auto rounded-lg"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainContent;
