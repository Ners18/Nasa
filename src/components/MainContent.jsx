import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SkeletonLoader = () => (
  <div className="border border-gray-300 rounded-lg p-4 animate-pulse">
    <div className="bg-gray-200 h-40 rounded-lg mb-2" />
    <div className="bg-gray-200 h-6 rounded w-3/4 mx-auto" />
  </div>
);

const MainContent = () => {
  const [query, setQuery] = useState("");
  const [mediaTypes, setMediaTypes] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false); // Animation control state
  const navigate = useNavigate(); // Hook for navigation

  const fetchMedia = async () => {
    setLoading(true); // Start loading
    setLoaded(false); // Reset loaded state
    try {
      const mediaTypesQuery = mediaTypes.join(",");
      const response = await axios.get(
        `https://images-api.nasa.gov/search?q=${query}&media_type=${mediaTypesQuery}`
      );
      setMedia(response.data.collection.items);
    } catch (error) {
      console.error("Error fetching media:", error);
    } finally {
      setLoading(false); // Stop loading
      setTimeout(() => {
        setLoaded(true); // Trigger zoom-out after a short delay
      }, 100); // Adjust delay as needed
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

  // Filter media by type
  const images = media.filter((item) => item.data[0]?.media_type === "image");
  const videos = media.filter((item) => item.data[0]?.media_type === "video");
  const audios = media.filter((item) => item.data[0]?.media_type === "audio");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Search...."
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

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-4 gap-4 w-full max-w-6xl">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonLoader key={index} />
          ))}
        </div>
      ) : (
        <>
          {/* Display Images */}
          {images.length > 0 && (
            <div
              className={`media-section transition-transform duration-500 ${
                loaded ? "scale-100" : "scale-110"
              }`}
            >
              <div className="grid grid-cols-4 gap-4 w-full max-w-6xl">
                {images.slice(0, 8).map((item, index) => (
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
          )}

          {/* Display Videos */}
          {videos.length > 0 && (
            <div
              className={`media-section mt-8 transition-transform duration-500 ${
                loaded ? "scale-100" : "scale-110"
              }`}
            >
              <div className="grid grid-cols-4 gap-4 w-full max-w-6xl">
                {videos.slice(0, 8).map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-300 rounded-lg p-4 text-center cursor-pointer"
                    onClick={() => handleImageClick(item.data[0]?.nasa_id)}
                  >
                    <p className="mb-2 font-semibold">
                      {item.data[0]?.title || "No Title"}
                    </p>
                    {item.links && item.links[0]?.href && (
                      <video
                        controls
                        className="w-full h-auto rounded-lg"
                        src={item.links[0]?.href}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Display Audios */}
          {audios.length > 0 && (
            <div
              className={`media-section mt-8 transition-transform duration-500 ${
                loaded ? "scale-100" : "scale-110"
              }`}
            >
              <div className="grid grid-cols-4 gap-4 w-full max-w-6xl">
                {audios.slice(0, 8).map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-300 rounded-lg p-4 text-center cursor-pointer"
                    onClick={() => handleImageClick(item.data[0]?.nasa_id)}
                  >
                    <p className="mb-2 font-semibold">
                      {item.data[0]?.title || "No Title"}
                    </p>
                    {item.links && item.links[0]?.href && (
                      <audio controls className="w-full">
                        <source src={item.links[0].href} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MainContent;
