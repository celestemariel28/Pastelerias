//La fila individual de cada porción (con modo visualización y modo edición rápida). relacionado con CustonCAkeAdmin
import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';

export default function PortionItemRow({ item, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(item.label);
  const [editPrice, setEditPrice] = useState(item.price);

  useEffect(() => {
    setEditLabel(item.label);
    setEditPrice(item.price);
  }, [item.label, item.price]);

  const handleSave = () => {
    const priceNum = parseFloat(editPrice);
    if (!editLabel.trim() || isNaN(priceNum) || priceNum <= 0) {
      alert("Por favor ingresá una etiqueta válida y un precio mayor a 0.");
      return;
    }
    onUpdate(item.id, editLabel.trim(), priceNum);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditLabel(item.label);
    setEditPrice(item.price);
    setIsEditing(false);
  };

  return (
    <div className="p-2.5 sm:p-3 bg-pink-50/30 border border-pink-100 rounded-xl text-xs min-w-0">
      {isEditing ? (
        <div className="flex items-center gap-1.5 w-full min-w-0">
          <input
            type="text"
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            className="flex-1 min-w-0 bg-white border border-[#E91E63] rounded-lg px-2 py-1.5 text-xs font-bold text-gray-800 focus:outline-none"
            placeholder="Porción"
            autoFocus
          />
          <input
            type="number"
            min="1"
            step="any"
            value={editPrice}
            onChange={(e) => setEditPrice(e.target.value)}
            className="w-16 sm:w-20 bg-white border border-[#E91E63] rounded-lg px-2 py-1.5 text-xs font-bold text-[#E91E63] focus:outline-none shrink-0"
            placeholder="Precio"
          />
          <button
            type="button"
            onClick={handleSave}
            className="w-7 h-7 bg-emerald-500 text-white rounded-lg flex items-center justify-center active:scale-90 transition-transform cursor-pointer shrink-0"
            title="Guardar cambios"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="w-7 h-7 bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center active:scale-90 transition-transform cursor-pointer shrink-0"
            title="Cancelar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span 
            className="font-bold text-gray-800 truncate min-w-0 flex-1" 
            title={item.label}
          >
            {item.label}
          </span>

          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <span className="font-black text-[#E91E63]">
              ${Number(item.price).toLocaleString('es-AR')}
            </span>

            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-7 h-7 flex items-center justify-center bg-blue-50 text-amber-600 hover:bg-blue-100 rounded-lg active:scale-90 transition-transform cursor-pointer"
              title="Editar porción"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onDelete(item.id, item.label)}
              className="w-7 h-7 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 rounded-lg active:scale-90 transition-transform cursor-pointer"
              title="Eliminar porción"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}