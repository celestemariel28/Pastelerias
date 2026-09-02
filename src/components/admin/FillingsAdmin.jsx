import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { PlusCircle, Pencil, Trash2, Check, X, Loader2 } from 'lucide-react';

export default function FillingsAdmin() {
  const [fillings, setFillings] = useState([]);
  const [newFillingName, setNewFillingName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchFillings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('fillings')
      .select('*')
      .order('id', { ascending: true });
    if (!error) setFillings(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchFillings();
  }, []);

  const handleAddFilling = async (e) => {
    e.preventDefault();
    const cleanName = newFillingName.trim().toUpperCase();
    if (!cleanName) return;

    const { data, error } = await supabase
      .from('fillings')
      .insert([{ name: cleanName, available: true }])
      .select();

    if (!error && data) {
      setFillings((prev) => [...prev, ...data]);
      setNewFillingName('');
    } else {
      alert("Error al agregar relleno: " + (error?.message || 'Error desconocido'));
    }
  };

  const handleUpdateName = async (id) => {
    const cleanName = editName.trim().toUpperCase();
    if (!cleanName) return;

    const { error } = await supabase
      .from('fillings')
      .update({ name: cleanName })
      .eq('id', id);

    if (!error) {
      setFillings((prev) => prev.map((f) => (f.id === id ? { ...f, name: cleanName } : f)));
      setEditingId(null);
    } else {
      alert("Error al actualizar relleno: " + error.message);
    }
  };

  const handleToggleAvailable = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    const { error } = await supabase
      .from('fillings')
      .update({ available: newStatus })
      .eq('id', id);

    if (!error) {
      setFillings((prev) => prev.map((f) => (f.id === id ? { ...f, available: newStatus } : f)));
    }
  };

  const handleDeleteFilling = async (id, name) => {
    if (window.confirm(`¿Seguro que deseas eliminar permanentemente el relleno "${name}"?`)) {
      const { error } = await supabase.from('fillings').delete().eq('id', id);
      if (!error) {
        setFillings((prev) => prev.filter((f) => f.id !== id));
      } else {
        alert("Error al eliminar: " + error.message);
      }
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-3.5 sm:p-4 bg-white rounded-2xl shadow-sm border border-pink-100 flex flex-col h-full min-w-0">
      <h3 className="text-base sm:text-lg font-black text-[#E91E63] mb-3 truncate">
        Gestión de Rellenos
      </h3>

      <form onSubmit={handleAddFilling} className="flex items-center gap-2 mb-4 w-full min-w-0">
        <input
          type="text"
          placeholder="Nombre (ej: OREO, FRUTILLAS...)"
          value={newFillingName}
          onChange={(e) => setNewFillingName(e.target.value)}
          className="flex-1 min-w-0 bg-rose-50/50 border border-rose-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#E91E63]"
        />
        <button
          type="submit"
          className="py-2 px-3 sm:px-4 bg-[#E91E63] text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-transform hover:bg-[#d81b60] flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          title="Agregar Relleno"
        >
          <PlusCircle className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Agregar</span>
        </button>
      </form>

      <div className="flex-1 overflow-y-auto pr-1 min-w-0 space-y-2">
        {loading ? (
          <div className="flex items-center justify-center py-6 text-gray-400 gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#E91E63]" />
            <span className="text-xs">Cargando rellenos...</span>
          </div>
        ) : (
          <>
            {fillings.map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between p-2.5 sm:p-3 bg-pink-50/30 border border-pink-100 rounded-xl text-xs min-w-0 gap-2"
              >
                {editingId === f.id ? (
                  <div className="flex items-center gap-1.5 w-full min-w-0">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 min-w-0 bg-white border border-[#E91E63] rounded-lg px-2.5 py-1.5 text-xs font-bold text-gray-800 uppercase focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => handleUpdateName(f.id)}
                      className="w-7 h-7 bg-emerald-500 text-white rounded-lg flex items-center justify-center active:scale-90 transition-transform cursor-pointer shrink-0"
                      title="Guardar"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="w-7 h-7 bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center active:scale-90 transition-transform cursor-pointer shrink-0"
                      title="Cancelar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span
                      className={`font-bold truncate min-w-0 flex-1 ${
                        f.available ? 'text-gray-800' : 'text-gray-400 line-through'
                      }`}
                      title={f.name}
                    >
                      {f.name}
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleAvailable(f.id, f.available)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-black cursor-pointer transition-colors ${
                          f.available
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        {f.available ? 'Activo' : 'Pausado'}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(f.id);
                          setEditName(f.name);
                        }}
                        className="w-7 h-7 flex items-center justify-center bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg active:scale-90 transition-transform cursor-pointer"
                        title="Editar nombre"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteFilling(f.id, f.name)}
                        className="w-7 h-7 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 rounded-lg active:scale-90 transition-transform cursor-pointer"
                        title="Eliminar relleno"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}

            {fillings.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">No hay rellenos cargados aún.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}