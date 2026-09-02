//La fila individual editable de porción, precio, stock y botón de borrar. productformmodal
import { Trash2 } from 'lucide-react';

export default function VariantRow({ variant, onChange, onRemove, canRemove }) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 w-full min-w-0">
      <input
        type="text"
        required
        placeholder="Ej: 8 porciones"
        value={variant.label}
        onChange={(e) => onChange(variant.id, 'label', e.target.value)}
        className="flex-1 min-w-0 px-2.5 sm:px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-xs sm:text-sm focus:outline-none focus:border-[#E91E63]"
      />

      <input
        type="number"
        min="0"
        step="any"
        required
        placeholder="$"
        value={variant.price}
        onChange={(e) => onChange(variant.id, 'price', e.target.value)}
        className="w-16 sm:w-20 px-1.5 sm:px-2 py-2 bg-gray-50 rounded-xl border border-gray-100 text-xs sm:text-sm text-center font-bold text-[#E91E63] focus:outline-none focus:border-[#E91E63] shrink-0"
        title="Precio"
      />

      <input
        type="number"
        min="0"
        required
        placeholder="Stk"
        value={variant.stock}
        onChange={(e) => onChange(variant.id, 'stock', e.target.value)}
        className="w-12 sm:w-16 px-1 py-2 bg-gray-50 rounded-xl border border-gray-100 text-xs sm:text-sm text-center text-gray-700 focus:outline-none focus:border-[#E91E63] shrink-0"
        title="Stock disponible"
      />
  
      <div className="w-6 sm:w-7 flex items-center justify-center shrink-0">
        {canRemove ? (
          <button
            type="button"
            onClick={() => onRemove(variant.id)}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-lg cursor-pointer active:scale-90 transition-all"
            title="Eliminar variante"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}