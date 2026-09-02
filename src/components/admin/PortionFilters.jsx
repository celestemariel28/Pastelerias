// Los selectores superiores de Pisos (1 o 2) y Coberturas. relacionado con CustonCAkeAdmin
import { CakeSlice, Layers } from 'lucide-react';

export default function PortionFilters({
  activeFloors,
  setActiveFloors,
  coverings = [],
  activeType,
  setActiveType
}) {
  return (
    <div className="space-y-2 mb-3.5 w-full min-w-0">
      <div className="grid grid-cols-2 bg-primary-clear border border-primary-clear-b p-1 rounded-xl gap-1">
        <button
          type="button"
          onClick={() => setActiveFloors(1)}
          className={`py-2 px-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none ${
            activeFloors === 1 
              ? 'bg-primary text-white shadow-xs' 
              : 'text-primary-dark hover:bg-primary-clear'
          }`}
        >
          <CakeSlice className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">1 Piso</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFloors(2)}
          className={`py-2 px-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none ${
            activeFloors === 2 
              ? 'bg-primary text-white shadow-xs' 
              : 'text-primary-dark hover:bg-primary-light'
          }`}
        >
          <Layers className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">2 Pisos</span>
        </button>
      </div>

      <div className="flex bg-gray-100/80 p-1 rounded-xl gap-1 overflow-x-auto no-scrollbar scroll-smooth">
        {coverings.map((cov) => {
          const isSelected = activeType?.toLowerCase() === cov.name?.toLowerCase();

          return (
            <button
              key={cov.id}
              type="button"
              onClick={() => setActiveType(cov.name.toLowerCase())}
              className={`py-1.5 px-3 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer select-none ${
                isSelected
                  ? 'bg-white text-primary shadow-xs'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-white/50'
              }`}
            >
              {cov.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}