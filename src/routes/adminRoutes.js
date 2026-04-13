
const express = require("express");
const adminController = require("../controllers/adminController");
const { verificarToken, verificarAdmin } = require("../middlewares/auth");

const router = express.Router();

// Ver pedidos pendientes (recibido + confirmado)
router.get(
  "/pending",
  verificarToken,
  verificarAdmin,
  adminController.getPendingOrders
);

// Ver pedidos en camino (enviados)
router.get(
  "/enviados",
  verificarToken,
  verificarAdmin,
  adminController.getEnviadosOrders
);

// Historial de entregados
router.get(
  "/completed",
  verificarToken,
  verificarAdmin,
  adminController.getCompletedOrders
);

// Aceptar/Confirmar pedido (recibido -> confirmado)
router.put(
  "/accept/:id",
  verificarToken,
  verificarAdmin,
  adminController.acceptOrder
);

// Rechazar pedido
router.put(
  "/reject/:id",
  verificarToken,
  verificarAdmin,
  adminController.rejectOrder
);

// Marcar como enviado/en camino (confirmado -> enCamino)
router.put(
  "/complete/:id",
  verificarToken,
  verificarAdmin,
  adminController.sendOrder
);

// Marcar como entregado (enCamino -> entregado)
router.put(
  "/deliver/:id",
  verificarToken,
  verificarAdmin,
  adminController.deliverOrder
);

module.exports = router;