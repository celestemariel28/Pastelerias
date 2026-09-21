import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Percent, Sparkles, Check, Loader2 } from 'lucide-react';

export default function DiscountAdmin() {
  const storeId = import.meta.env.VITE_STORE_ID;

  const [isActive, setIsActive] = useState(false);
  const [percent, setPercent] = useState(10);
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [bannerText, setBannerText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      if (!storeId) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('store_id', storeId)
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
  }, [storeId]);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!storeId) {
      alert('Error: no se detectó el identificador de la tienda (VITE_STORE_ID).');
      return;
    }

    const percentNum = parseFloat(percent);

    if (isActive && (isNaN(percentNum) || percentNum <= 0 || percentNum > 100)) {
      alert('Por favor ingresá un porcentaje válido entre 1 y 100.');
      return;
    }

    setSaving(true);
    setSaved(false);

    // Al ser store_id la Primary Key, el upsert actualiza si existe o inserta si no
    const { error } = await supabase
      .from('store_settings')
      .upsert({
        store_id: storeId,
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
        <Loader2 className="w-4 h-4 animate-spin text-primary" />
        <span className="text-xs">Cargando promociones...</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 bg-white rounded-2xl shadow-sm border border-primary-clear-b max-w-lg mx-auto flex flex-col gap-4 w-full">
      <div className="flex items-center gap-2">
        <Percent className="w-4 h-4 text-primary" />
        <h3 className="font-black text-sm sm:text-base text-primary">Promoción / Descuento</h3>
      </div>

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        <label className="flex items-center gap-2.5 font-bold text-gray-700 bg-primary-clear p-3 rounded-xl border border-primary-clear-b cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4 accent-primary cursor-pointer"
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
                    ? 'border-primary bg-primary-clear text-primary'
                    : 'border-gray-200 text-gray-600 bg-white hover:border-primary-clear-b'
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
            className="w-full bg-primary-clear border border-primary-clear-b rounded-xl px-3 py-2 text-sm font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Ej: 10"
          />
        </div>

        <div>
          <label className="font-bold text-gray-700 block mb-1">Texto del cartel en Categorías:</label>
          <input
            type="text"
            value={bannerText}
            onChange={(e) => setBannerText(e.target.value)}
            className="w-full bg-primary-clear border border-primary-clear-b rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Ej: ¡10% de descuento abonando en efectivo!"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`w-full py-3 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-md disabled:opacity-60 ${
            saved ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-primary hover:bg-primary-dark'
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