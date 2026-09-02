import { useCategoryForm } from '../../hooks/useCategoryForm';
import AdminCategoryList from './AdminCategoryList';
import { Tag, FolderEdit } from 'lucide-react';
import ImageUploader from '../common/ImageUploader'; 

function AdminCategoryManager({ onRefreshProducts, onCategoryChanged }) {
  const { categories, formData, setters, loading, actions } = useCategoryForm({ 
    onRefreshProducts, 
    onCategoryChanged 
  });
  
  const { newCategoryName, newCategoryImage, categoryToEdit } = formData;

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden">
      <form 
        onSubmit={actions.handleSubmit} 
        className={`mb-4 p-3 rounded-xl border transition-colors ${
          categoryToEdit ? 'bg-amber-50/70 border-amber-200' : 'bg-gray-50 border-gray-100'
        } space-y-2`}
      >
        <div className="flex justify-between items-center mb-1">
          <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1.5">
            {categoryToEdit ? (
              <>
                <FolderEdit className="w-3 h-3 text-amber-600" /> 
                <span>Editando Categoría</span>
              </>
            ) : (
              <>
                <Tag className="w-3 h-3 text-[#E91E63]" />
                <span>Nueva Categoría</span>
              </>
            )}
          </h4>
          {categoryToEdit && (
            <button 
              type="button" 
              onClick={actions.handleCancelEdit} 
              className="text-[10px] text-amber-700 font-bold underline bg-transparent cursor-pointer"
            >
              Cancelar
            </button>
          )}
        </div>
        
        <input 
          type="text" 
          required 
          placeholder="Nombre (Ej: Tartas Frutales)" 
          value={newCategoryName}
          onChange={(e) => setters.setNewCategoryName(e.target.value)}
          className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#E91E63]"
        />
        
        <ImageUploader
          label="Foto de la Categoría"
          folder="categorias"
          value={newCategoryImage}
          onChange={(url) => setters.setNewCategoryImage(url)}
        />

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-2 text-white rounded-lg text-xs font-bold active:scale-95 transition-all shadow-sm disabled:opacity-50 mt-1 cursor-pointer ${
            categoryToEdit 
              ? 'bg-amber-500 hover:bg-amber-600' 
              : 'bg-[#E91E63] hover:bg-[#d81b60]'
          }`}
        >
          {loading ? 'Guardando...' : categoryToEdit ? 'Actualizar Cambios' : 'Añadir Categoría'}
        </button>
      </form>

      <div className="flex-1 overflow-y-auto border border-gray-100 rounded-2xl bg-gray-50/50">
        <AdminCategoryList 
          categories={categories}
          loading={loading}
          onEdit={actions.handleStartEdit}
          onDelete={actions.handleDeleteCategory}
        />
      </div>
    </div>
  );
}

export default AdminCategoryManager;