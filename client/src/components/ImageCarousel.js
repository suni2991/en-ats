// src/components/ImageCarousel.js
import React from "react";
import { Carousel } from "antd";

import recruitment from '../Assests/registerApplicant.png';
import postjob from '../Assests/Job_approval.PNG';
import flow from '../Assests/App_Management.PNG';
import  selection from '../Assests/Selection_process.PNG'

const ImageCarousel = () => {
  // Define the images in the specified order
  const images = [ flow, postjob, recruitment,selection  ];

  return (
    <Carousel autoplay={false} dots={true} className="image-carousel">
      {images.map((image, index) => (
        <div key={index} className="carousel-slide">
          <img
            src={image}
            alt={`carousel-slide-${index}`}
            className="carousel-image"
          />
        </div>
      ))}
    </Carousel>
  );
};

export default ImageCarousel;
