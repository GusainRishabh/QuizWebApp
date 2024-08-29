import React, { useState, useEffect, useRef } from 'react';
import SearchBar from '../searchbar';

function Contant() {
  const [videoData, setVideoData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch video data from the JSON file
  useEffect(() => {
    fetch('/contantvideo.json') // Ensure the path is correct
      .then((response) => response.json())
      .then((data) => {
        setVideoData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching video data:', error);
        setLoading(false);
      });
  }, []);

  // Ref to hold video elements
  const videoRefs = useRef([]);

  // Function to handle hover events
  const handleMouseEnter = (index) => {
    if (videoRefs.current[index]) {
      videoRefs.current[index].play();
    }
  };

  const handleMouseLeave = (index) => {
    if (videoRefs.current[index]) {
      videoRefs.current[index].pause();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <SearchBar />
      <section
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mx-auto my-8"
        style={{ width: '90%', maxWidth: '1200px' }}
      >
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Powering Innovation at 200,000+ Companies Worldwide
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          Track work across the enterprise through an open, collaborative platform. Deliver great service experiences fast - without the complexity of traditional ITSM solutions.
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          If you want to download a video, please click the three dots on the video section.
        </p>
        {/* Grid layout for videos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loading ? (
            // Render skeletons while loading
            Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)
          ) : (
            videoData.map((video, index) => (
              <div
                key={video.id}
                className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-lg relative cursor-pointer"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
              >
                <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">{video.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{video.description}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                  Uploaded on: {new Date(video.uploaded_at).toLocaleDateString()}
                </p>
                <div className="relative" style={{ height: '300px' }}>
                  <video
                    ref={(el) => (videoRefs.current[index] = el)}
                    className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                    controls
                  >
                    <source src={video.file_path} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="absolute top-2 right-2 flex items-center space-x-2">
                  {/* Add your icon here */}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

const SkeletonCard = () => {
  return (
    <div className="p-6 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-lg animate-pulse">
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-3"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-4"></div>
      <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded"></div>
    </div>
  );
};

export default Contant;
