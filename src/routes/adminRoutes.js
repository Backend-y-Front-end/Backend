import express from "express";
import * as adminController from "../controllers/adminController.js";
import { verificarToken, verificarAdmin } from "../middlewares/auth.js";

const router = express.Router();

// Ver pedidos pendientes
router.get(
  "/pending",
  verificarToken,
  verificarAdmin,
  adminController.getPendingPedidos,
);

// Aceptar/Confirmar pedido
router.put(
  "/accept/:id",
  verificarToken,
  verificarAdmin,
  adminController.acceptPedido,
);

// Rechazar pedido
router.put(
  "/reject/:id",
  verificarToken,
  verificarAdmin,
  adminController.rejectPedido,
);

// Marcar como entregado
router.put(
  "/complete/:id",
  verificarToken,
  verificarAdmin,
  adminController.completePedido,
);

export default router;