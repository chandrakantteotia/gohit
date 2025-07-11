import React, { useEffect, useState } from 'react';

interface HeroSliderProps {
  images: { url: string; title?: string; subtitle?: string }[];
  autoSlide?: boolean;
  slideInterval?: number;
}

const HeroSlider: React.FC<HeroSliderProps> = ({ images, autoSlide = true, slideInterval = 4000 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!autoSlide) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, slideInterval);
    return () => clearInterval(timer);
  }, [autoSlide, slideInterval, images.length]);

  return (
    <div className="w-full h-full">
      <img
        src={images[index].url}
        alt={images[index].title}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default HeroSlider;
