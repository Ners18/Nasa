import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// Skeleton Loader Component
const SkeletonLoader = () => (
  <div className="flex flex-col items-center justify-center p-4">
    <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-4" /> {/* Title */}
      <div className="h-40 bg-gray-200 rounded mb-4" /> {/* Image/Video area */}
      <div className="h-10 bg-gray-200 rounded mb-4" /> {/* Audio controls */}
      <div className="h-16 bg-gray-200 rounded mb-4" /> {/* Metadata area */}
      <div className="h-6 bg-gray-200 rounded" /> {/* Asset ID */}
    </div>
  </div>
);

const Asset = () => {
  const { id } = useParams();
  const [assetData, setAssetData] = useState(null);
  const [assetMedia, setAssetMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metadataVisible, setMetadataVisible] = useState(false);

  useEffect(() => {
    const fetchAsset = async () => {
      setLoading(true); // Start loading
      try {
        const metadataResponse = await axios.get(
          `https://images-api.nasa.gov/search?nasa_id=${id}`
        );

        const metadata = metadataResponse.data.collection.items[0].data[0];

        const mediaResponse = await axios.get(
          `https://images-api.nasa.gov/asset/${id}`
        );

        const mediaItems = mediaResponse.data.collection.items;

        const mediaLinks = mediaItems
          .filter(
            (item) =>
              item.href.endsWith("~orig.jpg") ||
              item.href.endsWith("~orig.mp4") ||
              item.href.endsWith(".mp3") ||
              item.href.endsWith(".wav") ||
              item.href.endsWith(".m4a")
          )
          .map((item) => item.href);

        setAssetData(metadata);
        setAssetMedia(mediaLinks);
      } catch (error) {
        console.error("Error fetching asset:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchAsset();
  }, [id]);

  // If loading, show skeleton loader
  if (loading) return <SkeletonLoader />;
  if (!assetData || assetMedia.length === 0) return <div>No asset found</div>;

  // Find the first audio file (mp3, wav, m4a)
  const firstAudio = assetMedia.find(
    (media) =>
      media.endsWith(".mp3") || media.endsWith(".wav") || media.endsWith(".m4a")
  );

  // Find all images
  const images = assetMedia.filter((media) => media.endsWith("~orig.jpg"));

  // Find all videos
  const videos = assetMedia.filter((media) => media.endsWith("~orig.mp4"));

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Card to display asset details */}
      <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4">
          {assetData.title || "Asset Title"}
        </h1>

        {/* Render images if available */}
        {images.length > 0 && (
          <div className="media-gallery mb-4">
            {images.map((image, index) => (
              <div key={index} className="image-asset mb-4">
                <img
                  src={image}
                  alt={`Visual representation of ${assetData.title}`} // Descriptive alt text
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
            ))}
          </div>
        )}

        {/* Render videos if available */}
        {videos.length > 0 && (
          <div className="media-gallery mb-4">
            {videos.map((video, index) => (
              <div key={index} className="video-asset mb-4">
                <video controls className="w-full h-auto rounded-lg shadow-md">
                  <source src={video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </div>
        )}

        {/* Render the first audio file if available */}
        {firstAudio ? (
          <div className="audio-asset media-asset mb-4">
            <audio controls className="w-full mt-2">
              <source
                src={firstAudio}
                type={
                  firstAudio.endsWith(".mp3")
                    ? "audio/mpeg"
                    : firstAudio.endsWith(".wav")
                    ? "audio/wav"
                    : firstAudio.endsWith(".m4a")
                    ? "audio/mp4"
                    : ""
                }
              />
              Your browser does not support the audio tag.
            </audio>
            <div className="mt-2">
              <div
                className="cursor-pointer mb-2 text-blue-500"
                onClick={() => setMetadataVisible(!metadataVisible)}
              >
                {metadataVisible ? "Hide Metadata" : "Show Metadata"}
              </div>
              {metadataVisible && (
                <div className="asset-metadata">
                  <div className="asset-date">
                    <strong>Date Created:</strong> {assetData.date_created}
                  </div>
                  <p className="asset-desc">
                    {assetData.description || "No description available"}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* Ensure description is not duplicated */}
        {!firstAudio && (
          <p className="text-gray-700">
            {assetData.description || "No description available"}
          </p>
        )}

        <p className="text-gray-500 mt-4">Asset ID: {id}</p>
      </div>
    </div>
  );
};

export default Asset;
