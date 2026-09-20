import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function useCategoryForm({ onRefreshProducts, onCategoryChanged, storeId }) {
  const activeStoreId = storeId || import.meta.env.VITE_STORE_ID;

  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  const fetchCategories = async () => {
    if (!activeStoreId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('store_id', activeStoreId)
        .order('name', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error cargando categorías:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeStoreId) {
      fetchCategories();
    }
  }, [activeStoreId]);

  const handleStartEdit = (category) => {
    setCategoryToEdit(category);
    setNewCategoryName(category.name);
    setNewCategoryImage(category.image_url || '');
  };

  const handleCancelEdit = () => {
    setCategoryToEdit(null);
    setNewCategoryName('');
    setNewCategoryImage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    if (!activeStoreId) {
      alert('Error: no se detectó el identificador de la tienda (VITE_STORE_ID).');
      return;
    }

    try {
      setLoading(true);
      const imagenFinal = newCategoryImage.trim() || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500';
      
      const categoryData = { 
        name: newCategoryName.trim().toUpperCase(), 
        image_url: imagenFinal,
        store_id: activeStoreId // 👈 Asigna la categoría a la pastelería activa
      };

      if (categoryToEdit) {
        let updateQuery = supabase
          .from('categories')
          .update(categoryData)
          .eq('id', categoryToEdit.id);

        if (activeStoreId) {
          updateQuery = updateQuery.eq('store_id', activeStoreId);
        }

        const { error } = await updateQuery;
        if (error) throw error;
        alert('¡Categoría actualizada con éxito!');
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([categoryData]);

        if (error) throw error;
        alert('¡Categoría agregada con éxito!');
      }

      handleCancelEdit();
      await fetchCategories();

      if (onCategoryChanged) onCategoryChanged();
      if (onRefreshProducts) onRefreshProducts();
    } catch (error) {
      alert(`Error al guardar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`¿Estás segura de eliminar la categoría "${name}"?`)) return;

    try {
      let deleteQuery = supabase.from('categories').delete().eq('id', id);

      if (activeStoreId) {
        deleteQuery = deleteQuery.eq('store_id', activeStoreId);
      }

      const { error } = await deleteQuery;
      if (error) throw error;

      alert('Categoría eliminada correctamente.');
      if (categoryToEdit?.id === id) handleCancelEdit();
      await fetchCategories();

      if (onCategoryChanged) onCategoryChanged();
      if (onRefreshProducts) onRefreshProducts();
    } catch (error) {
      alert(`No se pudo eliminar: ${error.message}`);
    }
  };

  return {
    categories,
    formData: { newCategoryName, newCategoryImage, categoryToEdit },
    setters: { setNewCategoryName, setNewCategoryImage },
    loading,
    actions: { handleStartEdit, handleCancelEdit, handleSubmit, handleDeleteCategory }
  };
}