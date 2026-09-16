const express = require('express');
const authRoutes = require('./authRoutes');
const administradorRoutes = require('./administradorRoutes');
const clienteRoutes = require('./clienteRoutes');
const funcionarioRoutes = require('./funcionarioRoutes');
const itemRoutes = require('./itemRoutes');
const comandaRoutes = require('./comandaRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/administradores', administradorRoutes);
router.use('/clientes', clienteRoutes);
router.use('/funcionarios', funcionarioRoutes);
router.use('/itens', itemRoutes);
router.use('/comandas', comandaRoutes);

module.exports = router;
