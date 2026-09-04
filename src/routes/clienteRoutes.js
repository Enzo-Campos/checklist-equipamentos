const express = require('express');
const { requireAdmin } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const controller = require('../controllers/clienteController');

const router = express.Router();

router.get('/', controller.list);
router.post('/', requireAdmin, upload.single('image'), controller.create);
router.patch('/:id/image', requireAdmin, upload.single('image'), controller.updateImage);
router.delete('/:id', requireAdmin, controller.remove);

module.exports = router;
