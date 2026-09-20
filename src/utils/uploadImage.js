import { supabase } from '../supabaseClient';

export const uploadProductImage = async (file, folder = 'general') => {
  if (!file) return null;

  const storeId = import.meta.env.VITE_STORE_ID;
  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

  // Si la ruta no empieza con el storeId, lo anteponemos como carpeta raíz
  let cleanFolder = folder.replace(/^\/+|\/+$/g, '');
  if (storeId && !cleanFolder.startsWith(storeId)) {
    cleanFolder = `${storeId}/${cleanFolder}`;
  }

  const filePath = `${cleanFolder}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('products')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    console.error('Error al subir imagen a Supabase Storage:', uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('products')
    .getPublicUrl(filePath);

  return data.publicUrl;
};