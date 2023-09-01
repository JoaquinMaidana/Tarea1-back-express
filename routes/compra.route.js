const express = require('express');
const router = express.Router();
var VerifyToken = require('../auth/VerifyToken');
// Require al controlador ¿?¿?
const compra_controller = require('../controllers/compra.controller');
// Prueba
router.get('/test', compra_controller.test);

router.post('/compra', compra_controller.compra_create);

router.get('/compras',compra_controller.compra_get)

router.get('/compras/usuario/:idUsuario',VerifyToken, compra_controller.compra_usuario);

router.get('/compras/producto/:idProducto', compra_controller.compra_producto);



module.exports = router;