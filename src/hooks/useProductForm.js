import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function useProductForm(productToEdit, isOpen, onClose, onSaveSuccess) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('1');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productToEdit && isOpen) {
      setName('');
      setDescription('');
      setCategoryId('1');
      setImageUrl('');
    }
  }, [productToEdit, isOpen]);

  const guardarProducto = async (e, listaVariantes = []) => {
    if (e) e.preventDefault();
    setLoading(true);

    const precioBase = listaVariantes.length > 0 ? (parseFloat(listaVariantes[0].price) || 0) : 0;
    const stockTotal = listaVariantes.reduce((sum, v) => sum + (parseInt(v.stock) || 0), 0);

    const productData = {
      // 🔠 Convertir a mayúsculas automáticamente
      name: name.trim().toUpperCase(),
      description,
      price: precioBase,
      stock: stockTotal,
      category_id: parseInt(categoryId),
      image_url: imageUrl || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500',
      is_available: stockTotal > 0,
      variante: listaVariantes
    };

    try {
      if (productToEdit) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', productToEdit.id);

        if (error) throw error;
        alert('¡Producto actualizado con éxito!');
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
        alert('¡Nuevo dulce agregado al catálogo!');
      }

      onSaveSuccess();
      onClose();
    } catch (error) {
      console.error('Error al guardar en Supabase:', error.message);
      alert(`Error al guardar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData: { name, description, categoryId, imageUrl },
    setters: { setName, setDescription, setCategoryId, setImageUrl },
    loading,
    guardarProducto
  };
}