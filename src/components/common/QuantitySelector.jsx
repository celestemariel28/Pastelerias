import React from 'react';
import { Plus, Minus } from 'lucide-react';

export default function QuantitySelector({ quantity, stock, onIncrement, onDecrement }) {
  if (stock <= 0) {
    return (
      <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider shrink-0">
        Sin Stock
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-full border border-pink-200 shadow-2xs shrink-0">
      <button
        type="button"
        onClick={onDecrement}
        disabled={quantity === 0}
        className="w-6 h-6 rounded-full bg-[#E91E63] text-white flex items-center justify-center font-bold text-xs disabled:opacity-20 active:scale-90 transition-transform cursor-pointer"
        title="Restar"
      >
        <Minus className="w-3 h-3" />
      </button>

      <span className="font-extrabold text-xs text-gray-800 w-5 text-center">
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrement}
        disabled={quantity >= stock}
        className="w-6 h-6 rounded-full bg-[#E91E63] text-white flex items-center justify-center font-bold text-xs disabled:opacity-20 active:scale-90 transition-transform cursor-pointer"
        title="Sumar"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
}