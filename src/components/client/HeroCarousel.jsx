import React, { useState, useEffect } from 'react';
import { Tag, Sparkles, Heart } from 'lucide-react';

export default function HeroCarousel({ 
  discountSettings = {}, 
  images = [] 
}) {
  const defaultCakes = [
    '/torta1.jpeg',
    '/torta2.jpeg',
    '/torta3.jpeg',
    '/torta4.jpeg',
    '/torta5.jpeg'
  ];

  const cakeSlides = images.length > 0 ? images : defaultCakes;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (cakeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cakeSlides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [cakeSlides.length]);

  return (
    <div className="relative overflow-hidden bg-[#FCE6ED] rounded-3xl mb-6 shadow-sm border border-pink-100/60 flex items-stretch min-h-[160px] sm:min-h-[180px] w-full min-w-0">
      
      <div className="w-[60%] p-4 sm:p-6 flex flex-col justify-center z-10 min-w-0">
        <h2 className="text-lg sm:text-2xl font-black text-gray-900 leading-tight">
          Elegí tu torta <br />
          <span className="inline-flex items-center gap-1.5 text-[#E91E63]">
            ideal
            <Heart className="w-4 h-4 text-[#E91E63] fill-[#E91E63] inline-block animate-pulse shrink-0" />
          </span>
        </h2>

        <p className="text-[11px] sm:text-xs font-semibold text-gray-600 mt-1.5 leading-snug">
          Hecha con amor, <br />
          para momentos únicos.
        </p>

        <div className="mt-3">
          {discountSettings?.isActive && parseFloat(discountSettings?.percent) > 0 ? (
            <div className="inline-flex items-center gap-1.5 bg-[#E91E63] text-white px-3 py-1.5 rounded-xl shadow-xs text-[10px] sm:text-xs font-black tracking-wide animate-pulse max-w-full">
              <Tag className="w-3 h-3 shrink-0" />
              <span className="truncate">
                {discountSettings.percent}% OFF {discountSettings.paymentMethod || 'Efectivo'}
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 bg-[#E91E63] text-white px-3 py-1.5 rounded-xl shadow-xs text-[10px] sm:text-xs font-black tracking-wide">
              <span>100% Artesanal</span>
              <Sparkles className="w-3 h-3 text-pink-200 shrink-0" />
            </div>
          )}
        </div>
      </div>

      <div className="w-[40%] relative overflow-hidden bg-pink-100/40">
        {cakeSlides.map((imgSrc, idx) => {
          const url = typeof imgSrc === 'string' ? imgSrc : imgSrc.image_url;
          const isCurrent = idx === currentIndex;

          return (
            <img
              key={idx}
              src={url}
              alt="Torta artesanal"
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
                isCurrent 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-105 pointer-events-none'
              }`}
            />
          );
        })}
      </div>

    </div>
  );
}