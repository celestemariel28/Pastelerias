import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useAppData } from './hooks/useAppData'; 
import Header from './components/client/Header';
import CategoriesView from './components/client/CategoriesView';
import ProductsView from './components/client/ProductsView';
import FormView from './components/client/FormView';
import Login from './components/admin/Login'; 
import AdminLayout from './components/admin/AdminLayout';
import CustomCakeView from './components/client/CustomCakeView';
import CartView from './components/client/CartView';
import BottomNav from './components/client/BottomNav';
import CustomCakeInfoCard from './components/client/CustomCakeInfoCard'; 
import { CakeSlice } from 'lucide-react';

function App() {
  // 1. TODOS LOS STATES PRIMERO ARRIBA
  const [view, setView] = useState('categories');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState({});
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false); // 👈 Estado para abrir/cerrar el modal de info
  const [discountSettings, setDiscountSettings] = useState({
    isActive: false,
    percent: 0,
    paymentMethod: 'Efectivo',
    bannerText: ''
  });

  const { products = [], loading, filteredCategories = [], filteredProducts = [] } = useAppData(searchQuery, selectedCategoryId);

  // 2. TODOS LOS USEEFFECT
  useEffect(() => {
    async function loadDiscount() {
      try {
        const { data } = await supabase.from('store_settings').select('*').eq('id', 1).single();
        if (data && data.is_active) {
          setDiscountSettings({
            isActive: true,
            percent: parseFloat(data.discount_percent) || 0,
            paymentMethod: data.target_payment_method || 'Efectivo',
            bannerText: data.banner_text || ''
          });
        }
      } catch (err) {
        console.error('Error cargando configuración:', err);
      }
    }
    loadDiscount();
  }, []);

  // 3. FUNCIONES AUXILIARES
  const calculateSubtotal = () => {
    return Object.values(cart).reduce((total, item) => {
      const qty = parseInt(item?.quantity, 10) || 0;
      const price = parseFloat(item?.price) || 0;
      return total + (qty * price);
    }, 0);
  };

  const handleUpdateProductVariantsInCart = (productId, selectedVariants) => {
    setCart((prevCart) => {
      const nextCart = { ...prevCart };

      Object.keys(nextCart).forEach((key) => {
        if (String(nextCart[key].productId) === String(productId)) {
          delete nextCart[key];
        }
      });

      selectedVariants.forEach((variant) => {
        const qty = parseInt(variant.quantity, 10) || 0;
        if (qty > 0) {
          const varId = String(variant.variantId || variant.id || 'default');
          const itemKey = `${productId}_${varId}`;
          
          nextCart[itemKey] = {
            ...variant,
            productId: String(productId),
            variantId: varId,
            quantity: qty,
            price: parseFloat(variant.price) || 0
          };
        }
      });

      return { ...nextCart };
    });
  };

  const handleRemoveItemFromCart = (cartKey) => {
    setCart((prevCart) => {
      const nextCart = { ...prevCart };
      delete nextCart[cartKey];
      return nextCart;
    });
  };

  const isCartEmpty = Object.keys(cart).length === 0;

  // 4. RETORNO CONDICIONAL (después de todos los hooks)
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFE9EF] flex flex-col items-center justify-center gap-3">
        <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center shadow-md animate-bounce">
          <CakeSlice className="w-8 h-8 text-[#E91E63]" />
        </div>
        <p className="text-[#E91E63] font-black text-2xl tracking-wide animate-pulse">
          Cargando dulces...
        </p>
      </div>
    );
  }

  // 5. RETORNO PRINCIPAL
  return (
    <div className="min-h-screen bg-rose-50 flex flex-col font-sans selection:bg-[#E91E63] selection:text-white">
      <div className="w-full max-w-md mx-auto bg-white min-h-screen flex flex-col shadow-2xl relative ">
        
        {/* Header */}
        {view !== 'admin' && (
          <Header 
            view={view} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            setView={setView} 
            cart={cart}
            isInfoModalOpen={isInfoModalOpen}
          />
        )}

        {/* Vistas Principales */}
        {view === 'categories' && (
          <CategoriesView 
            filteredCategories={filteredCategories}
            setSelectedCategoryId={setSelectedCategoryId}
            setSelectedCategoryName={setSelectedCategoryName}
            setView={setView}
            setSearchQuery={setSearchQuery}
            discountSettings={discountSettings}
          />
        )}

        {view === 'custom-cake' && (
          <CustomCakeView 
            setView={setView}
            onUpdateProductVariants={handleUpdateProductVariantsInCart}
          />
        )}

        {view === 'products' && (
          <ProductsView
            filteredProducts={filteredProducts}
            selectedCategoryName={selectedCategoryName}
            setView={setView}
            setSearchQuery={setSearchQuery}
            cart={cart}
            onUpdateProductVariants={handleUpdateProductVariantsInCart}
            calculateSubtotal={calculateSubtotal}
            onRemoveItemFromCart={handleRemoveItemFromCart} 
            isCartEmpty={isCartEmpty}
            discountSettings={discountSettings}
          />
        )}

        {view === 'cart' && (
          <CartView 
            setView={setView}
            cart={cart}
            calculateSubtotal={calculateSubtotal}
            onRemoveItemFromCart={handleRemoveItemFromCart}
            discountSettings={discountSettings}
          />
        )}

        {view === 'form' && (
          <FormView
            setView={setView}
            cart={cart}
            clearCart={() => setCart({})} 
            calculateSubtotal={calculateSubtotal}
            onRemoveItemFromCart={handleRemoveItemFromCart} 
            PRODUCTS_MOCK={products}
            discountSettings={discountSettings}
          />
        )}

        {view === 'admin' && (
          <AdminLayout setView={setView} />
        )}

        {/* Modal de Información Útil */}
        {isInfoModalOpen && (
          <CustomCakeInfoCard 
            isOpen={isInfoModalOpen} 
            onClose={() => {
              setIsInfoModalOpen(false);
              setView('categories');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
          />
        )}

        {/* Barra de Navegación Inferior (Footer) */}
        {view !== 'admin' && (
          <BottomNav 
            view={view} 
            setView={setView} 
            cart={cart} 
            onOpenInfoModal={() => setIsInfoModalOpen(true)}
          />
        )}

      </div>
    </div>
  );
}

export default App;