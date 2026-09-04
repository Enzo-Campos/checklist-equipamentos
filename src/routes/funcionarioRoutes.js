const express = require('express');
const { requireAdmin } = require('../middlewares/auth');
const controller = require('../controllers/funcionarioController');

const router = express.Router();

router.get('/', controller.list);
router.post('/', requireAdmin, controller.create);
router.patch('/:id', requireAdmin, controller.update);
router.patch('/:id/pin', requireAdmin, controller.resetPin);
router.delete('/:id', requireAdmin, controller.remove);

module.exports = router;
