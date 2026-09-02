import { Pencil, Trash2 } from 'lucide-react'; 

function AdminProductList({ products = [], loading, onEdit, onDelete }) {
  if (loading) {
    return <p className="text-center text-xs text-gray-400 p-6 animate-pulse">Sincronizando inventario... </p>;
  }

  if (products.length === 0) {
    return <p className="text-center text-xs text-gray-400 p-6">No hay productos cargados en tu pastelería.</p>;
  }

  return (
    <div className="divide-y divide-gray-100">
      {products.map((product) => (
        <div key={product.id} className="p-3 flex items-center justify-between hover:bg-white transition-colors">
          <div className="flex items-center space-x-3 max-w-[60%]">
            <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-xl shadow-sm bg-white" />
            <div className="truncate">
              <h4 className="text-xs font-bold text-gray-800 truncate">{product.name}</h4>
              <p className="text-[10px] font-semibold text-gray-500">
                ${product.price.toLocaleString('es-AR')} • <span className={product.stock > 0 ? "text-emerald-600" : "text-rose-500"}>Stock: {product.stock}</span>
              </p>
            </div>
          </div>

          <div className="flex space-x-1.5">
            <button  onClick={() => onEdit(product)} className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-xl transition-colors" title="Editar dulce"
            >
              <Pencil className="w-3.5 h-3.5" /> 
            </button>
            <button onClick={() => onDelete(product.id, product.name)} className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors" title="Eliminar del catálogo"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminProductList;