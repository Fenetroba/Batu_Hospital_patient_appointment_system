import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Users, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/Context/LanguageContext';

const HeroSection = () => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: t('welcomeTitle'),
      subtitle: t('welcomeSubtitle'),
      description: t('welcomeDescription'),
     
      ctaLink: "/login",
      bgColor: "from-[var(--five)] to-[var(--two)]"
    },
    {
      title: t('emergencyTitle'),
      subtitle: t('emergencySubtitle'),
      description: t('emergencyDescription'),
    
      ctaLink: "/location",
      bgColor: "from-[var(--four)] to-[var(--three)]"
    },
    {
      title: t('teamTitle'),
      subtitle: t('teamSubtitle'),
      description: t('teamDescription'),
      
      ctaLink: "/team",
      bgColor: "from-[var(--three)] to-[var(--five)]"
    }
  ];

  // Auto-scroll every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative h-[600px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide
              ? 'opacity-100 translate-x-0'
              : index < currentSlide
              ? 'opacity-0 -translate-x-full'
              : 'opacity-0 translate-x-full'
          }`}
        >
          <div className={`h-full bg-gradient-to-r ${slide.bgColor} flex items-center justify-center`}>
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-3xl mx-auto text-center text-white">
                {/* Animated Content */}
                <h1 
                  className={`text-4xl md:text-6xl font-bold mb-4 transition-all duration-700 delay-200 ${
                    index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                >
                  {slide.title}
                </h1>
                <h2 
                  className={`text-2xl md:text-3xl mb-6 transition-all duration-700 delay-300 ${
                    index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                >
                  {slide.subtitle}
                </h2>
                <p 
                  className={`text-lg md:text-xl mb-8 transition-all duration-700 delay-400 ${
                    index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                >
                  {slide.description}
                </p>
               
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'bg-white w-12 h-3'
                : 'bg-white/50 w-3 h-3 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Quick Stats */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 hidden md:block">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/20 backdrop-blur-md rounded-lg p-4 text-center text-white">
            <Calendar className="w-8 h-8 mx-auto mb-2" />
            <p className="font-bold text-2xl">24/7</p>
            <p className="text-sm">{t('emergencyCare')}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-lg p-4 text-center text-white">
            <Users className="w-8 h-8 mx-auto mb-2" />
            <p className="font-bold text-2xl">50+</p>
            <p className="text-sm">{t('expertDoctors')}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-lg p-4 text-center text-white">
            <Heart className="w-8 h-8 mx-auto mb-2" />
            <p className="font-bold text-2xl">10K+</p>
            <p className="text-sm">{t('patientsServed')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;