import React, { useState } from 'react';
import { enviarPedidoWhatsApp } from '../../utils/whatsappHelper';
import OrderSummaryBreakdown from './OrderSummaryBreakdown';
import ViewHeader from '../common/ViewHeader';

export default function FormView({ 
  setView, 
  cart = {}, 
  clearCart,
  setCart,
  calculateSubtotal, 
  onRemoveItemFromCart, 
  PRODUCTS_MOCK = [],
  discountSettings = { isActive: false, percent: 0, paymentMethod: 'Efectivo' }
}) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    deliveryType: 'Retiro en tienda',
    paymentMethod: 'Transferencia',
    cashAmount: '',
    notes: ''
  });

  // 1. CÁLCULO EN TIEMPO REAL DEL DESCUENTO
  const subtotal = calculateSubtotal ? calculateSubtotal() : 0;
  
  const appliesDiscount = Boolean(
    discountSettings?.isActive &&
    parseFloat(discountSettings?.percent) > 0 &&
    formData.paymentMethod === (discountSettings?.paymentMethod || 'Efectivo')
  );

  const discountAmount = appliesDiscount 
    ? (subtotal * (parseFloat(discountSettings.percent) / 100)) 
    : 0;
    
  const totalFinal = Math.max(0, subtotal - discountAmount);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (subtotal <= 0) {
      alert("Tu carrito está vacío. Agregá al menos un producto.");
      setView('products');
      return;
    }

    const cleanPhone = formData.phone.replace(/\s+/g, '');
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(cleanPhone)) {
      alert("Por favor, ingresá un número de celular válido de 10 dígitos (Ej: 3816554433).");
      return;
    }

    if (formData.paymentMethod === 'Efectivo') {
      const cash = parseFloat(formData.cashAmount);
      if (!formData.cashAmount || isNaN(cash)) {
        alert("Por favor, ingresá con cuánto vas a pagar.");
        return;
      }
      if (cash < totalFinal) {
        alert(`El monto ($${cash.toLocaleString('es-AR')}) es menor al total a pagar ($${totalFinal.toLocaleString('es-AR')}).`);
        return;
      }
    }

    enviarPedidoWhatsApp({ 
      formData: { ...formData, phone: cleanPhone }, 
      cart, 
      subtotal, 
      discountAmount, 
      discountPercent: discountSettings?.percent || 0, 
      discountPaymentMethod: discountSettings?.paymentMethod || 'Efectivo',
      totalFinal, 
      PRODUCTS_MOCK 
    });

    if (clearCart) {
      clearCart();
    } else if (setCart) {
      setCart({});
    }

    setView('products');
  };

  return (
    <main className="flex-1 p-4 max-w-md mx-auto w-full pb-20 animate-fadeIn">
      <ViewHeader
        title="Datos del Pedido"
        onBack={() => setView('cart')}
        backTitle="Volver al carrito"
      />

      <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm p-5 rounded-3xl shadow-xl flex flex-col gap-4 text-gray-800 border border-pink-100">
        <div>
          <label className="text-xs font-bold text-[#D81B60] uppercase block mb-1">Nombre y Apellido *</label>
          <input 
            type="text" 
            name="name" 
            required 
            value={formData.name} 
            onChange={handleChange} 
            className="w-full bg-rose-50/50 border border-rose-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#E91E63] text-sm font-semibold" 
            placeholder="Ej: Candela Garbini" 
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#D81B60] uppercase block mb-1">Número de Celular (10 dígitos) *</label>
          <input 
            type="text" 
            name="phone" 
            required 
            maxLength={10} 
            value={formData.phone} 
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/[^0-9]/g, '');
              handleChange({ target: { name: 'phone', value: onlyNums } });
            }} 
            className="w-full bg-rose-50/50 border border-rose-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#E91E63] font-mono tracking-wider text-sm font-bold" 
            placeholder="Ej: 3816554433" 
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#D81B60] uppercase block mb-1">Forma de Pago</label>
          <select 
            name="paymentMethod" 
            value={formData.paymentMethod} 
            onChange={handleChange} 
            className="w-full bg-rose-50/50 border border-rose-200 rounded-xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#E91E63] font-bold text-gray-700 text-sm"
          >
            <option value="Transferencia">Transferencia Bancaria</option>
            <option value="Efectivo">Efectivo (al retirar)</option>
          </select>
        </div>

        {formData.paymentMethod === 'Efectivo' && (
          <div className="animate-slideDown">
            <label className="text-xs font-bold text-[#D81B60] uppercase block mb-1">¿Con cuánto vas a abonar?</label>
            <input 
              type="number" 
              name="cashAmount" 
              required 
              value={formData.cashAmount} 
              onChange={handleChange} 
              className="w-full bg-rose-50/50 border border-rose-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#E91E63] text-sm font-bold text-[#E91E63]" 
              placeholder={`Total a pagar: $${totalFinal.toLocaleString('es-AR')}`} 
            />
          </div>
        )}

        <div>
          <label className="text-xs font-bold text-[#D81B60] uppercase block mb-1">Notas o Aclaraciones</label>
          <textarea 
            name="notes" 
            rows="2" 
            value={formData.notes} 
            onChange={handleChange} 
            className="w-full bg-rose-50/50 border border-rose-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#E91E63] resize-none text-xs" 
            placeholder="Ej: horario de retiro, dedicatoria..." 
          />
        </div>
        
        <OrderSummaryBreakdown 
          cart={cart}
          subtotal={subtotal}
          appliesDiscount={appliesDiscount}
          discountSettings={discountSettings}
          discountAmount={discountAmount}
          totalFinal={totalFinal}
          onRemoveItem={onRemoveItemFromCart}
        />

        <button 
          type="submit" 
          disabled={subtotal <= 0}
          className="w-full bg-[#E91E63] hover:bg-[#D81B60] text-white py-4 rounded-2xl font-black text-sm shadow-lg active:scale-95 transition-transform tracking-wider cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="w-5 h-5 shrink-0"
          >
            <path d="M12.011 2c-5.506 0-9.989 4.478-9.989 9.984 0 1.758.459 3.472 1.332 4.982L2 22l5.187-1.353c1.458.795 3.104 1.214 4.823 1.214 5.505 0 9.988-4.477 9.988-9.984 0-2.665-1.038-5.172-2.923-7.057C17.192 3.036 14.68 2 12.011 2zm5.834 14.285c-.242.684-1.22 1.252-1.996 1.418-.53.113-1.22.203-3.548-.758-2.977-1.229-4.894-4.256-5.043-4.453-.148-.198-1.21-1.61-1.21-3.072 0-1.462.766-2.18 1.038-2.477.272-.298.595-.372.793-.372.198 0 .396.002.569.01.185.008.434-.071.679.516.248.595.842 2.054.916 2.203.074.148.124.322.025.52-.099.198-.148.322-.297.495-.148.173-.312.387-.446.52-.148.148-.302.309-.13.604.173.297.77 1.272 1.654 2.06 1.137 1.013 2.096 1.327 2.393 1.475.297.148.471.124.644-.074.173-.198.743-.866.941-1.163.198-.297.396-.248.668-.148.272.099 1.73.816 2.027.965.297.148.495.223.569.347.074.124.074.718-.168 1.402z" />
          </svg>
          <span>Confirmar Pedido por WhatsApp</span>
        </button>
      </form>
    </main>
  );
}