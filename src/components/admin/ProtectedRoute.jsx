import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

export default function ProtectedRoute() {
  const storeId = import.meta.env.VITE_STORE_ID;
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function checkAccess() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          setAuthorized(false);
          setLoading(false);
          return;
        }

        // Consultamos la tabla store_users para validar permisos sobre esta tienda
        const { data: storeUserData, error: roleError } = await supabase
          .from('store_users')
          .select('role')
          .eq('user_id', user.id)
          .eq('store_id', storeId)
          .maybeSingle();

        if (roleError) {
          console.error('Error al verificar permisos:', roleError);
          setErrorMsg('Error al consultar permisos de la tienda.');
          setAuthorized(false);
        } else if (storeUserData) {
          // El usuario pertenece a esta tienda y tiene un rol asignado ('admin', etc.)
          setAuthorized(true);
        } else {
          // Está autenticado pero pertenece a otra tienda o no fue asignado
          setErrorMsg('No tienes permisos de administración en esta pastelería.');
          setAuthorized(false);
        }
      } catch (err) {
        console.error('Error inesperado de autorización:', err);
        setErrorMsg('Ocurrió un error inesperado al comprobar permisos.');
      } finally {
        setLoading(false);
      }
    }

    checkAccess();
  }, [storeId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verificando accesos...</p>
        </div>
      </div>
    );
  }

  // Si no está logueado, redirige al login
  if (!authorized && !errorMsg) {
    return <Navigate to="/admin/login" replace />;
  }

  // Si está autenticado pero no pertenece a esta tienda
  if (!authorized && errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-sm text-center">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
            ✕
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Acceso no autorizado</h2>
          <p className="text-sm text-gray-600 mb-6">{errorMsg}</p>
          <button
            onClick={() => supabase.auth.signOut().then(() => window.location.href = '/admin/login')}
            className="w-full py-2.5 px-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition"
          >
            Cerrar sesión / Cambiar de cuenta
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}