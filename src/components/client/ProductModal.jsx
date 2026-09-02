import React, { useState, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import VariantModalRow from '../modals/VariantModalRow';

export default function ProductModal({
  product,
  isOpen,
  onClose,
  onSaveToCart,
  getVariantQuantityInCart,
  availableFillings = []
}) {
  const [modalQuantities, setModalQuantities] = useState({});
  const [selectedFilling, setSelectedFilling] = useState('');

  const variantsList = useMemo(() => {
    if (!product) return [];
    const raw = product.variante || product.variants || [];
    if (typeof raw === 'string') {
      try { return JSON.parse(raw); } catch { return []; }
    }
    return Array.isArray(raw) ? raw : [];
  }, [product]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && product) {
      if (availableFillings.length > 0) {
        setSelectedFilling(availableFillings[0].name);
      }

      const initialQty = {};
      variantsList.forEach((v) => {
        initialQty[String(v.id)] = getVariantQuantityInCart 
          ? getVariantQuantityInCart(product.id, v.id) 
          : 0;
      });
      setModalQuantities(initialQty);
    }
  }, [isOpen, product, variantsList, availableFillings, getVariantQuantityInCart]);

  if (!isOpen || !product) return null;

  const handleIncrement = (variantId, maxStock) => {
    const key = String(variantId);
    const current = modalQuantities[key] || 0;
    if (current < maxStock) {
      setModalQuantities((prev) => ({ ...prev, [key]: current + 1 }));
    }
  };

  const handleDecrement = (variantId) => {
    const key = String(variantId);
    const current = modalQuantities[key] || 0;
    if (current > 0) {
      setModalQuantities((prev) => ({ ...prev, [key]: current - 1 }));
    }
  };

  const prodName = String(product.name || '').toLowerCase();
  const requiresFilling = prodName.includes('2') || prodName.includes('dos');

  const handleConfirm = () => {
    const chosenFilling = selectedFilling || (availableFillings[0]?.name || '');

    const selectedVariants = variantsList.map((variant) => {
      const key = String(variant.id);
      const qty = modalQuantities[key] || 0;

      const customLabel = requiresFilling && qty > 0
        ? `${variant.label || 'Unidad'} | Relleno: ${chosenFilling}`
        : (variant.label || 'Unidad');

      return {
        productId: product.id,
        productName: product.name,
        image: product.image || product.image_url,
        variantId: `${variant.id}${requiresFilling ? `_${chosenFilling.replace(/\s+/g, '')}` : ''}`,
        variantLabel: customLabel,
        filling: requiresFilling ? chosenFilling : null,
        price: parseFloat(variant.price) || 0,
        quantity: parseInt(qty, 10) || 0,
        maxStock: parseInt(variant.stock, 10) || 0
      };
    });

    onSaveToCart(product.id, selectedVariants);
    onClose();
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-fadeIn"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-sm rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col max-h-[90vh] relative min-w-0"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 bg-pink-100 text-[#E91E63] rounded-full flex items-center justify-center hover:bg-pink-200 font-bold cursor-pointer active:scale-90 transition-transform z-10"
          title="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Cabecera */}
        <div className="flex gap-3 items-center pr-8 pb-3 border-b border-pink-50">
          <img
            src={product.image || product.image_url}
            alt={product.name}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover shrink-0 shadow-xs"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-sm sm:text-base text-[#E91E63] leading-tight truncate" title={product.name}>
              {product.name}
            </h3>
            <p className="text-[10px] text-pink-600 font-semibold mt-0.5">
              Seleccioná las porciones:
            </p>
          </div>
        </div>

        {/* Cuerpo */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 min-w-0 pr-0.5">
          {product.description && (
            <div className="bg-pink-50/50 rounded-xl p-2.5 border border-pink-100">
              <p className="text-xs text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Lista limpia delegada */}
          <div className="space-y-2">
            {variantsList.map((variant) => (
              <VariantModalRow
                key={variant.id}
                variant={variant}
                quantity={modalQuantities[String(variant.id)] || 0}
                onIncrement={() => handleIncrement(variant.id, parseInt(variant.stock, 10) || 0)}
                onDecrement={() => handleDecrement(variant.id)}
              />
            ))}
          </div>

          {requiresFilling && (
            <div className="bg-pink-50/70 p-3 rounded-2xl border border-pink-100">
              <label className="text-xs font-black text-[#D81B60] uppercase block mb-1 tracking-wide">
                Elegí tu segundo relleno:
              </label>
              <select
                value={selectedFilling || (availableFillings[0]?.name || '')}
                onChange={(e) => setSelectedFilling(e.target.value)}
                className="w-full bg-white border border-pink-200 rounded-xl py-2 px-3 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#E91E63] cursor-pointer"
              >
                {availableFillings.map((f) => (
                  <option key={f.id} value={f.name}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Pie */}
        <div className="pt-2 border-t border-pink-50 shrink-0">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full py-3 bg-[#E91E63] hover:bg-[#d81b60] text-white font-bold rounded-2xl shadow-sm text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <span>Confirmar selección</span>
          </button>
        </div>
      </div>
    </div>
  );
}