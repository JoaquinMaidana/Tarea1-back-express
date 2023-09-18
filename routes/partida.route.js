const express = require('express');
const router = express.Router();
var VerifyToken = require('../auth/VerifyToken');
// Require al controlador ¿?¿?
const partida_controller = require('../controllers/partida.controller');
// Prueba
router.get('/test', partida_controller.test);

router.post('/partida', partida_controller.partida_create);

router.get('/partidas',partida_controller.partida_get)

router.get('/ganadores',partida_controller.jugadores_mas_partidas_ganadas)

router.put('/:id', partida_controller.partida_update);




module.exports = router;