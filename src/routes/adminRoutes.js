
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

// Historial de entregados
router.get(
  "/completed",
  verificarToken,
  verificarAdmin,
  adminController.getCompletedOrders
);

module.exports = router;