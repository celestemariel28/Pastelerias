import React, { useState, useEffect } from 'react';
import { useProductForm } from '../../hooks/useProductForm';
import { FileEdit, Sparkles, Loader2 } from 'lucide-react';
import VariantsEditor from './VariantsEditor';
import ImageUploader from '../common/ImageUploader';

const createDefaultVariant = () => ({
  id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
  label: '',
  price: '',
  stock: ''
});

export default function ProductFormModal({
  isOpen,
  onClose,
  productToEdit,
  onSaveSuccess,
  categories = []
}) {
  const { formData, setters, loading, guardarProducto } = useProductForm(
    productToEdit,
    isOpen,
    onClose,
    onSaveSuccess
  );

  const [variants, setVariants] = useState([createDefaultVariant()]);

  useEffect(() => {
    if (!isOpen) return;

    if (productToEdit) {
      setters.setName(productToEdit.name || '');
      setters.setDescription(productToEdit.description || '');
      setters.setCategoryId(String(productToEdit.category_id || productToEdit.categoryId || categories[0]?.id || ''));
      setters.setImageUrl(productToEdit.image_url || productToEdit.image || '');

      let variantesRaw = productToEdit.variante || productToEdit.variants;
      if (typeof variantesRaw === 'string') {
        try {
          variantesRaw = JSON.parse(variantesRaw);
        } catch {
          variantesRaw = [];
        }
      }

      if (Array.isArray(variantesRaw) && variantesRaw.length > 0) {
        setVariants(
          variantesRaw.map((v, idx) => ({
            id: v.id || `${Date.now()}-${idx}`,
            label: v.label || '',
            price: v.price !== undefined ? v.price : '',
            stock: v.stock !== undefined ? v.stock : ''
          }))
        );
      } else {
        setVariants([createDefaultVariant()]);
      }
    } else {
      setters.setName('');
      setters.setDescription('');
      setters.setCategoryId(categories[0]?.id ? String(categories[0].id) : '');
      setters.setImageUrl('');
      setVariants([createDefaultVariant()]);
    }
  }, [isOpen, productToEdit, categories]);

  const handleAddVariant = () => {
    setVariants((prev) => [...prev, createDefaultVariant()]);
  };

  const handleRemoveVariant = (id) => {
    if (variants.length > 1) {
      setVariants((prev) => prev.filter((v) => v.id !== id));
    }
  };

  const handleVariantChange = (id, field, value) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const v of variants) {
      const priceNum = parseFloat(v.price);
      const stockNum = parseInt(v.stock, 10);

      if (!v.label.trim() || isNaN(priceNum) || priceNum < 0 || isNaN(stockNum) || stockNum < 0) {
        alert('Por favor revisá las variantes: completá porción, precio (>= 0) y stock (>= 0).');
        return;
      }
    }

    const finalVariants = variants.map((v) => ({
      id: v.id,
      label: v.label.trim(),
      price: parseFloat(v.price) || 0,
      stock: parseInt(v.stock, 10) || 0
    }));

    await guardarProducto(e, finalVariants);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-fadeIn">
      <div className="bg-white w-full max-w-sm rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh] min-w-0">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
          <h3 className="text-base sm:text-lg font-black text-[#E91E63] flex items-center gap-2 truncate">
            {productToEdit ? (
              <>
                <FileEdit className="w-5 h-5 text-amber-500 shrink-0" />
                <span>Editar Dulce</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-pink-500 shrink-0" />
                <span>Nuevo Dulce</span>
              </>
            )}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto pr-1 space-y-3 min-w-0">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Nombre del dulce *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setters.setName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-xs sm:text-sm focus:outline-none focus:border-[#E91E63]"
                placeholder="Ej: Tarta Toffee"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Categoría *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setters.setCategoryId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-xs sm:text-sm focus:outline-none focus:border-[#E91E63]"
                required
              >
                <option value="">Seleccionar categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <VariantsEditor
              variants={variants}
              onAddVariant={handleAddVariant}
              onRemoveVariant={handleRemoveVariant}
              onVariantChange={handleVariantChange}
            />

            <ImageUploader
              label="Foto del Producto"
              folder="productos"
              value={formData.imageUrl}
              onChange={(url) => setters.setImageUrl(url)}
            />

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Descripción (opcional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setters.setDescription(e.target.value)}
                rows="2"
                className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-xs focus:outline-none focus:border-[#E91E63] resize-none"
                placeholder="Ingredientes, recomendaciones de consumo..."
              />
            </div>
          </div>

          <div className="flex gap-2.5 pt-3 mt-2 border-t border-gray-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold active:scale-95 transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-[#E91E63] hover:bg-[#d81b60] text-white rounded-xl text-xs font-bold active:scale-95 transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{loading ? 'Guardando...' : 'Guardar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}