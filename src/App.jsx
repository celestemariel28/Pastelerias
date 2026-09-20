import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useAppData } from './hooks/useAppData'; 
import { useStoreAuth } from './hooks/useStoreAuth';
import Header from './components/client/Header';
import CategoriesView from './components/client/CategoriesView';
import ProductsView from './components/client/ProductsView';
import FormView from './components/client/FormView';
import AdminGuard from './components/admin/AdminGuard';
import CustomCakeView from './components/client/CustomCakeView';
import CartView from './components/client/CartView';
import BottomNav from './components/client/BottomNav';
import CustomCakeInfoCard from './components/client/CustomCakeInfoCard'; 
import { CakeSlice } from 'lucide-react';

export default function App() {
  const storeId = import.meta.env.VITE_STORE_ID;

  // Estados de vistas y filtros
  const [view, setView] = useState('categories');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState({});
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [discountSettings, setDiscountSettings] = useState({
    isActive: false,
    percent: 0,
    paymentMethod: 'Efectivo',
    bannerText: ''
  });

  // Hooks modulares
  const { products = [], loading, filteredCategories = [], filteredProducts = [] } = useAppData(searchQuery, selectedCategoryId);
  const authState = useStoreAuth(storeId);

  // Configuración de descuentos
  useEffect(() => {
    async function loadDiscount() {
      try {
        const { data } = await supabase
          .from('store_settings')
          .select('*')
          .eq('store_id', storeId)
          .maybeSingle();

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
    if (storeId) loadDiscount();
  }, [storeId]);

  // Manejadores del Carrito
  const calculateSubtotal = () =>
    Object.values(cart).reduce((acc, item) => acc + (parseInt(item?.quantity, 10) || 0) * (parseFloat(item?.price) || 0), 0);

  const handleUpdateProductVariantsInCart = (productId, selectedVariants) => {
    setCart((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        if (String(next[key].productId) === String(productId)) delete next[key];
      });
      selectedVariants.forEach((v) => {
        const qty = parseInt(v.quantity, 10) || 0;
        if (qty > 0) {
          const varId = String(v.variantId || v.id || 'default');
          next[`${productId}_${varId}`] = {
            ...v,
            productId: String(productId),
            variantId: varId,
            quantity: qty,
            price: parseFloat(v.price) || 0
          };
        }
      });
      return next;
    });
  };

  const handleRemoveItemFromCart = (cartKey) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[cartKey];
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-clear-bg flex flex-col items-center justify-center gap-3">
        <div className="w-16 h-16 rounded-full bg-primary-clear flex items-center justify-center shadow-md animate-bounce">
          <CakeSlice className="w-8 h-8 text-primary" />
        </div>
        <p className="text-primary font-black text-2xl tracking-wide animate-pulse">Cargando dulces...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-clear-bg flex flex-col font-sans selection:bg-primary selection:text-white">
      <div className="w-full max-w-md lg:max-w-xl mx-auto bg-white min-h-screen flex flex-col shadow-2xl relative">
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
          <CustomCakeView setView={setView} onUpdateProductVariants={handleUpdateProductVariantsInCart} />
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
            isCartEmpty={Object.keys(cart).length === 0}
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
          <AdminGuard authState={authState} setView={setView} />
        )}

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