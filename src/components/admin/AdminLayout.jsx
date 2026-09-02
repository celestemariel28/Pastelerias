import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import Login from './Login';
import ProductFormModal from './ProductFormModal';
import AdminProductList from './AdminProductList';
import AdminCategoryManager from './AdminCategoryManager';
import FillingsAdmin from './FillingsAdmin';
import InfoSlidesAdmin from './InfoSlidesAdmin';
import CustomCakeAdmin from './CustomCakeAdmin';
import CoveringsAdmin from './CoveringsAdmin';
import DiscountAdmin from './DiscountAdmin'; 
import { CakeSlice, Tag, PlusCircle, LogOut, Sparkles, Image, Layers, Shield, Percent } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SESSION_DURATION_MS = 20 * 60 * 1000; 

function AdminLayout({ setView }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [categories, setCategories] = useState([]);

  // 1. Verificación de sesión de 20 min
  useEffect(() => {
    const savedUser = localStorage.getItem('admin_user');
    const loginTime = localStorage.getItem('admin_login_time');

    if (savedUser && loginTime) {
      const now = Date.now();
      const elapsed = now - parseInt(loginTime, 10);

      if (elapsed < SESSION_DURATION_MS) {
        setUser(JSON.parse(savedUser));
      } else {
        handleLogout();
      }
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('admin_user', JSON.stringify(userData));
    localStorage.setItem('admin_login_time', Date.now().toString());
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_login_time');
  };

  const fetchAdminCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error cargando las categorías:', error.message);
    }
  };

  const fetchAdminProducts = async () => {
    try {
      setLoadingProducts(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });
        
      if (error) throw error;

      setProducts((data || []).map(p => ({
        id: p.id,
        categoryId: p.category_id,
        name: p.name,
        description: p.description,
        price: p.price,
        stock: p.stock,
        image: p.image_url,
        variante: p.variante
      })));
    } catch (error) {
      console.error('Error cargando tabla de administración:', error.message);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAdminProducts();
      fetchAdminCategories();
    }
  }, [user]);

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`¿Estás segura de que querés eliminar permanentemente "${name}"?`)) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      alert('Producto eliminado correctamente.');
      fetchAdminProducts();
    } catch (error) {
      alert(`No se pudo eliminar: ${error.message}`);
    }
  };

  if (!user) return <Login setView={setView} onLoginSuccess={handleLoginSuccess} />;

  return (
    <div className="flex-1 p-4 flex flex-col bg-white rounded-3xl max-h-[90vh] overflow-hidden">
      <div className="flex justify-between items-center border-b pb-2 mb-2">
        <div>
          <h2 className="text-lg font-black text-[#E91E63]">Panel de Control</h2>
          <p className="text-[10px] text-gray-400">Admin: {user.email || 'Conectada'}</p>
        </div>
        <button 
          onClick={handleLogout} 
          className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-xl active:scale-95 transition-transform flex items-center space-x-1 hover:bg-red-100/70 cursor-pointer"
        >
          <span>Salir</span>
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex overflow-x-auto no-scrollbar bg-gray-100 p-1 rounded-xl mb-3 gap-1 shrink-0">
        <button 
          onClick={() => setActiveTab('categories')}
          className={`py-1.5 px-3 flex items-center space-x-1 text-[11px] font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${activeTab === 'categories' ? 'bg-white text-[#E91E63] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Categorías</span>
        </button>

        <button 
          onClick={() => setActiveTab('products')}
          className={`py-1.5 px-3 flex items-center space-x-1 text-[11px] font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${activeTab === 'products' ? 'bg-white text-[#E91E63] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <CakeSlice className="w-3.5 h-3.5" />
          <span>Productos</span>
        </button>

        <button 
          onClick={() => setActiveTab('coverings')}
          className={`py-1.5 px-3 flex items-center space-x-1 text-[11px] font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${activeTab === 'coverings' ? 'bg-white text-[#E91E63] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Coberturas</span>
        </button>

        <button 
          onClick={() => setActiveTab('fillings')}
          className={`py-1.5 px-3 flex items-center space-x-1 text-[11px] font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${activeTab === 'fillings' ? 'bg-white text-[#E91E63] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Rellenos</span>
        </button>

        <button 
          onClick={() => setActiveTab('customCakes')}
          className={`py-1.5 px-3 flex items-center space-x-1 text-[11px] font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${activeTab === 'customCakes' ? 'bg-white text-[#E91E63] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Precios Tortas</span>
        </button>

        <button 
          onClick={() => setActiveTab('promos')}
          className={`py-1.5 px-3 flex items-center space-x-1 text-[11px] font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${activeTab === 'promos' ? 'bg-white text-[#E91E63] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Percent className="w-3.5 h-3.5" />
          <span>Promos</span>
        </button>

        <button 
          onClick={() => setActiveTab('slides')}
          className={`py-1.5 px-3 flex items-center space-x-1 text-[11px] font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${activeTab === 'slides' ? 'bg-white text-[#E91E63] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Image className="w-3.5 h-3.5" />
          <span>Info</span>
        </button>        
      </div>

      {/* Contenido según la pestaña activa */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'products' && (
          <>
            <div className="mb-3">
              <button 
                onClick={() => { setProductToEdit(null); setIsModalOpen(true); }} 
                className="w-full py-2.5 bg-[#E91E63] text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-transform hover:bg-[#d81b60] flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <PlusCircle className="w-5 h-5"/> 
                <span>Agregar Nuevo Producto</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto border border-gray-100 rounded-2xl bg-gray-50/50">
              <AdminProductList 
                products={products}
                loading={loadingProducts}
                onEdit={(prod) => { setProductToEdit(prod); setIsModalOpen(true); }}
                onDelete={handleDeleteProduct}
              />
            </div>
          </>
        )}

        {activeTab === 'categories' && (
          <div className="flex-1 overflow-y-auto">
            <AdminCategoryManager 
              onRefreshProducts={fetchAdminProducts} 
              onCategoryChanged={fetchAdminCategories} 
            />
          </div>
        )}

        {activeTab === 'promos' && (
          <div className="flex-1 overflow-y-auto pr-1">
            <DiscountAdmin />
          </div>
        )}

        {activeTab === 'fillings' && (
          <div className="flex-1 overflow-y-auto">
            <FillingsAdmin />
          </div>
        )}

        {activeTab === 'slides' && (
          <div className="flex-1 overflow-y-auto">
            <InfoSlidesAdmin />
          </div>
        )}

        {activeTab === 'customCakes' && (
          <div className="flex-1 overflow-y-auto">
            <CustomCakeAdmin />
          </div>
        )}

        {activeTab === 'coverings' && (
          <div className="flex-1 overflow-y-auto">
            <CoveringsAdmin />
          </div>
        )}
      </div>

      <button 
        onClick={() => {
          if (typeof setView === 'function') {
            setView('categories');
          } else {
            navigate('/');
          }
        }} 
        className="mt-3 w-full py-2.5 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold active:scale-95 transition-transform cursor-pointer hover:bg-gray-200"
      >
        Ir al Catálogo Público
      </button>

      <ProductFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        productToEdit={productToEdit} 
        onSaveSuccess={fetchAdminProducts} 
        categories={categories} 
      />
    </div>
  );
}

export default AdminLayout;