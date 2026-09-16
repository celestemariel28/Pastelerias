import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App'; 
import AdminLayout from './components/admin/AdminLayout'; 
import './index.css'; 
import { STORE_CONFIG } from './config/store';

// 2. Inyectar título de la pestaña dinámico
if (STORE_CONFIG?.name) {
  document.title = STORE_CONFIG.slogan 
    ? `${STORE_CONFIG.name} | ${STORE_CONFIG.slogan}`
    : STORE_CONFIG.name;
}

// 3. Inyectar favicon dinámico
if (STORE_CONFIG?.logo) {
  let favicon = document.querySelector("link[rel~='icon']");
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    document.head.appendChild(favicon);
  }
  favicon.href = STORE_CONFIG.logo;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route 
          path="/admin" 
          element={
            <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center font-sans antialiased p-4">
              <div className="w-full max-w-xl flex flex-col overflow-hidden">
                <AdminLayout />
              </div>
            </div>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);