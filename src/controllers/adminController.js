import Pedido from "../models/Pedido.js";
import Cliente from "../models/Cliente.js";

// GET /api/admin/pending - Obtener todos los pedidos pendientes y confirmados
export const getPendingPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find({
      estado: { $in: ["recibido", "confirmado"] }
    }).populate("clienteId");

    res.json(pedidos);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    res.status(500).json({ message: "Error al obtener pedidos" });
  }
};

// PUT /api/admin/accept/:id - Aceptar/validar un pedido (cambiar de "recibido" a "confirmado")
export const acceptPedido = async (req, res) => {
  try {
    const { id } = req.params;

    const pedido = await Pedido.findByIdAndUpdate(
      id,
      { estado: "confirmado" },
      { new: true }
    ).populate("clienteId");

    if (!pedido) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    // Aquí iría la lógica de envío de WhatsApp
    const whatsappUrl = generarURLWhatsApp(pedido);

    res.json({ message: "Pedido aceptado", pedido, whatsappUrl });
  } catch (error) {
    console.error("Error al aceptar pedido:", error);
    res.status(500).json({ message: "Error al aceptar pedido" });
  }
};

// PUT /api/admin/complete/:id - Marcar pedido como completado/enviado
export const completePedido = async (req, res) => {
  try {
    const { id } = req.params;

    const pedido = await Pedido.findByIdAndUpdate(
      id,
      { estado: "enviado" },
      { new: true }
    ).populate("clienteId");

    if (!pedido) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    // Aquí iría la lógica de envío de WhatsApp
    const whatsappUrl = generarURLWhatsApp(pedido);

    res.json({ message: "Pedido completado", pedido, whatsappUrl });
  } catch (error) {
    console.error("Error al completar pedido:", error);
    res.status(500).json({ message: "Error al completar pedido" });
  }
};

// PUT /api/admin/reject/:id - Rechazar un pedido
export const rejectPedido = async (req, res) => {
  try {
    const { id } = req.params;

    const pedido = await Pedido.findByIdAndUpdate(
      id,
      { estado: "rechazado" },
      { new: true }
    ).populate("clienteId");

    if (!pedido) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    res.json({ message: "Pedido rechazado", pedido });
  } catch (error) {
    console.error("Error al rechazar pedido:", error);
    res.status(500).json({ message: "Error al rechazar pedido" });
  }
};

// Función auxiliar para generar URL de WhatsApp (ajusta según tu implementación)
const generarURLWhatsApp = (pedido) => {
  const telefono = pedido.clienteId?.telefono;
  const mensaje = `Hola ${pedido.clienteId?.nombre}, tu pedido #${pedido.folio} ha sido actualizado.`;
  const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
  return url;
};