import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function useCategoryForm({ onRefreshProducts, onCategoryChanged }) {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
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
    fetchCategories();
  }, []);

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

    try {
      setLoading(true);
      const imagenFinal = newCategoryImage.trim() || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500';
      
      // 🔠 Convertir a mayúsculas automáticamente
      const categoryData = { 
        name: newCategoryName.trim().toUpperCase(), 
        image_url: imagenFinal 
      };

      if (categoryToEdit) {
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', categoryToEdit.id);

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
      const { error } = await supabase.from('categories').delete().eq('id', id);
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