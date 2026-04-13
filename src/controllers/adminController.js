
const Order = require("../models/Order");

// GET /api/admin/pending - Pedidos pendientes y confirmados
exports.getPendingOrders = async (req, res) => {
  try {
    const pedidos = await Order.find({
      estado: { $in: ["recibido", "confirmado"] }
    }).populate("clienteId");
    res.json(pedidos);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    res.status(500).json({ message: "Error al obtener pedidos" });
  }
};

// GET /api/admin/enviados - Pedidos en camino
exports.getEnviadosOrders = async (req, res) => {
  try {
    const pedidos = await Order.find({
      estado: "enCamino"  // ← Estado correcto según tu schema
    }).populate("clienteId");
    res.json(pedidos);
  } catch (error) {
    console.error("Error al obtener pedidos en camino:", error);
    res.status(500).json({ message: "Error al obtener pedidos en camino" });
  }
};

// GET /api/admin/completed - Pedidos entregados
exports.getCompletedOrders = async (req, res) => {
  try {
    const pedidos = await Order.find({
      estado: "entregado"
    }).populate("clienteId");
    res.json(pedidos);
  } catch (error) {
    console.error("Error al obtener pedidos completados:", error);
    res.status(500).json({ message: "Error al obtener pedidos completados" });
  }
};

// PUT /api/admin/accept/:id - Aceptar pedido (recibido → confirmado)
exports.acceptOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await Order.findByIdAndUpdate(
      id,
      { estado: "confirmado" },
      { new: true }
    ).populate("clienteId");

    if (!pedido) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    const whatsappUrl = generarURLWhatsApp(pedido, "confirmado");
    res.json({ message: "Pedido aceptado ✅", pedido, whatsappUrl });
  } catch (error) {
    console.error("Error al aceptar pedido:", error);
    res.status(500).json({ message: "Error al aceptar pedido" });
  }
};

// PUT /api/admin/reject/:id - Rechazar/Cancelar pedido
exports.rejectOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await Order.findByIdAndUpdate(
      id,
      { estado: "cancelado" },  // ← Usa "cancelado" según tu schema
      { new: true }
    ).populate("clienteId");

    if (!pedido) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    res.json({ message: "Pedido cancelado", pedido });
  } catch (error) {
    console.error("Error al rechazar pedido:", error);
    res.status(500).json({ message: "Error al rechazar pedido" });
  }
};

// PUT /api/admin/complete/:id - Enviar pedido (confirmado → enCamino)
exports.sendOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await Order.findByIdAndUpdate(
      id,
      { estado: "enCamino" },  // ← Estado correcto
      { new: true }
    ).populate("clienteId");

    if (!pedido) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    const whatsappUrl = generarURLWhatsApp(pedido, "enCamino");
    res.json({ message: "Pedido en camino 🚴", pedido, whatsappUrl });
  } catch (error) {
    console.error("Error al enviar pedido:", error);
    res.status(500).json({ message: "Error al enviar pedido" });
  }
};

// PUT /api/admin/deliver/:id - Entregar pedido (enCamino → entregado)
exports.deliverOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await Order.findByIdAndUpdate(
      id,
      { 
        estado: "entregado",
        fechaEntrega: new Date()  // ← Registra fecha de entrega
      },
      { new: true }
    ).populate("clienteId");

    if (!pedido) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    const whatsappUrl = generarURLWhatsApp(pedido, "entregado");
    res.json({ message: "Pedido entregado ✅", pedido, whatsappUrl });
  } catch (error) {
    console.error("Error al entregar pedido:", error);
    res.status(500).json({ message: "Error al entregar pedido" });
  }
};

// Función auxiliar para WhatsApp
const generarURLWhatsApp = (pedido, estado) => {
  const telefono = pedido.clienteId?.telefono?.replace(/\D/g, "");
  if (!telefono) return null;
  
  const mensajes = {
    confirmado: `🔥 ¡Hola ${pedido.clienteId?.nombre}! Tu pedido #${pedido.folio} ha sido CONFIRMADO y lo estamos preparando.`,
    enCamino: `🚴 ¡${pedido.clienteId?.nombre}! Tu pedido #${pedido.folio} ya va EN CAMINO.`,
    entregado: `✅ ¡Gracias ${pedido.clienteId?.nombre}! Tu pedido #${pedido.folio} ha sido ENTREGADO. ¡Disfrútalo!`
  };
  
  return `https://wa.me/${telefono}?text=${encodeURIComponent(mensajes[estado] || "")}`;
};