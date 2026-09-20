import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App'; 
import AdminLayout from './components/admin/AdminLayout'; 
import { supabase } from './supabaseClient';
import './index.css'; 

function Root() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadStoreData() {
      const storeId = import.meta.env.VITE_STORE_ID;

      if (!storeId) {
        setError('No se encontró la variable VITE_STORE_ID en el archivo .env');
        setLoading(false);
        return;
      }

      try {
        const { data, error: dbError } = await supabase
          .from('stores')
          .select('*')
          .eq('id', storeId)
          .maybeSingle();

        if (dbError) throw dbError;

        if (!data) {
          const notFoundMsg = `No se encontró ninguna tienda con el ID: "${storeId}". Revisa tu tabla stores y tu .env.`;
          console.warn(notFoundMsg);
          setError(notFoundMsg);
          return;
        }

        const store = data;

        // 1. Inyectar título de la pestaña dinámico
        document.title = store.slogan 
          ? `${store.name} | ${store.slogan}`
          : store.name || 'Pastelería';

        // 2. Inyectar favicon dinámico
        if (store.logo_url) {
          let favicon = document.querySelector("link[rel~='icon']");
          if (!favicon) {
            favicon = document.createElement('link');
            favicon.rel = 'icon';
            document.head.appendChild(favicon);
          }
          favicon.href = store.logo_url;
        }

        // 3. Inyectar paleta de colores CSS según tu @theme
        const root = document.documentElement;
        if (store.color_primary) root.style.setProperty('--color-primary', store.color_primary);
        if (store.color_primary_light) root.style.setProperty('--color-primary-light', store.color_primary_light);
        if (store.color_primary_dark) root.style.setProperty('--color-primary-dark', store.color_primary_dark);
        if (store.color_primary_clear) root.style.setProperty('--color-primary-clear', store.color_primary_clear);
        if (store.color_primary_clear_bg) root.style.setProperty('--color-primary-clear-bg', store.color_primary_clear_bg);
        if (store.color_primary_clear_b) root.style.setProperty('--color-primary-clear-b', store.color_primary_clear_b);
        if (store.color_primary_categoria_bg) root.style.setProperty('--color-primary-categoria-bg', store.color_primary_categoria_bg);

      } catch (err) {
        console.error('Error al inicializar la pastelería:', err);
        setError(err.message || 'Error desconocido al cargar los datos');
      } finally {
        setLoading(false);
      }
    }

    loadStoreData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-medium animate-pulse">Cargando pastelería...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
        <p className="text-red-600 font-medium text-center max-w-md">
          {error}
        </p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route 
          path="/admin" 
          element={
            <div className="min-h-screen bg-primary-clear-bg flex items-center justify-center font-sans antialiased p-4">
              <div className="w-full max-w-xl flex flex-col overflow-hidden">
                <AdminLayout />
              </div>
            </div>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);