import React, { useEffect, useState } from "react";
import { fetchLast8Pictures } from "../../services/firestoreService";
import { ImageDataProps } from "../types/imageType";

// React component to display the images
const Home: React.FC = () => {
  const [pictures, setPictures] = useState<ImageDataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadPictures = async () => {
      try {
        const fetchedPictures = await fetchLast8Pictures();
        setPictures(fetchedPictures);
      } catch (error) {
        console.error("Error loading pictures:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPictures();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-pink-500 grid sm:grid-cols-1 lg:grid-cols-3 w-full sm:h-[calc(100vh-172px)] lg:h-[calc(100vh-112px)] overflow-y-auto">
      {/* First Column */}
      <div className="bg-green-500 flex items-center justify-center">
        <p className="rotate-45">Our latest pictures</p>
      </div>

      {/* Second Column with Nested Grid */}
      <div className="grid grid-cols-1 grid-rows-2 gap-4 bg-red-500 w-full">
        {/* Row 1: Image Gallery */}
        <div className="gallery bg-orange-200 sm:max-w-fit w-full h-full flex justify-center items-center overflow-hidden">
          {pictures.length === 0 ? (
            <p>No pictures found.</p>
          ) : (
            pictures.map((picture) => (
              <img
                key={picture.url}
                src={picture.url}
                alt={`Image ${picture.title}`}
                className="w-full h-auto"
              />
            ))
          )}
        </div>

        {/* Row 2: Additional Content */}
        <div className="bg-blue-200 w-full h-full flex justify-center items-center">
          Another content here
        </div>
      </div>

      {/* Third Column */}
      <div className="bg-yellow-500 flex justify-center items-center">
        <p>Content here</p>
      </div>
    </div>
  );
};

export default Home;
