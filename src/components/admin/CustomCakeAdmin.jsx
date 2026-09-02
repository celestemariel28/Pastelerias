import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { PlusCircle, Loader2 } from 'lucide-react';
import PortionFilters from './PortionFilters';
import PortionItemRow from './PortionItemRow';

export default function CustomCakeAdmin() {
  const [portions, setPortions] = useState([]);
  const [coverings, setCoverings] = useState([]);
  const [activeType, setActiveType] = useState('buttercream');
  const [activeFloors, setActiveFloors] = useState(1);
  const [newLabel, setNewLabel] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCoveringsAndPortions = async () => {
    setLoading(true);
    const [covRes, portionsRes] = await Promise.all([
      supabase.from('cake_coverings').select('*').order('id', { ascending: true }),
      supabase.from('custom_cake_portions').select('*').order('price', { ascending: true })
    ]);

    if (covRes.data && covRes.data.length > 0) {
      setCoverings(covRes.data);
      if (!activeType) setActiveType(covRes.data[0].name.toLowerCase());
    }

    if (!portionsRes.error) {
      setPortions(portionsRes.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCoveringsAndPortions();
  }, []);

  const handleAddPortion = async (e) => {
    e.preventDefault();
    const priceNum = parseFloat(newPrice);
    if (!newLabel.trim() || isNaN(priceNum) || priceNum <= 0) {
      alert("Por favor ingresá un nombre y un precio válido mayor a 0.");
      return;
    }

    const { data, error } = await supabase
      .from('custom_cake_portions')
      .insert([
        {
          cake_type: activeType.toLowerCase(),
          floors: parseInt(activeFloors, 10),
          label: newLabel.trim(),
          price: priceNum
        }
      ])
      .select();

    if (!error && data) {
      setPortions(prev => [...prev, ...data].sort((a, b) => a.price - b.price));
      setNewLabel('');
      setNewPrice('');
    } else if (error) {
      alert('Error al agregar porción: ' + error.message);
    }
  };

  const handleUpdatePortion = async (id, label, price) => {
    const priceNum = parseFloat(price);
    const { error } = await supabase
      .from('custom_cake_portions')
      .update({ label, price: priceNum })
      .eq('id', id);

    if (!error) {
      setPortions(prev =>
        prev
          .map(p => (p.id === id ? { ...p, label, price: priceNum } : p))
          .sort((a, b) => a.price - b.price)
      );
    } else {
      alert('Error al actualizar: ' + error.message);
    }
  };

  const handleDeletePortion = async (id, label) => {
    if (window.confirm(`¿Seguro que deseas eliminar "${label}"?`)) {
      const { error } = await supabase.from('custom_cake_portions').delete().eq('id', id);
      if (!error) {
        setPortions(prev => prev.filter(p => p.id !== id));
      } else {
        alert('Error al eliminar: ' + error.message);
      }
    }
  };

  const filtered = portions.filter(
    (p) =>
      p.cake_type.toLowerCase() === activeType.toLowerCase() &&
      (parseInt(p.floors, 10) || 1) === activeFloors
  );

  return (
    <div className="w-full max-w-lg mx-auto p-3.5 sm:p-4 bg-white rounded-2xl shadow-sm border border-pink-100 flex flex-col h-full min-w-0">
      <h3 className="text-base sm:text-lg font-black text-[#E91E63] mb-2 truncate">
        Precios y Porciones
      </h3>

      <div className="w-full min-w-0 mb-3">
        <PortionFilters
          activeFloors={activeFloors}
          setActiveFloors={setActiveFloors}
          coverings={coverings}
          activeType={activeType}
          setActiveType={setActiveType}
        />
      </div>

      <form onSubmit={handleAddPortion} className="grid grid-cols-12 gap-2 mb-3 sm:mb-4">
        <div className="col-span-12 sm:col-span-6 min-w-0">
          <input
            type="text"
            placeholder="Porción (ej: 25 Porciones)"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="w-full bg-rose-50/50 border border-rose-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#E91E63]"
          />
        </div>

        <div className="col-span-8 sm:col-span-4 min-w-0">
          <input
            type="number"
            min="1"
            step="any"
            placeholder="Precio $"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            className="w-full bg-rose-50/50 border border-rose-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#E91E63]"
          />
        </div>

        <div className="col-span-4 sm:col-span-2">
          <button
            type="submit"
            className="w-full h-full min-h-[34px] py-2 px-3 bg-[#E91E63] text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-transform hover:bg-[#d81b60] flex items-center justify-center space-x-1 cursor-pointer"
            title="Agregar Porción"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span className="sm:hidden font-semibold">Agregar</span>
          </button>
        </div>
      </form>

      <div className="flex-1 overflow-y-auto pr-1 min-w-0 space-y-2">
        {loading ? (
          <div className="flex items-center justify-center py-6 text-gray-400 gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#E91E63]" />
            <span className="text-xs">Cargando porciones...</span>
          </div>
        ) : (
          <>
            {filtered.map((item) => (
              <PortionItemRow
                key={item.id}
                item={item}
                onUpdate={handleUpdatePortion}
                onDelete={handleDeletePortion}
              />
            ))}
            {filtered.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-6 px-2">
                No hay porciones cargadas para {activeFloors} piso/s en {activeType.toUpperCase()}.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}