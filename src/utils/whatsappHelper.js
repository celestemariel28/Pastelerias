import { supabase } from '../supabaseClient';

export const enviarPedidoWhatsApp = async ({ 
  storeId,
  formData, 
  cart, 
  subtotal, 
  discountAmount = 0, 
  discountPercent = 0, 
  discountPaymentMethod = 'Efectivo',
  totalFinal, 
  PRODUCTS_MOCK 
}) => {
  const activeStoreId = storeId || import.meta.env.VITE_STORE_ID;
  const orderNumber = `PED-${Math.floor(1000 + Math.random() * 9000)}`;

  let storeName = 'Pastelería';
  let phoneNumber = '5493815689490';

  // 1. Obtener datos de la tienda activa
  try {
    if (activeStoreId) {
      const { data: storeData } = await supabase
        .from('stores')
        .select('name, whatsapp_phone')
        .eq('id', activeStoreId)
        .single();

      if (storeData) {
        storeName = storeData.name || storeName;
        phoneNumber = storeData.whatsapp_phone || phoneNumber;
      }
    }
  } catch (err) {
    console.error("Error al obtener la configuración de la tienda:", err);
  }

  try {
    // 2. Agrupar los productos regulares para descontar stock
    const itemsPorProducto = {};
    Object.values(cart).forEach(item => {
      const qty = parseInt(item?.quantity, 10) || 0;
      const isDynamicCustom = String(item?.productId || '').toLowerCase().startsWith('custom');
      
      if (qty > 0 && !isDynamicCustom) {
        const prodId = item.productId;
        if (!itemsPorProducto[prodId]) {
          itemsPorProducto[prodId] = [];
        }
        itemsPorProducto[prodId].push(item);
      }
    });

    // 3. Descontar stock en Supabase filtrado por tienda
    for (const [productId, items] of Object.entries(itemsPorProducto)) {
      let query = supabase
        .from('products')
        .select('variante')
        .eq('id', productId);

      if (activeStoreId) {
        query = query.eq('store_id', activeStoreId);
      }

      const { data: currentProduct, error: fetchError } = await query.single();

      if (fetchError || !currentProduct) {
        console.error("Error al obtener stock del producto:", fetchError);
        continue;
      }

      let variantes = currentProduct.variante;
      if (typeof variantes === 'string') {
        try { variantes = JSON.parse(variantes); } catch { variantes = []; }
      }

      const variantesActualizadas = (variantes || []).map(v => {
        const itemComprado = items.find(i => {
          const rawVariantId = String(i.variantId || '').split('_')[0];
          return String(v.id) === rawVariantId || String(v.id) === String(i.variantId);
        });

        if (itemComprado) {
          const stockActual = parseInt(v.stock, 10) || 0;
          const nuevoStock = Math.max(0, stockActual - itemComprado.quantity);
          return { ...v, stock: nuevoStock };
        }
        return v;
      });

      let updateQuery = supabase
        .from('products')
        .update({ variante: variantesActualizadas })
        .eq('id', productId);

      if (activeStoreId) {
        updateQuery = updateQuery.eq('store_id', activeStoreId);
      }

      const { error: updateError } = await updateQuery;

      if (updateError) {
        console.error("Error al actualizar stock:", updateError);
      }
    }
  } catch (err) {
    console.error("Error al procesar el descuento de stock:", err);
  }

  // 4. Generar la lista de productos
  let productsListText = '';
  let requiereFotoDiseno = false;

  Object.values(cart).forEach((item) => {
    const qty = parseInt(item?.quantity, 10) || 0;
    if (qty > 0) {
      const name = item.productName || item.name || 'Dulce';
      const isCustomCake = String(item?.productId || '').toLowerCase().startsWith('custom') || 
                           name.toUpperCase().includes('PERSONALIZADA');
      const isMiniTorta = name.toLowerCase().includes('mini torta') || 
                          name.toLowerCase().includes('minitorta') || 
                          name.toLowerCase().includes('mini');

      if (isCustomCake || isMiniTorta) {
        requiereFotoDiseno = true;
      }

      const price = parseFloat(item.price) || 0;
      const totalLine = price * qty;

      if (isCustomCake) {
        productsListText += `🎂 *${name}*\n`;
        productsListText += `   ↳ *Detalle:* ${item.variantLabel || 'Personalizada'}\n`;
        productsListText += `   ↳ *Precio base:* $${totalLine.toLocaleString('es-AR')}\n\n`;
      } else if (isMiniTorta) {
        productsListText += `🧁 *${name}*\n`;
        if (item.filling) {
          productsListText += `   ↳ *Relleno extra:* ${item.filling}\n`;
        } else if (item.variantLabel && !item.variantLabel.toLowerCase().includes('unidad')) {
          productsListText += `   ↳ *Detalle:* ${item.variantLabel}\n`;
        }
        productsListText += `   ↳ *Cantidad:* ${qty} un. - $${totalLine.toLocaleString('es-AR')}\n\n`;
      } else {
        const variant = item.variantLabel ? ` (${item.variantLabel})` : '';
        productsListText += `• ${qty}x ${name}${variant} - $${totalLine.toLocaleString('es-AR')}\n`;
      }
    }
  });

  // 5. Armado del mensaje
  let message = `🧁 *Nuevo Pedido - ${storeName}*\n`;
  message += `🔖 *NRO:* #${orderNumber}\n\n`;
  message += `👤 *Cliente:* ${formData.name}\n`;
  message += `📱 *Celular:* ${formData.phone}\n`;
  message += `📦 *Entrega:* ${formData.deliveryType || 'Retiro en tienda'}\n`;
  message += `💳 *Forma de Pago:* ${formData.paymentMethod}\n`;

  const finalAmount = totalFinal !== undefined ? totalFinal : (subtotal || 0);

  if (formData.paymentMethod === 'Efectivo') {
    const cash = parseFloat(formData.cashAmount) || 0;
    const vuelto = cash - finalAmount;
    message += `💵 *Paga con:* $${cash.toLocaleString('es-AR')}\n`;
    message += vuelto > 0 ? `🪙 *Llevar vuelto de:* $${vuelto.toLocaleString('es-AR')}\n` : `🪙 *Paga justo, no llevar vuelto.*\n`;
  }

  if (formData.notes && formData.notes.trim()) {
    message += `💬 *Notas:* ${formData.notes.trim()}\n`;
  }

  message += `\n🛒 *Detalle del Pedido:*\n${productsListText.trim()}\n\n`;
  message += `Subtotal: $${(subtotal || finalAmount).toLocaleString('es-AR')}\n`;

  if (discountAmount > 0) {
    message += `🏷️ *Descuento ${discountPaymentMethod} (${discountPercent}% OFF):* -$${discountAmount.toLocaleString('es-AR')}\n`;
    message += `💰 *TOTAL FINAL CON DESCUENTO:* $${finalAmount.toLocaleString('es-AR')}`;
  } else {
    message += `💰 *TOTAL APROXIMADO:* $${finalAmount.toLocaleString('es-AR')}`;
  }

  if (requiereFotoDiseno) {
    message += `\n\n⚠️ _*Nota:* El valor inicial está sujeto a modificaciones según la complejidad del diseño y cambios en bizcochuelos o rellenos._`;
    message += `\n📸 *Foto del diseño:* A continuación te adjunto la imagen o foto de referencia del diseño que me gustaría para mi pedido.`;
  }

  const cleanTargetPhone = phoneNumber.replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(message.normalize('NFC'));
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanTargetPhone}&text=${encodedMessage}`;

  window.open(whatsappUrl, '_blank');
};