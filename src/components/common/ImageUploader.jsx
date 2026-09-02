import React, { useState } from 'react';
import { Upload, Loader2, Image as ImageIcon, Trash2 } from 'lucide-react';
import { uploadProductImage } from '../../utils/uploadImage';

export default function ImageUploader({ 
  value = '', 
  onChange, 
  folder = 'general', 
  label = 'Foto' 
}) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      // Sube a Supabase y pasa la subcarpeta correspondiente
      const publicUrl = await uploadProductImage(file, folder);
      onChange(publicUrl); // Actualiza el estado en el componente padre
    } catch (err) {
    console.error('Error detallado de Supabase:', err);
    alert(`Error al subir la imagen: ${err.message || 'Error desconocido'}`);
    } finally {
    setUploading(false);
    }
    };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className="space-y-2 flex flex-col w-full">
      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
        {label}
      </label>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 my-4">
        {/* Vista previa cuadrada */}
        <div className="w-24 h-24 rounded-2xl bg-pink-50/60 border-2 border-dashed border-pink-200 flex items-center justify-center overflow-hidden relative shrink-0">
          {value ? (
            <img 
              src={value} 
              alt="Vista previa" 
              className="w-full h-full object-cover" 
            />
          ) : (
            <ImageIcon className="w-7 h-7 text-pink-300" />
          )}

          {uploading && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex flex-col items-center sm:items-start gap-2">
          <label className="cursor-pointer bg-[#E91E63] hover:bg-[#D81B60] text-white px-3.5 py-2 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-2">
            <Upload className="w-4 h-4 shrink-0" />
            <span>{uploading ? 'Subiendo...' : 'Seleccionar foto'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>

          {value && !uploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="text-xs font-semibold text-gray-400 hover:text-red-500 flex items-center justify-center gap-1 transition-colors px-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Quitar imagen</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}