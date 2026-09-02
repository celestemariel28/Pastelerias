import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Check, X, ArrowLeft, ArrowRight } from 'lucide-react';

export default function CustomCakeInfoCard({ 
  infoRead = false, 
  onConfirmRead, 
  infoSlides: initialSlides = [],
  isOpen, 
  onClose 
}) {
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const [slides, setSlides] = useState(initialSlides);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isControlled = typeof isOpen === 'boolean';
  const showModal = isControlled ? isOpen : internalModalOpen;

  const handleClose = () => {
    if (isControlled && onClose) {
      onClose();
    } else {
      setInternalModalOpen(false);
    }
  };

  useEffect(() => {
    if (initialSlides.length > 0) {
      setSlides(initialSlides);
      return;
    }

    async function fetchSlides() {
      try {
        const { data, error } = await supabase
          .from('info_slides')
          .select('*');

        if (!error && data) {
          setSlides(data);
        }
      } catch (err) {
        console.error('Info slides no disponibles:', err);
      }
    }
    fetchSlides();
  }, [initialSlides]);

  const handleNext = () => {
    if (slides.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    if (slides.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleConfirm = () => {
    if (onConfirmRead) {
      onConfirmRead();
    }
    handleClose(); 
  };

  const currentSlide = slides[currentIndex] || null;

  return (
    <>
      {!isControlled && (
        <div
          className={`rounded-3xl p-5 mb-5 border-2 transition-all ${
            infoRead ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50/80 border-[#E91E63] shadow-lg'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 bg-[#E91E63] text-white rounded-full">
                Paso 1 Obligatorio
              </span>
              <h3 className="font-black text-sm text-[#D81B60] mt-1">Información Importante</h3>
            </div>
            {infoRead && (
              <span className="bg-emerald-500 text-white px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-sm">
                <Check className="w-3.5 h-3.5" />
                <span>Leído</span>
              </span>
            )}
          </div>

          <p className="text-xs text-gray-600 mb-3 leading-relaxed">
            {infoRead
              ? '¡Información confirmada! Ya podés armar tu torta personalizada debajo.'
              : 'Antes de realizar tu pedido es necesario leer los tiempos de anticipación y condiciones de entrega.'}
          </p>

          <button
            type="button"
            onClick={() => {
              setCurrentIndex(0);
              setInternalModalOpen(true);
            }}
            className={`w-full py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform cursor-pointer ${
              infoRead
                ? 'bg-white border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-50'
                : 'bg-[#E91E63] text-white hover:bg-[#d81b60]'
            }`}
          >
            {infoRead ? 'Volver a ver información' : 'Ver Información Importante'}
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl flex flex-col items-center relative max-h-[92vh] overflow-y-auto">
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 bg-pink-100 text-[#E91E63] rounded-full flex items-center justify-center hover:bg-pink-200 font-bold cursor-pointer active:scale-90 transition-transform z-10 shadow-sm"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-black text-sm text-[#D81B60] mb-1 uppercase text-center pr-8 pl-2">
              {currentSlide?.title || 'Información Importante'}
            </h3>

            {slides.length > 0 && (
              <span className="text-[11px] font-bold text-gray-400 mb-2">
                Foto {currentIndex + 1} de {slides.length}
              </span>
            )}

            <div className="w-full rounded-2xl overflow-hidden shadow-inner border border-gray-100 mb-3 bg-gray-50 flex items-center justify-center min-h-[280px]">
              {currentSlide?.image_url ? (
                <img
                  key={`slide-${currentSlide.id || currentIndex}`}
                  src={currentSlide.image_url}
                  alt={currentSlide.title || `Información ${currentIndex + 1}`}
                  className="w-full h-auto max-h-[50vh] object-contain animate-fadeIn"
                />
              ) : (
                <p className="text-xs text-gray-400 p-4 text-center font-medium">Cargando información...</p>
              )}
            </div>

            {slides.length > 1 && (
              <div className="flex items-center justify-between w-full px-4 mb-4">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-10 h-10 bg-pink-100 hover:bg-pink-200 text-[#E91E63] rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform cursor-pointer"
                  title="Anterior"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1.5">
                  {slides.map((_, idx) => (
                    <button
                      key={`dot-${idx}`}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === currentIndex ? 'w-6 bg-[#E91E63]' : 'w-2 bg-pink-200'
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-10 h-10 bg-pink-100 hover:bg-pink-200 text-[#E91E63] rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform cursor-pointer"
                  title="Siguiente"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleConfirm}
              className="w-full py-3.5 bg-emerald-600 text-white font-black rounded-2xl text-xs shadow-lg active:scale-95 transition-transform hover:bg-emerald-700 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{onConfirmRead ? 'Leí y acepto la información' : 'Entendido'}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}