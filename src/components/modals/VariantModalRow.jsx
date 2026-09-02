import React from 'react';
import QuantitySelector from '../common/QuantitySelector';

export default function VariantModalRow({ variant, quantity, onIncrement, onDecrement }) {
  const stock = parseInt(variant.stock, 10) || 0;
  const price = parseFloat(variant.price) || 0;

  return (
    <div className="flex items-center justify-between p-2.5 sm:p-3 bg-primary-clear rounded-2xl border border-primary-clear-b gap-2 min-w-0">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-extrabold text-gray-800 truncate">{variant.label}</p>
        <p className="text-xs font-black text-primary">
          ${price.toLocaleString('es-AR')}
        </p>
        <p className="text-[10px] text-gray-400">Stock: {stock}</p>
      </div>

      <QuantitySelector
        quantity={quantity}
        stock={stock}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />
    </div>
  );
}