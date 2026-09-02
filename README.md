# 🧁 Pasteleria - Sistema de Automatización de Pedidos

Aplicación web interactiva desarrollada para la pastelería artesanal **Candela Garbini**. Permite a los clientes explorar productos, personalizar pedidos (porciones, variantes y rellenos) y generar el resumen formal de compra directamente vía WhatsApp, descontando stock en tiempo real.

---

## ✨ Características Principales

* **Catálogo por Categorías:** Navegación dinámica con buscador interactivo y visualización clara de disponibilidad de stock.
* **Constructor de Pedidos & Modales:** Selección modular de porciones, variantes y combinaciones de múltiples rellenos.
* **Tortas Personalizadas:** Módulo dedicado para cotización de tortas a medida según porciones y diseño de referencia.
* **Carrito y Checkout Reactivo:** Cálculo dinámico de importes con soporte para promociones automáticas (% OFF según método de pago) y discriminación de vuelto en efectivo.
* **Integración con WhatsApp:** Generación automática del mensaje estructurado con código de pedido único (`#PED-XXXX`) y codificación de emojis UTF-8.
* **Panel Administrativo:** Gestión de inventario, actualización de stock, promociones y catálogo con Supabase.
* **Diseño Mobile-First:** Interfaz adaptativa con optimización para pantallas táctiles y soporte de *safe-area* en dispositivos móviles.

---

## 🛠️ Tecnologías Utilizadas

* **Frontend:** React + Vite
* **Estilos & UI:** Tailwind CSS + Lucide React (iconografía)
* **Base de Datos & Backend:** Supabase (PostgreSQL, Row Level Security)
* **Control de Versiones:** Git & GitHub

---

## 🚀 Instalación y Puesta en Marcha

### 1. Clonar el repositorio
```bash
git clone [https://github.com/celestemariel28/automatizacion-pedidos.git](https://github.com/celestemariel28/automatizacion-pedidos.git)
cd automatizacion-pedidos/Pasteleria