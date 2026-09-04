const express = require('express');
const { requireAdmin } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const controller = require('../controllers/itemController');

const router = express.Router();

router.get('/', controller.list);
router.post('/', upload.single('image'), controller.create); // Todos podem criar (RF05)
router.patch('/:id', requireAdmin, upload.single('image'), controller.update); // só Admin edita
router.delete('/:id', requireAdmin, controller.remove);

module.exports = router;
