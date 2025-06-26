const express = require('express');
const router = express.Router();
const AgendaController = require('../controllers/agenda.controller');
const verifyToken = require('../middleware/verifyToken');

router.post('/agenda', verifyToken, AgendaController.registrarAgenda);
router.get('/agendas/agendasCoordinador', verifyToken, AgendaController.obtenerPorCoordinador);
router.get('/domicilios', AgendaController.obtenerDomicilios);

module.exports = router;
