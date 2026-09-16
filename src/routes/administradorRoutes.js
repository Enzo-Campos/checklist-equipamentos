const express = require('express');
const { requireAdmin } = require('../middlewares/auth');
const controller = require('../controllers/administradorController');

const router = express.Router();

router.get('/', requireAdmin, controller.list);
router.post('/', requireAdmin, controller.create);

module.exports = router;
