import React from 'react';
import { PlusCircle, ArrowRight } from 'lucide-react';

export default function CartSummaryCard({ 
  cart = {}, 
  setView, 
  mode = 'products'
}) {
  const totalItems = Object.values(cart).reduce(
    (sum, item) => sum + (parseInt(item?.quantity, 10) || 0), 
    0
  );

  const isCartEmpty = totalItems <= 0;

  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl p-3.5 sm:p-4 shadow-xl border-2 border-pink-100 flex flex-col gap-2.5 my-3 min-w-0">
      <button
        type="button"
        onClick={() => setView('categories')}
        className="w-full py-2.5 bg-pink-50 hover:bg-pink-100/70 text-[#E91E63] rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-pink-200 active:scale-98"
      >
        <PlusCircle className="w-4 h-4 shrink-0" />
        <span>Agregar más productos</span>
      </button>

      {mode === 'products' && (
        <button
          type="button"
          disabled={isCartEmpty}
          onClick={() => setView('form')}
          className="w-full py-3.5 bg-[#E91E63] hover:bg-[#D81B60] text-white rounded-2xl font-black text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer tracking-wide disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
        >
          <span>Continuar con el Pedido</span>
          {!isCartEmpty && <ArrowRight className="w-4 h-4 shrink-0" />}
        </button>
      )}
    </div>
  );
}