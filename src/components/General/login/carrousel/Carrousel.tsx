import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Carrousel-styles.css';

import carrouselImage1 from '../../../../assets/img/Carrousel1.png';
import carrouselImage2 from '../../../../assets/img/Carrousel2.png';

const ImageCarousel = () => {
  const settings = {
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const images = [
    carrouselImage1,
    carrouselImage2,
    // Agrega más imágenes importadas según tus necesidades
  ];

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="carousel-slide">
            <img src={image} alt={`Imagen ${index + 1}`} className="carousel-image" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageCarousel;