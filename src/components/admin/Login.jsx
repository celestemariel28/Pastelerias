import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Mail, Lock, Crown, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Login({ onLoginSuccess, setView }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;
      onLoginSuccess(data.user);
    } catch (error) {
      console.error('Error en la autenticación:', error.message);
      alert(`Error al ingresar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 flex flex-col justify-center bg-white m-4 rounded-3xl shadow-xl">
      <div className="text-center mb-6 flex flex-col items-center">
        <Crown className="w-10 h-10 text-[#E91E63] mb-1.5" />
        <h2 className="text-2xl font-black text-[#E91E63]">Panel de Control</h2>
        <p className="text-gray-500 text-xs mt-1">Ingresá tus credenciales</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-[#E91E63] uppercase tracking-wider mb-1">Email</label>
          <div className="relative flex items-center">
            <Mail className="w-4 h-4 text-[#E91E63] absolute left-4 pointer-events-none" /> 
            <input 
              type="email" 
              required 
              placeholder="admin@pasteleria.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-none focus:border-[#E91E63] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-[#E91E63] uppercase tracking-wider mb-1">Contraseña</label>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-[#E91E63] absolute left-4 pointer-events-none" /> 
            <input 
              type={showPassword ? 'text' : 'password'} 
              required 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-11 py-3 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-none focus:border-[#E91E63] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-gray-400 hover:text-[#E91E63] transition-colors p-1"
              title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full py-3.5 bg-[#E91E63] text-white rounded-xl text-sm font-bold shadow-sm active:scale-95 hover:bg-[#d81b60] transition-all disabled:opacity-50"
        >
          {loading ? 'Verificando...' : 'Ingresar al Panel'}
        </button>
      </form>
      
      <button 
        onClick={() => navigate('/')}
        className="mt-3 w-full py-2.5 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold active:scale-95 transition-transform"
      >
        Ir al Catálogo Público
      </button>
      
    </div>
  );
}

export default Login;