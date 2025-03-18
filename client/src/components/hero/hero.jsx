import React, { useState, useEffect } from "react";
import "./hero.css";
import lionPhoto from "../../zoo_pictures/zoo_lion.jpg";
import babymonkey from "../../zoo_pictures/baby_gorilla2.jpg";
import couplebirds from "../../zoo_pictures/couple_birds_3.jpeg";

const Hero = () => {
  const slides = [
    {
      image: lionPhoto,
      alt: "Majestic lion in natural habitat",
      title: "King of the Jungle",
      description: "Meet our magnificent lions in their spacious habitat",
    },
    {
      image: babymonkey,
      alt: "Baby gorilla in natural habitat",
      title: "Young Explorers",
      description: "Watch our playful young primates discover their world",
    },
    {
      image: couplebirds,
      alt: "Colorful birds perched together",
      title: "Feathered Friends",
      description: "Our aviary features exotic birds from around the world",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  // Function to go to the next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Function to go to the previous slide
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Autoplay functionality
  useEffect(() => {
    let slideInterval;

    if (autoplay) {
      slideInterval = setInterval(() => {
        nextSlide();
      }, 5000); // Change slide every 5 seconds
    }

    // Cleanup on component unmount
    return () => {
      clearInterval(slideInterval);
    };
  });

  // Pause autoplay when user interacts with slider
  const handleSliderInteraction = () => {
    setAutoplay(false);

    // Resume autoplay after 10 seconds of inactivity
    const timeout = setTimeout(() => {
      setAutoplay(true);
    }, 10000);

    return () => clearTimeout(timeout);
  };

  return (
    <div className="hero-container">
      <div className="hero-image">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? "active" : ""}`}
          >
            <img src={slide.image} alt={slide.alt} />

            {/* Slide content/caption */}
            <div className="slide-caption">
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
            </div>
          </div>
        ))}

        <div className="slider-controls">
          <button
            className="slider-arrow left"
            onClick={() => {
              prevSlide();
              handleSliderInteraction();
            }}
            aria-label="Previous slide"
          >
            &#8249;
          </button>
          <button
            className="slider-arrow right"
            onClick={() => {
              nextSlide();
              handleSliderInteraction();
            }}
            aria-label="Next slide"
          >
            &#8250;
          </button>
        </div>

        {/* Slide indicators */}
        <div className="slide-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? "active" : ""}`}
              onClick={() => {
                setCurrentSlide(index);
                handleSliderInteraction();
              }}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
