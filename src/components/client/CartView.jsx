import React from 'react';
import { ArrowLeft, ArrowRight, PlusCircle, ShoppingBag, Trash2, Tag } from 'lucide-react';
import ViewHeader from '../common/ViewHeader';

export default function CartView({
  setView,
  cart = {},
  calculateSubtotal,
  onRemoveItemFromCart,
  discountSettings = {}
}) {
  const subtotal = calculateSubtotal ? calculateSubtotal() : 0;
  const cartItems = Object.entries(cart).filter(([_, item]) => (parseInt(item?.quantity, 10) || 0) > 0);

  if (cartItems.length === 0) {
    return (
      <main className="flex-1 p-6 max-w-md mx-auto w-full flex flex-col items-center justify-center gap-4 text-center animate-fadeIn min-h-[60vh]">
        <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center text-[#E91E63] shadow-inner">
          <ShoppingBag className="w-10 h-10 stroke-[2.2]" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-black text-[#E91E63]">Tu carrito está vacío</h3>
          <p className="text-xs text-gray-500 max-w-xs font-semibold">
            Aún no agregaste delicias a tu pedido.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setView('categories')}
          className="mt-2 py-3 px-6 bg-[#E91E63] hover:bg-[#d81b60] text-white rounded-2xl text-xs font-black shadow-md active:scale-95 transition-transform cursor-pointer"
        >
          Explorar Categorías
        </button>
      </main>
    );
  }

  const hasActiveDiscount = Boolean(
    discountSettings?.isActive && parseFloat(discountSettings?.percent) > 0
  );

  return (
    <main className="flex-1 p-4 max-w-md mx-auto w-full pb-24 animate-fadeIn">
      <ViewHeader
        title="Mi Carrito"
        onBack={() => setView('products')}
        backTitle="Volver al catálogo"
      />

      <div className="bg-white/95 backdrop-blur-sm p-4 rounded-3xl shadow-xl border border-pink-100 flex flex-col gap-3 mb-4 min-w-0">
        {hasActiveDiscount && (
          <div className="flex items-center gap-2 bg-pink-50 border border-pink-200/80 px-3 py-2 rounded-xl text-xs text-[#D81B60] font-bold">
            <Tag className="w-4 h-4 shrink-0" />
            <span className="truncate">
              ¡{discountSettings.percent}% OFF pagando en {discountSettings.paymentMethod || 'Efectivo'}!
            </span>
          </div>
        )}

        <div className="space-y-2 max-h-[42vh] overflow-y-auto pr-1 min-w-0">
          {cartItems.map(([key, item]) => {
            const qty = parseInt(item.quantity, 10) || 1;
            const name = item.productName || item.name || 'Producto';
            const variant = item.variantLabel ? ` (${item.variantLabel})` : '';
            const lineTotal = (parseFloat(item.price) || 0) * qty;

            return (
              <div 
                key={key} 
                className="flex items-center justify-between bg-rose-50/50 hover:bg-rose-50 p-2.5 rounded-xl border border-rose-100 transition-colors text-xs min-w-0 gap-2"
              >
                <div className="flex-1 min-w-0 leading-tight">
                  <p className="font-extrabold text-gray-800 truncate" title={name}>
                    <span className="text-[#E91E63] font-black mr-1">{qty}x</span>
                    {name}
                  </p>
                  {variant && (
                    <p className="text-[10px] text-gray-500 font-medium truncate">{variant}</p>
                  )}
                  {item.filling && (
                    <p className="text-[10px] text-pink-600 font-semibold truncate">
                      Relleno: {item.filling}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-black text-gray-700 text-xs">
                    ${lineTotal.toLocaleString('es-AR')}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveItemFromCart(key)}
                    className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-xl transition-colors active:scale-90 cursor-pointer"
                    title="Eliminar producto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setView('categories')}
          className="w-full py-2.5 bg-pink-50 hover:bg-pink-100/70 text-[#E91E63] rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-pink-200 active:scale-98"
        >
          <PlusCircle className="w-4 h-4 shrink-0" />
          <span>Agregar más productos</span>
        </button>

        <div className="flex justify-between items-center border-t border-pink-100 pt-3">
          <span className="text-xs font-black text-gray-600 uppercase tracking-wider">
            Subtotal Parcial:
          </span>
          <span className="text-lg font-black text-[#E91E63]">
            ${subtotal.toLocaleString('es-AR')}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setView('form')}
        className="w-full py-4 bg-[#E91E63] hover:bg-[#D81B60] text-white rounded-2xl font-black text-sm shadow-lg active:scale-95 transition-transform cursor-pointer flex items-center justify-center gap-2 tracking-wide"
      >
        <span>Continuar con los Datos del Pedido</span>
        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
      </button>
    </main>
  );
}