import React, { useState, useEffect } from 'react';
import { Tag, Sparkles, Heart } from 'lucide-react';
import { supabase } from '../../supabaseClient';

export default function HeroCarousel({ 
  discountSettings = {}, 
  images = [] 
}) {
  const storeId = import.meta.env.VITE_STORE_ID;
  const [slideImages, setSlideImages] = useState(images);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Si ya le pasan imágenes por props, las usa directamente
    if (images && images.length > 0) {
      setSlideImages(images);
      return;
    }

    async function loadProductImages() {
    if (!storeId) return;

    try {
      const { data, error } = await supabase
        .from('products')
        .select('image_url')
        .eq('store_id', storeId)
        .not('image_url', 'is', null)
        .limit(10);

      if (error) throw error;

      // Filtramos URLs válidas descartando strings vacíos
      const urls = (data || [])
        .map((p) => p.image_url)
        .filter((url) => typeof url === 'string' && url.trim().length > 0);

      if (urls.length > 0) {
        let finalImages = [...urls];
        while (finalImages.length < 6) {
          finalImages = [...finalImages, ...urls];
        }
        setSlideImages(finalImages.slice(0, 6));
      } else {
        setSlideImages([
          'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=600&auto=format&fit=crop&q=80'
        ]);
      }
    } catch (err) {
      console.warn('Error al cargar fotos de productos:', err);
    }
  }

    loadProductImages();
  }, [images, storeId]);

  useEffect(() => {
    if (slideImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slideImages.length]);

  return (
    <div className="relative overflow-hidden bg-primary-light rounded-3xl mb-6 shadow-sm flex items-stretch min-h-[160px] sm:min-h-[180px] w-full min-w-0">
      
      <div className="w-[60%] p-4 sm:p-6 flex flex-col justify-center z-10 min-w-0">
        <h2 className="text-lg sm:text-2xl font-black text-gray-900 leading-tight">
          Elegí tu dulce <br />
          <span className="inline-flex items-center gap-1.5 text-primary">
            ideal
            <Heart className="w-4 h-4 text-primary fill-primary inline-block animate-pulse shrink-0" />
          </span>
        </h2>

        <p className="text-[11px] sm:text-xs font-semibold text-gray-600 mt-1.5 leading-snug">
          Hecha con amor, <br />
          para momentos únicos.
        </p>

        <div className="mt-3">
          {discountSettings?.isActive && parseFloat(discountSettings?.percent) > 0 ? (
            <div className="inline-flex items-center gap-1.5 bg-primary text-white px-3 py-1.5 rounded-xl shadow-xs text-[10px] sm:text-xs font-black tracking-wide animate-pulse max-w-full">
              <Tag className="w-3 h-3 shrink-0" />
              <span className="truncate">
                {discountSettings.percent}% OFF {discountSettings.paymentMethod || 'Efectivo'}
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 bg-primary text-white px-3 py-1.5 rounded-xl shadow-xs text-[10px] sm:text-xs font-black tracking-wide">
              <span>100% Artesanal</span>
              <Sparkles className="w-3 h-3 text-primary-light shrink-0" />
            </div>
          )}
        </div>
      </div>

      <div className="w-[40%] relative overflow-hidden bg-primary-clear-bg">
        {slideImages.map((imgSrc, idx) => {
          const url = typeof imgSrc === 'string' ? imgSrc : imgSrc?.image_url;
          const isCurrent = idx === currentIndex;

          return (
            <img
              key={idx}
              src={url}
              alt="Pastelería artesanal"
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