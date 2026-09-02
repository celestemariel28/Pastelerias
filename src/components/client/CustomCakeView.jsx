import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Lock, ArrowLeft, Loader2 } from 'lucide-react';
import CustomCakeInfoCard from './CustomCakeInfoCard';
import CustomCakeForm from './CustomCakeForm';
import ViewHeader from '../common/ViewHeader';

export default function CustomCakeView({ setView, onUpdateProductVariants }) {
  const [infoRead, setInfoRead] = useState(false);
  const [coveringsList, setCoveringsList] = useState([]);
  const [portionsList, setPortionsList] = useState([]);
  const [fillingsList, setFillingsList] = useState([]);
  const [infoSlides, setInfoSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAllData() {
      try {
        setLoading(true);

        const [slidesRes, coveringsRes, portionsRes, fillingsRes] = await Promise.all([
          supabase.from('info_slides').select('*').order('order_index', { ascending: true }),
          supabase.from('cake_coverings').select('*').eq('available', true).order('id', { ascending: true }),
          supabase.from('custom_cake_portions').select('*').order('price', { ascending: true }),
          supabase.from('fillings').select('*').eq('available', true).order('name', { ascending: true })
        ]);

        if (slidesRes.data) setInfoSlides(slidesRes.data);
        if (coveringsRes.data) setCoveringsList(coveringsRes.data);
        if (portionsRes.data) setPortionsList(portionsRes.data);
        if (fillingsRes.data) setFillingsList(fillingsRes.data);
      } catch (err) {
        console.error('Error cargando datos de personalización:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAllData();
  }, []);

  const handleCustomCakeSubmit = ({ floors, covering, portion, filling }) => {
    const titleType = `TORTA PERSONALIZADA DE ${floors} ${floors === 1 ? 'PISO' : 'PISOS'} (${covering})`;
    const customProductId = `custom_${Date.now()}`;
    const cleanPrice = parseFloat(portion.price) || 0;

    const customItem = {
      productId: customProductId,
      productName: titleType,
      variantId: `${portion.label}_${filling}`,
      variantLabel: `${portion.label} | ${floors} Piso/s | Cobertura: ${covering} | Relleno: ${filling}`,
      price: cleanPrice,
      quantity: 1,
      maxStock: 99
    };

    if (onUpdateProductVariants) {
      onUpdateProductVariants(customProductId, [customItem]);
    }

    // Redirige al carrito para que BottomNav active el icono correspondiente
    setView('cart');
  };

  return (
    <main className="flex-1 p-4 max-w-md mx-auto w-full pb-24 animate-fadeIn">
      {/* Encabezado */}
      <ViewHeader
        title="Tortas Personalizadas"
        onBack={() => setView('categories')}
        backTitle="Volver a Categorías"
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#E91E63]" />
          <span className="text-xs font-semibold">Cargando opciones...</span>
        </div>
      ) : (
        <>
          <CustomCakeInfoCard
            infoRead={infoRead}
            onConfirmRead={() => setInfoRead(true)}
            infoSlides={infoSlides}
          />

          {!infoRead ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-3xl p-8 text-center flex flex-col items-center justify-center gap-3 animate-fadeIn">
              <div className="w-12 h-12 bg-pink-100/70 text-[#E91E63] rounded-full flex items-center justify-center shadow-inner">
                <Lock className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h4 className="font-extrabold text-sm text-gray-800">Personalización Bloqueada</h4>
              <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                Hacé clic arriba en <strong className="text-gray-700">"Ver Información Importante"</strong> para desbloquear las opciones de pisos, cobertura, porciones y rellenos.
              </p>
            </div>
          ) : (
            <CustomCakeForm
              coveringsList={coveringsList}
              portionsList={portionsList}
              fillingsList={fillingsList}
              onSubmit={handleCustomCakeSubmit}
            />
          )}
        </>
      )}
    </main>
  );
}