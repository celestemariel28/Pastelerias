import React from 'react';
import { ShieldAlert } from 'lucide-react';
import Login from './Login';
import AdminLayout from './AdminLayout';

export default function AdminGuard({ authState, setView }) {
  const { user, isStoreAdmin, checkingAuth, signOut } = authState;

  if (checkingAuth) {
    return (
      <div className="min-h-[300px] flex flex-col items-center justify-center p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
        <p className="text-gray-500 text-sm">Verificando permisos...</p>
      </div>
    );
  }

  if (!user) {
    return <Login setView={setView} />;
  }

  if (!isStoreAdmin) {
    return (
      <div className="p-6 text-center flex flex-col items-center justify-center my-auto">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-black text-gray-900 mb-2">Acceso No Autorizado</h3>
        <p className="text-xs text-gray-500 mb-6 max-w-xs">
          Tu cuenta está autenticada, pero no tiene permisos en esta tienda.
        </p>
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <button
            onClick={async () => {
              await signOut();
              setView('categories');
            }}
            className="w-full py-2.5 px-4 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary-dark transition shadow-sm"
          >
            Cerrar sesión / Cambiar cuenta
          </button>
          <button
            onClick={() => setView('categories')}
            className="w-full py-2 px-4 bg-gray-100 text-gray-600 font-bold rounded-xl text-xs hover:bg-gray-200 transition"
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  return <AdminLayout setView={setView} />;
}