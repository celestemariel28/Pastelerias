import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App'; 
import AdminLayout from './components/admin/AdminLayout'; 
import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route 
          path="/admin" 
          element={
            <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center font-sans antialiased p-4">
              <div className="w-full max-w-md flex flex-col overflow-hidden">
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