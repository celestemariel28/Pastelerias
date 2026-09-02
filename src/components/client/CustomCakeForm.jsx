import React, { useState, useEffect, useMemo } from 'react';
import { CakeSlice, Layers, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export default function CustomCakeForm({
  coveringsList = [],
  portionsList = [],
  fillingsList = [],
  onSubmit
}) {
  const availableCoverings = useMemo(
    () => coveringsList.filter((c) => c.available !== false),
    [coveringsList]
  );
  
  const availableFillings = useMemo(
    () => fillingsList.filter((f) => f.available !== false),
    [fillingsList]
  );

  const [selectedFloors, setSelectedFloors] = useState(1);
  const [selectedCovering, setSelectedCovering] = useState('');
  const [selectedPortionId, setSelectedPortionId] = useState(null);
  const [selectedFilling, setSelectedFilling] = useState('');

  useEffect(() => {
    if (availableCoverings.length > 0 && !selectedCovering) {
      setSelectedCovering(availableCoverings[0].name);
    }
  }, [availableCoverings, selectedCovering]);

  useEffect(() => {
    if (availableFillings.length > 0 && !selectedFilling) {
      setSelectedFilling(availableFillings[0].name);
    }
  }, [availableFillings, selectedFilling]);

  const currentPortions = useMemo(() => {
    return portionsList.filter(
      (p) =>
        String(p.cake_type).trim().toLowerCase() === String(selectedCovering).trim().toLowerCase() &&
        (parseInt(p.floors, 10) || 1) === selectedFloors
    );
  }, [portionsList, selectedCovering, selectedFloors]);

  const activePortion = useMemo(() => {
    const found = currentPortions.find((p) => p.id === selectedPortionId);
    return found || currentPortions[0] || null;
  }, [currentPortions, selectedPortionId]);

  const handleFormSubmit = () => {
    if (!activePortion) {
      alert('Por favor seleccioná una opción de porciones disponible.');
      return;
    }
    if (!selectedFilling) {
      alert('Por favor seleccioná un relleno para tu torta.');
      return;
    }

    if (onSubmit) {
      onSubmit({
        floors: selectedFloors,
        covering: selectedCovering,
        portion: activePortion,
        filling: selectedFilling
      });
    }
  };

  const isReady = Boolean(activePortion && selectedFilling);

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-pink-100 flex flex-col gap-4.5 animate-fadeIn min-w-0">
      
      <div>
        <label className="text-xs font-black text-[#D81B60] uppercase block mb-2 tracking-wider">
          1. Cantidad de Pisos
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setSelectedFloors(1)}
            className={`py-2.5 px-2 rounded-2xl border-2 text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 select-none ${
              selectedFloors === 1
                ? 'border-[#E91E63] bg-pink-50 text-[#E91E63] shadow-xs'
                : 'border-gray-200 text-gray-700 bg-white hover:border-pink-200'
            }`}
          >
            <CakeSlice className="w-4 h-4 shrink-0" />
            <span>1 Piso</span>
          </button>
          
          <button
            type="button"
            onClick={() => setSelectedFloors(2)}
            className={`py-2.5 px-2 rounded-2xl border-2 text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 select-none ${
              selectedFloors === 2
                ? 'border-[#E91E63] bg-pink-50 text-[#E91E63] shadow-xs'
                : 'border-gray-200 text-gray-700 bg-white hover:border-pink-200'
            }`}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span>2 Pisos</span>
          </button>
        </div>
      </div>

      <div>
        <label className="text-xs font-black text-[#D81B60] uppercase block mb-2 tracking-wider">
          2. Cobertura
        </label>
        <div className="grid grid-cols-2 gap-2">
          {availableCoverings.map((cov) => {
            const isSelected = String(selectedCovering).toUpperCase() === String(cov.name).toUpperCase();
            return (
              <button
                key={cov.id}
                type="button"
                onClick={() => {
                  setSelectedCovering(cov.name);
                  setSelectedPortionId(null);
                }}
                className={`py-2.5 px-2 rounded-2xl border-2 text-xs font-black transition-all cursor-pointer truncate active:scale-95 select-none ${
                  isSelected
                    ? 'border-[#E91E63] bg-pink-50 text-[#E91E63] shadow-xs'
                    : 'border-gray-200 text-gray-700 bg-white hover:border-pink-200'
                }`}
                title={cov.name}
              >
                {cov.name}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-xs font-black text-[#D81B60] uppercase block mb-2 tracking-wider">
          3. Porciones y Precios ({selectedFloors} {selectedFloors === 1 ? 'Piso' : 'Pisos'})
        </label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 min-w-0">
          {currentPortions.map((portion) => {
            const isSelected = activePortion?.id === portion.id;
            return (
              <div
                key={portion.id}
                onClick={() => setSelectedPortionId(portion.id)}
                className={`p-2.5 rounded-xl border-2 flex justify-between items-center cursor-pointer transition-all active:scale-98 select-none ${
                  isSelected
                    ? 'border-[#E91E63] bg-pink-50/70 text-[#E91E63] shadow-2xs'
                    : 'border-pink-50/70 hover:border-pink-100 text-gray-800 bg-white'
                }`}
              >
                <span className="text-xs font-bold truncate mr-2">{portion.label}</span>
                <span className="text-xs font-black text-[#E91E63] shrink-0">
                  ${Number(portion.price).toLocaleString('es-AR')}
                </span>
              </div>
            );
          })}

          {currentPortions.length === 0 && (
            <div className="bg-gray-50 border border-gray-100 rounded-xl py-3 px-2 text-center">
              <p className="text-xs text-gray-400">
                No hay opciones cargadas para {selectedFloors} piso/s con cobertura {selectedCovering}.
              </p>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="text-xs font-black text-[#D81B60] uppercase block mb-1 tracking-wider">
          4. Relleno a Elección (1 solo)
        </label>
        <p className="text-[11px] text-gray-500 mb-2 font-medium">
          Base: Bizcochuelo de vainilla + dulce de leche + 1 relleno a elección:
        </p>
        <select
          value={selectedFilling}
          onChange={(e) => setSelectedFilling(e.target.value)}
          className="w-full bg-rose-50/50 border border-rose-200 rounded-xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#E91E63] text-xs font-bold text-gray-800 cursor-pointer"
        >
          {availableFillings.map((f) => (
            <option key={f.id} value={f.name}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-pink-50/60 border border-pink-200 p-3 rounded-2xl flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-[#E91E63] shrink-0 mt-0.5" />
        <p className="text-[11px] text-pink-950 leading-snug">
          <strong className="text-[#D81B60]">Diseño y temática:</strong> Podrás enviar la foto de referencia directamente por WhatsApp al confirmar este pedido.
        </p>
      </div>

      <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-[#D81B60] shrink-0 mt-0.5" />
        <p className="text-[11px] font-bold text-[#D81B60] leading-tight">
          Precio base orientativo. Puede variar según la complejidad del modelado o agregados especiales.
        </p>
      </div>

      <button
        type="button"
        disabled={!isReady}
        onClick={handleFormSubmit}
        className="w-full py-3.5 bg-[#E91E63] hover:bg-[#D81B60] text-white font-bold rounded-2xl shadow-md text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        <span>Continuar con el Pedido</span>
        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
      </button>
    </div>
  );
}