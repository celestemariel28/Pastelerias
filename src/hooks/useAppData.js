import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function useAppData(searchQuery, selectedCategoryId) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const storeId = import.meta.env.VITE_STORE_ID;

  useEffect(() => {
    async function cargarDatosReales() {
      if (!storeId) {
        console.error("Falta VITE_STORE_ID en las variables de entorno");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // 1. Traer categorías filtradas por tienda
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('*')
          .eq('store_id', storeId)
          .order('name', { ascending: true });

        if (catError) throw catError;
        
        // 2. Traer productos filtrados por tienda
        const { data: prodData, error: prodError } = await supabase
          .from('products')
          .select('*')
          .eq('store_id', storeId);

        if (prodError) throw prodError;
        
        // Mapear datos de forma segura
        const categoriasAdaptadas = (catData || []).map(c => ({
          id: c.id,
          name: c.name,
          image: c.image_url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500'
        }));

        const productosAdaptados = (prodData || []).map(p => {
          const varianteLista = p.variante || [];
          
          const stockTotal = Array.isArray(varianteLista) && varianteLista.length > 0
            ? varianteLista.reduce((sum, v) => sum + (parseInt(v.stock, 10) || 0), 0)
            : (parseInt(p.stock, 10) || 0);

          const precioInicial = Array.isArray(varianteLista) && varianteLista.length > 0
            ? (parseFloat(varianteLista[0].price) || 0)
            : (parseFloat(p.price) || 0);

          return {
            id: p.id,
            categoryId: p.category_id,
            name: p.name,
            description: p.description || '',
            price: precioInicial,
            stock: stockTotal,
            image: p.image_url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500',
            variante: varianteLista
          };
        });

        setCategories(categoriasAdaptadas);
        setProducts(productosAdaptados);
      } catch (error) {
        console.error("Error conectando a Supabase:", error.message);
        setCategories([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    cargarDatosReales();
  }, [storeId]);

  // Filtros con protección
  const filteredCategories = (categories || []).filter(cat => 
    cat.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = (products || []).filter(product => 
    product.categoryId === selectedCategoryId &&
    product.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    products,
    loading,
    filteredCategories,
    filteredProducts
  };
}