import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Trash2, Loader2, Plus } from 'lucide-react';
import ImageUploader from '../common/ImageUploader'; 

export default function InfoSlidesAdmin() {
  const storeId = import.meta.env.VITE_STORE_ID;

  const [slides, setSlides] = useState([]);
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSlides = async () => {
    if (!storeId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('info_slides')
      .select('*')
      .eq('store_id', storeId)
      .order('order_index', { ascending: true });

    if (!error) setSlides(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSlides();
  }, [storeId]);

  const handleAddSlide = async (e) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      alert("Por favor selecciona o sube una imagen primero.");
      return;
    }

    if (!storeId) {
      alert("Error: no se detectó el identificador de la tienda (VITE_STORE_ID).");
      return;
    }

    setSaving(true);
    const newSlide = { 
      title: title.trim() || 'Información', 
      image_url: imageUrl.trim(), 
      order_index: slides.length,
      store_id: storeId // 👈 Asigna el slide a la tienda activa
    };

    const { data, error } = await supabase
      .from('info_slides')
      .insert([newSlide])
      .select();

    setSaving(false);

    if (!error && data) {
      setSlides((prev) => [...prev, ...data]);
      setTitle('');
      setImageUrl('');
    } else {
      alert("Error al agregar slide: " + (error?.message || 'Error desconocido'));
    }
  };

  const handleDeleteSlide = async (id, fileUrl) => {
    if (!window.confirm("¿Deseas eliminar esta imagen informativa?")) return;

    if (fileUrl) {
      try {
        const parts = fileUrl.split('/products/');
        if (parts.length > 1) {
          const storagePath = decodeURIComponent(parts[1]);
          await supabase.storage.from('products').remove([storagePath]);
        }
      } catch (err) {
        console.warn("No se pudo eliminar el archivo del storage:", err);
      }
    }

    let query = supabase.from('info_slides').delete().eq('id', id);

    if (storeId) {
      query = query.eq('store_id', storeId);
    }

    const { error } = await query;
    if (!error) {
      setSlides((prev) => prev.filter((s) => s.id !== id));
    } else {
      alert("Error al eliminar slide: " + error.message);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 bg-white rounded-2xl shadow-sm border border-primary-clear-b flex flex-col h-full min-w-0">
      <h3 className="text-base sm:text-lg font-black text-primary-dark mb-4 truncate">
        Información Importante (Carrusel)
      </h3>

      <form onSubmit={handleAddSlide} className="flex flex-col gap-3 mb-5 w-full min-w-0">
        <input
          type="text"
          placeholder="Título descriptivo (ej: Horarios y demoras)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-primary-clear border border-primary-clear-b rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <ImageUploader
          label="Foto Informativa / Banner"
          folder="info"
          value={imageUrl}
          onChange={(url) => setImageUrl(url)}
        />

        <button
          type="submit"
          disabled={saving || !imageUrl.trim()}
          className="w-full bg-primary hover:bg-primary-dark text-white py-2.5 rounded-xl text-xs sm:text-sm font-bold active:scale-95 transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Agregar al Carrusel</span>
            </>
          )}
        </button>
      </form>

      <div className="flex-1 overflow-y-auto pr-1 min-w-0">
        {loading ? (
          <div className="flex items-center justify-center py-6 text-gray-400 gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span className="text-xs">Cargando imágenes...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {slides.map((s, idx) => (
              <div 
                key={s.id} 
                className="border border-primary-clear-b rounded-2xl overflow-hidden shadow-2xs bg-gray-50 flex flex-col justify-between min-w-0"
              >
                <div className="w-full h-36 bg-white flex items-center justify-center overflow-hidden">
                  <img 
                    src={s.image_url} 
                    alt={s.title} 
                    className="w-full h-full object-contain" 
                  />
                </div>

                <div className="p-2.5 bg-white flex justify-between items-center border-t border-gray-100 gap-2">
                  <span className="text-xs font-bold text-gray-700 truncate min-w-0 flex-1" title={s.title}>
                    {idx + 1}. {s.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteSlide(s.id, s.image_url)}
                    className="w-7 h-7 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 rounded-lg active:scale-90 transition-transform cursor-pointer shrink-0"
                    title="Eliminar foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {slides.length === 0 && (
              <p className="text-xs text-gray-400 col-span-full text-center py-6">
                No hay imágenes en el carrusel todavía.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}