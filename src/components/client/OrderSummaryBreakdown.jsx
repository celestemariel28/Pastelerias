//resumen interactivo del pedido que se renderiza dentro del formulario final (FormView).
import React from 'react';
import { Trash2 } from 'lucide-react';

export default function OrderSummaryBreakdown({
  cart = {},
  subtotal = 0,
  appliesDiscount = false,
  discountSettings = {},
  discountAmount = 0,
  totalFinal = 0,
  onRemoveItem
}) {
  const cartEntries = Object.entries(cart).filter(([_, item]) => (parseInt(item?.quantity, 10) || 0) > 0);

  return (
    <div className="bg-rose-50/40 rounded-2xl p-3.5 border border-pink-100 space-y-3 min-w-0">
      {/* Lista de productos con botón de eliminar */}
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1 min-w-0">
        {cartEntries.map(([cartKey, item]) => {
          const qty = parseInt(item.quantity, 10) || 0;
          const price = parseFloat(item.price) || 0;
          const lineTotal = price * qty;
          const name = item.productName || item.name || 'Dulce';

          return (
            <div 
              key={cartKey} 
              className="flex items-center justify-between gap-2 p-2 bg-white rounded-xl border border-pink-50 shadow-2xs min-w-0"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-800 truncate" title={name}>
                  {qty}x {name}
                </p>
                {item.variantLabel && (
                  <p className="text-[10px] text-gray-500 truncate" title={item.variantLabel}>
                    {item.variantLabel}
                  </p>
                )}
                {item.filling && (
                  <p className="text-[10px] text-pink-600 font-medium truncate">
                    Relleno: {item.filling}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-gray-700">
                  ${lineTotal.toLocaleString('es-AR')}
                </span>

                {onRemoveItem && (
                  <button
                    type="button"
                    onClick={() => onRemoveItem(cartKey)}
                    className="w-7 h-7 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer active:scale-90"
                    title="Eliminar producto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {cartEntries.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-2">
            No hay productos en el carrito.
          </p>
        )}
      </div>

      {/* Desglose de importes */}
      <div className="border-t border-pink-100/80 pt-2.5 space-y-1.5 text-xs">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal:</span>
          <span className="font-semibold">${(subtotal || 0).toLocaleString('es-AR')}</span>
        </div>

        {appliesDiscount && discountAmount > 0 && (
          <div className="flex justify-between items-center text-[#E91E63] font-medium gap-2">
            <span className="truncate">
              Desc. {discountSettings?.paymentMethod || 'Efectivo'} ({discountSettings?.percent || 0}% OFF):
            </span>
            <span className="shrink-0 font-bold">-${discountAmount.toLocaleString('es-AR')}</span>
          </div>
        )}

        <div className="flex justify-between text-sm font-black text-gray-900 pt-1 border-t border-dashed border-pink-200">
          <span>Total a Pagar:</span>
          <span className="text-[#E91E63]">
            ${(totalFinal !== undefined ? totalFinal : subtotal).toLocaleString('es-AR')}
          </span>
        </div>
      </div>
    </div>
  );
}