import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import CartSummaryCard from './CartSummaryCard';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import ViewHeader from '../common/ViewHeader';

export default function ProductsView({
  filteredProducts = [],
  selectedCategoryName,
  setView,
  setSearchQuery,
  cart = {},
  onUpdateProductVariants,
  calculateSubtotal,
  onRemoveItemFromCart,
  isCartEmpty
}) {
  const [activeProduct, setActiveProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableFillings, setAvailableFillings] = useState([]);

  useEffect(() => {
    async function loadFillings() {
      const { data } = await supabase
        .from('fillings')
        .select('*')
        .eq('available', true)
        .order('name', { ascending: true });

      if (data && data.length > 0) {
        setAvailableFillings(data);
      }
    }
    loadFillings();
  }, []);

  const getVariantQuantityInCart = (productId, variantId) => {
    const foundItem = Object.values(cart).find(
      (item) => String(item.productId) === String(productId) && String(item.variantId).startsWith(String(variantId))
    );
    if (foundItem) return parseInt(foundItem.quantity, 10) || 0;

    const keyUnder = `${productId}_${variantId}`;
    const keyDash = `${productId}-${variantId}`;
    return cart[keyUnder]?.quantity || cart[keyDash]?.quantity || 0;
  };

  const handleOpenProductModal = (product) => {
    setActiveProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveProduct(null);
  };

  const getProductTotalInCart = (productId) => {
    return Object.values(cart)
      .filter((item) => String(item.productId) === String(productId))
      .reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 0), 0);
  };

  return (
    <main className="flex-1 p-2 max-w-md mx-auto w-full pb-18 animate-fadeIn">
      {/* Botón Volver y Título */}
      <ViewHeader
        title={selectedCategoryName || 'Productos'}
        onBack={() => {
          setView('categories');
          if (setSearchQuery) setSearchQuery('');
        }}
        backTitle="Volver a Categorías"
      />

      {/* Lista de Productos */}
      <div className="flex flex-col gap-4">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            totalInCart={getProductTotalInCart(product.id)}
            onOpenModal={handleOpenProductModal}
          />
        ))}

        {filteredProducts.length === 0 && (
          <p className="text-gray-400 text-center py-6">No se encontraron productos en esta categoría.</p>
        )}
      </div>

      {/* Resumen del Carrito */}
      <CartSummaryCard
        cart={cart}
        calculateSubtotal={calculateSubtotal}
        onRemoveItemFromCart={onRemoveItemFromCart}
        setView={setView}
        mode="products"
      />

      {/* Modal Modularizado */}
      <ProductModal
        product={activeProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSaveToCart={onUpdateProductVariants}
        getVariantQuantityInCart={getVariantQuantityInCart}
        availableFillings={availableFillings}
      />
    </main>
  );
}