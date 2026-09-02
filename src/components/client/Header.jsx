import React from 'react';
import { ShoppingBag } from 'lucide-react';

export default function Header({ view, searchQuery, setSearchQuery, setView, cart = {} }) {
  const handleGoHome = () => {
    setView('categories');
    setSearchQuery('');
  };

  const isFormView = view === 'form';
  const isCartView = view === 'cart';

  // Calcular cantidad total de productos en el carrito
  const totalItemsCount = Object.values(cart).reduce(
    (sum, item) => sum + (parseInt(item?.quantity, 10) || 0),
    0
  );

  return (
    <header className="px-4 py-3 bg-[#f8d6e0] flex items-center justify-between shadow-sm sticky top-0 z-50 gap-3">
      {/* Botón con el logo */}
      <button 
        onClick={handleGoHome} 
        className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center border-2 border-[#D81B60] overflow-hidden shadow-md shrink-0 active:scale-95 transition-transform cursor-pointer focus:outline-none" 
        title="Volver al inicio"
      >
        <img 
          src="/logo.png" 
          alt="Logo Candela Garbini" 
          className="w-full h-full object-cover object-center"
        />
      </button>
      
      {/* Barra de búsqueda */}
      <div className="flex-1 relative">
        <input 
          type="text" 
          placeholder={
            isFormView 
              ? "Finalizando pedido... " 
              : isCartView
              ? "Revisando carrito..."
              : view === 'categories' 
              ? "Buscar Categorías..." 
              : "Buscar dulces..."
          } 
          value={isFormView || isCartView ? "" : searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={isFormView || isCartView} 
          className={`w-full text-sm font-semibold rounded-full py-2.5 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-white shadow-md transition-all duration-200 ${
            isFormView || isCartView
              ? "bg-[#D81B60]/30 text-rose-100 cursor-not-allowed opacity-80" 
              : "bg-[#E91E63] text-white placeholder-rose-200" 
          }`}
        />
        
        {!isFormView && !isCartView && (
          <div className="absolute left-3 top-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-rose-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" />
            </svg>
          </div>
        )}
      </div>

      {/* Botón del Carrito */}
      <button
        type="button"
        onClick={() => setView('cart')}
        title="Ver mi pedido"
        className="relative w-11 h-11 bg-[#E91E63] text-white rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform cursor-pointer shrink-0 hover:bg-[#d81b60]"
      >
        <ShoppingBag className="w-5 h-5" />

        {/* Badge interactivo con el conteo de unidades */}
        {totalItemsCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-white text-[#E91E63] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#E91E63] shadow-sm animate-scaleIn">
            {totalItemsCount > 99 ? '+99' : totalItemsCount}
          </span>
        )}
      </button>
    </header>
  );
}