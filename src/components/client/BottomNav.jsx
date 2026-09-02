import React, { useState, useEffect } from 'react';
import { Home, Grid, ShoppingBag, Info } from 'lucide-react';

export default function BottomNav({ 
  view, 
  setView, 
  cart = {}, 
  onOpenInfoModal, 
  isInfoModalOpen = false 
}) {
  const [activeTab, setActiveTab] = useState(view || 'categories');

  useEffect(() => {
    if (isInfoModalOpen) {
      setActiveTab('info');
    } else {
      if (view === 'cart') {
        setActiveTab('cart');
      } else if (view === 'products' || view === 'custom-cake') {
        // En "custom-cake" o "products" se resalta "Catálogo"
        setActiveTab('products');
      } else if (view === 'categories' && activeTab === 'info') {
        setActiveTab('categories');
      } else if (view === 'categories') {
        setActiveTab('categories');
      }
    }
  }, [view, isInfoModalOpen]);

  const totalItemsCount = Object.values(cart).reduce(
    (sum, item) => sum + (parseInt(item?.quantity, 10) || 0),
    0
  );

  const scrollToCategories = () => {
    setActiveTab('products');
    setView('categories');
    setTimeout(() => {
      const section = document.getElementById('seccion-categorias');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  };

  const handleNavClick = (id) => {
    if (id === 'info') {
      setActiveTab('info');
      if (onOpenInfoModal) onOpenInfoModal();
      return;
    }

    if (id === 'products') {
      scrollToCategories();
      return;
    }

    if (id === 'categories') {
      setActiveTab('categories');
      setView('categories');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setActiveTab(id);
    setView(id);
  };

  const navItems = [
    { id: 'categories', label: 'Inicio', icon: Home },
    { id: 'products', label: 'Catálogo', icon: Grid },
    { id: 'cart', label: 'Carrito', icon: ShoppingBag, badge: totalItemsCount },
    { id: 'info', label: 'Info Útil', icon: Info },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-white/95 backdrop-blur-md border-t border-pink-100 shadow-[0_-4px_20px_rgba(233,30,99,0.08)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="w-full px-4 pt-2 pb-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          const isActive = item.id === 'info' 
            ? isInfoModalOpen || activeTab === 'info' 
            : (!isInfoModalOpen && activeTab === item.id);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? '!text-[#E91E63] font-black scale-105'
                  : 'text-gray-400 hover:text-gray-600 font-bold'
              }`}
            >
              <div className="relative">
                <Icon 
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isActive 
                      ? '!text-[#E91E63] stroke-[2.5]' 
                      : 'text-gray-400 stroke-2'
                  }`} 
                  color={isActive ? '#E91E63' : 'currentColor'}
                />

                {Boolean(item.badge && item.badge > 0) && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#E91E63] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm animate-scaleIn">
                    {item.badge > 99 ? '+99' : item.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? '!text-[#E91E63] font-black' : 'text-gray-500 font-medium'}`}>
                {item.label}
              </span>

              {isActive && (
                <span className="w-1.5 h-1.5 bg-[#E91E63] rounded-full mt-0.5 animate-fadeIn" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}