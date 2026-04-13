
const Order = require("../models/Order");
const User = require("../models/Users");

exports.getPendingOrders = async (req, res) => {
  try {
    const pedidosPendientes = await Order.find({
      estado: { $in: ["recibido", "confirmado"] },
    })
      .populate("clienteId", "nombre telefono direcciones")
      .sort({ createdAt: -1 });
    res.json(pedidosPendientes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener pedidos", error: error.message });
  }
};

exports.getEnviadosOrders = async (req, res) => {
  try {
    const pedidosEnviados = await Order.find({ estado: "enCamino" })
      .populate("clienteId", "nombre telefono direcciones")
      .sort({ createdAt: -1 });
    res.json(pedidosEnviados);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener pedidos enviados", error: error.message });
  }
};

exports.acceptOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await Order.findByIdAndUpdate(id, { estado: "confirmado" }, { new: true }).populate("clienteId", "nombre telefono");
    if (!pedido) return res.status(404).json({ message: "No se encontro el pedido." });

    let telefono = pedido.clienteId.telefono.replace(/\D/g, "");
    if (telefono.length === 10) telefono = "52" + telefono;

    const mensaje = "Hola " + pedido.clienteId.nombre + "! Tu pedido " + pedido.folio + " de Lenos Rellenos ha sido CONFIRMADO y esta en preparacion. Gracias por tu preferencia!";
    const whatsappUrl = "https://wa.me/" + telefono + "?text=" + encodeURIComponent(mensaje);

    res.json({ message: "Pedido confirmado!", whatsappUrl, pedido });
  } catch (error) {
    res.status(500).json({ message: "Error al aceptar", error: error.message });
  }
};

exports.sendOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await Order.findByIdAndUpdate(id, { estado: "enCamino" }, { new: true }).populate("clienteId", "nombre telefono");
    if (!pedido) return res.status(404).json({ message: "No se encontro el pedido." });

    let telefono = pedido.clienteId.telefono.replace(/\D/g, "");
    if (telefono.length === 10) telefono = "52" + telefono;

    const direccion = pedido.direccion ? pedido.direccion.calle + ", " + pedido.direccion.colonia : "Tu direccion";
    const mensaje = "Hola " + pedido.clienteId.nombre + "! Tu pedido " + pedido.folio + " ya va en camino! Destino: " + direccion + " Total: $" + pedido.total + ".00";
    const whatsappUrl = "https://wa.me/" + telefono + "?text=" + encodeURIComponent(mensaje);

    res.json({ message: "Pedido enviado!", whatsappUrl, pedido });
  } catch (error) {
    res.status(500).json({ message: "Error al enviar", error: error.message });
  }
};

exports.deliverOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await Order.findByIdAndUpdate(id, { estado: "entregado", fechaEntrega: new Date() }, { new: true }).populate("clienteId", "nombre telefono");
    if (!pedido) return res.status(404).json({ message: "No se encontro el pedido." });

    let telefono = pedido.clienteId.telefono.replace(/\D/g, "");
    if (telefono.length === 10) telefono = "52" + telefono;

    const mensaje = "Hola " + pedido.clienteId.nombre + "! Tu pedido " + pedido.folio + " ha sido ENTREGADO. Gracias por elegir Lenos Rellenos!";
    const whatsappUrl = "https://wa.me/" + telefono + "?text=" + encodeURIComponent(mensaje);

    res.json({ message: "Pedido entregado!", whatsappUrl, pedido });
  } catch (error) {
    res.status(500).json({ message: "Error al entregar", error: error.message });
  }
};

exports.rejectOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await Order.findByIdAndUpdate(id, { estado: "cancelado" }, { new: true });
    if (!pedido) return res.status(404).json({ message: "Pedido no encontrado." });
    res.json({ message: "Pedido cancelado.", pedido });
  } catch (error) {
    res.status(500).json({ message: "Error al cancelar", error: error.message });
  }
};

exports.getCompletedOrders = async (req, res) => {
  try {
    const entregados = await Order.find({ estado: "entregado" })
      .populate("clienteId", "nombre telefono")
      .sort({ updatedAt: -1 });
    res.json(entregados);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener historial" });
  }
};