const express = require('express');
const router = express.Router();
// Require al controlador ¿?¿?
const usuario_controller = require('../controllers/usuario.controller');
// Prueba
router.get('/test', usuario_controller.test);

router.post('/create', usuario_controller.usuario_create);

router.get('/listado', usuario_controller.usuario_get);

router.get('/:id', usuario_controller.usuario_details);

router.put('/:id', usuario_controller.usuario_update);

router.delete('/:id', usuario_controller.usuario_delete);


module.exports = router;