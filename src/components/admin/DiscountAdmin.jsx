import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Percent, Sparkles, Check, Loader2 } from 'lucide-react';

export default function DiscountAdmin() {
  const [isActive, setIsActive] = useState(false);
  const [percent, setPercent] = useState(10);
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [bannerText, setBannerText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (error) {
        console.error('Error cargando configuración:', error);
      } else if (data) {
        setIsActive(Boolean(data.is_active));
        setPercent(data.discount_percent ?? 10);
        setPaymentMethod(data.target_payment_method || 'Efectivo');
        setBannerText(data.banner_text || '');
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const percentNum = parseFloat(percent);

    if (isActive && (isNaN(percentNum) || percentNum <= 0 || percentNum > 100)) {
      alert('Por favor ingresá un porcentaje válido entre 1 y 100.');
      return;
    }

    setSaving(true);
    setSaved(false);

    const { error } = await supabase.from('store_settings').upsert({
      id: 1,
      is_active: isActive,
      discount_percent: isNaN(percentNum) ? 0 : percentNum,
      target_payment_method: paymentMethod,
      banner_text: bannerText.trim()
    });

    setSaving(false);

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      alert('Error guardando configuración: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-400 gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-[#E91E63]" />
        <span className="text-xs">Cargando promociones...</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 bg-white rounded-2xl shadow-sm border border-pink-100 max-w-lg mx-auto flex flex-col gap-4 w-full">
      <div className="flex items-center gap-2">
        <Percent className="w-4 h-4 text-[#E91E63]" />
        <h3 className="font-black text-sm sm:text-base text-[#E91E63]">Promoción / Descuento</h3>
      </div>

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        <label className="flex items-center gap-2.5 font-bold text-gray-700 bg-pink-50/50 p-3 rounded-xl border border-pink-100 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4 accent-[#E91E63] cursor-pointer"
          />
          <span>Habilitar cartel y descuento promocional</span>
        </label>

        <div>
          <label className="font-bold text-gray-700 block mb-1">Aplica pagando con:</label>
          <div className="grid grid-cols-2 gap-2">
            {['Efectivo', 'Transferencia'].map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`py-2.5 rounded-xl border-2 font-bold transition-all cursor-pointer ${
                  paymentMethod === method
                    ? 'border-[#E91E63] bg-pink-50 text-[#E91E63]'
                    : 'border-gray-200 text-gray-600 bg-white hover:border-pink-200'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="font-bold text-gray-700 block mb-1">Porcentaje de descuento (%):</label>
          <input
            type="number"
            min="1"
            max="100"
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
            className="w-full bg-rose-50/50 border border-rose-200 rounded-xl px-3 py-2 text-sm font-bold text-[#E91E63] focus:outline-none focus:ring-2 focus:ring-[#E91E63]"
            placeholder="Ej: 10"
          />
        </div>

        <div>
          <label className="font-bold text-gray-700 block mb-1">Texto del cartel en Categorías:</label>
          <input
            type="text"
            value={bannerText}
            onChange={(e) => setBannerText(e.target.value)}
            className="w-full bg-rose-50/50 border border-rose-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#E91E63]"
            placeholder="Ej: ¡10% de descuento abonando en efectivo!"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`w-full py-3 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-md disabled:opacity-60 ${
            saved ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[#E91E63] hover:bg-[#d81b60]'
          }`}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Guardando cambios...</span>
            </>
          ) : saved ? (
            <>
              <Check className="w-4 h-4" />
              <span>¡Configuración guardada!</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Guardar Promoción</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}