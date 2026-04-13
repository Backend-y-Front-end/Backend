const express = require("express");
const adminController = require("../controllers/adminController");
const { verificarToken, verificarAdmin } = require("../middlewares/auth");

const router = express.Router();

router.get("/pending", verificarToken, verificarAdmin, adminController.getPendingOrders);
router.get("/enviados", verificarToken, verificarAdmin, adminController.getEnviadosOrders);
router.put("/accept/:id", verificarToken, verificarAdmin, adminController.acceptOrder);
router.put("/reject/:id", verificarToken, verificarAdmin, adminController.rejectOrder);
router.put("/complete/:id", verificarToken, verificarAdmin, adminController.sendOrder);
router.put("/deliver/:id", verificarToken, verificarAdmin, adminController.deliverOrder);
router.get("/completed", verificarToken, verificarAdmin, adminController.getCompletedOrders);

module.exports = router;