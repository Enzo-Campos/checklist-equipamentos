const express = require('express');
const { requireAdmin } = require('../middlewares/auth');
const { optionalAdmin } = require('../middlewares/optionalAdmin');
const { requireFuncionarioPin } = require('../middlewares/verifyPin');
const controller = require('../controllers/comandaController');

const router = express.Router();

router.get('/minhas', controller.listMinhas);
router.get('/historico', requireAdmin, controller.listHistorico);
router.get('/:id/pdf', controller.gerarPdf);
router.get('/:id', optionalAdmin, controller.getOne);
router.post('/', requireFuncionarioPin, controller.create);
router.patch('/:id/concluir', requireFuncionarioPin, controller.concluir);
router.delete('/:id', requireAdmin, controller.cancelar);

module.exports = router;
