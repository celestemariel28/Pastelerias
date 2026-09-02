import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

function AdminCategoryList({ categories = [], loading, onEdit, onDelete }) {
  if (loading) {
    return <p className="text-center text-xs text-gray-400 p-6 animate-pulse">Cargando categorías... 🔄</p>;
  }

  if (categories.length === 0) {
    return <p className="text-center text-xs text-gray-400 p-6">No hay categorías cargadas.</p>;
  }

  return (
    <div className="divide-y divide-gray-100">
      {categories.map((category) => (
        <div 
          key={category.id} 
          className="p-3 flex items-center justify-between hover:bg-white transition-colors"
        >
          <div className="flex items-center space-x-3 max-w-[60%]">
            <img 
              src={category.image_url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500'} 
              alt={category.name} 
              className="w-10 h-10 object-cover rounded-xl shadow-sm bg-white" 
            />
            <div className="truncate">
              <h4 className="text-xs font-bold text-gray-800 truncate">
                {category.name}
              </h4>
            </div>
          </div>

          <div className="flex space-x-1.5">
            <button 
              onClick={() => onEdit(category)} 
              className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-xl transition-colors" 
              title="Editar categoría"
            >
              <Pencil className="w-3.5 h-3.5" /> 
            </button>
            <button 
              onClick={() => onDelete(category.id, category.name)} 
              className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors" 
              title="Eliminar categoría"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminCategoryList;