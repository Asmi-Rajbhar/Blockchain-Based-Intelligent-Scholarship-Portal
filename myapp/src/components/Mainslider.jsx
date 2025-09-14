import React, { useState, useEffect } from "react";
// import "./Slider.css"; 
import ".././css/Mainslider.css"
import banner1 from "../assets/banner1.png";
import banner2 from "../assets/banner2.png";
import banner3 from "../assets/banner3.png";
import banner4 from "../assets/banner4.png";

const Slider = () => {
  // Array of image URLs
  const images = [
    banner1,
    banner2,
    banner3,
    banner4,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Set an interval to change the image every 3 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="slider-container">
      {/* Display the current image */}
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        className="slider-image"
      />
    </div>
  );
};

export default Slider;
