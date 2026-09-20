import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const storeId = import.meta.env.VITE_STORE_ID;

  useEffect(() => {
    async function fetchStore() {
      if (!storeId) {
        setError('No se definió VITE_STORE_ID en el archivo .env');
        setLoading(false);
        return;
      }

      try {
        const { data, error: sbError } = await supabase
          .from('stores')
          .select('*')
          .eq('id', storeId)
          .single();

        if (sbError || !data) throw sbError || new Error('Tienda no encontrada');

        setStore(data);

        // 1. Inyectar título de la pestaña
        document.title = data.slogan ? `${data.name} | ${data.slogan}` : data.name;

        // 2. Inyectar favicon si existe
        if (data.logo_url) {
          let favicon = document.querySelector("link[rel~='icon']");
          if (!favicon) {
            favicon = document.createElement('link');
            favicon.rel = 'icon';
            document.head.appendChild(favicon);
          }
          favicon.href = data.logo_url;
        }

        // 3. Inyectar variables de color CSS dinámicamente
        const root = document.documentElement;
        if (data.color_primary) root.style.setProperty('--color-primary', data.color_primary);
        if (data.color_primary_light) root.style.setProperty('--color-primary-light', data.color_primary_light);
        if (data.color_primary_dark) root.style.setProperty('--color-primary-dark', data.color_primary_dark);
        if (data.color_primary_clear) root.style.setProperty('--color-primary-clear', data.color_primary_clear);
        if (data.color_primary_clear_bg) root.style.setProperty('--color-primary-clear-bg', data.color_primary_clear_bg);
        if (data.color_primary_clear_b) root.style.setProperty('--color-primary-clear-b', data.color_primary_clear_b);
        if (data.color_primary_categoria_bg) root.style.setProperty('--color-primary-categoria-bg', data.color_primary_categoria_bg);

      } catch (err) {
        console.error('Error cargando configuración de la tienda:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStore();
  }, [storeId]);

  return (
    <StoreContext.Provider value={{ store, loading, error, storeId }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore debe usarse dentro de un StoreProvider');
  return context;
}