//La sección que agrupa la cabecera, el botón de añadir y la lista con scroll. productformmodal
import { Plus } from 'lucide-react';
import VariantRow from './VariantRow';

export default function VariantsEditor({ variants, onAddVariant, onRemoveVariant, onVariantChange }) {
  return (
    <div className="space-y-1.5 w-full min-w-0">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          Variantes ({variants.length})
        </span>
        <button
          type="button"
          onClick={onAddVariant}
          className="text-[#E91E63] text-xs font-bold hover:text-[#d81b60] flex items-center gap-1 cursor-pointer active:scale-95 transition-transform"
        >
          <Plus className="w-3.5 h-3.5" /> 
          <span>Añadir</span>
        </button>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 px-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider">
        <span className="flex-1 min-w-0">Porción / Presentación</span>
        <span className="w-16 sm:w-20 text-center shrink-0">Precio</span>
        <span className="w-12 sm:w-16 text-center shrink-0">Stock</span>
        <span className="w-6 sm:w-7 shrink-0" />
      </div>

      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-0.5 scrollbar-thin">
        {variants.map((variant) => (
          <VariantRow
            key={variant.id}
            variant={variant}
            onChange={onVariantChange}
            onRemove={onRemoveVariant}
            canRemove={variants.length > 1}
          />
        ))}
      </div>
    </div>
  );
}