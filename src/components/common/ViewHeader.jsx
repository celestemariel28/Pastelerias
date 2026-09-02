//voton de volver
import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function ViewHeader({ 
  title, 
  onBack, 
  backTitle = "Volver",
  children 
}) {
  return (
    <div className="flex items-center justify-between gap-3 mb-4 w-full min-w-0">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center bg-white rounded-full text-[#E91E63] shadow-md active:scale-90 transition-transform cursor-pointer shrink-0"
            title={backTitle}
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}

        <h2 className="text-xl sm:text-2xl font-black text-[#E91E63] capitalize truncate">
          {title}
        </h2>
      </div>

      {/* Espacio opcional por si alguna vista requiere una acción a la derecha */}
      {children && (
        <div className="shrink-0">
          {children}
        </div>
      )}
    </div>
  );
}