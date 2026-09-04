const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const administradorModel = require('../models/administradorModel');

async function login(req, res, next) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ error: 'email e senha são obrigatórios' });
    }

    const admin = await administradorModel.findByEmail(email);
    if (!admin) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const valido = await bcrypt.compare(senha, admin.senha_hash);
    if (!valido) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ sub: admin.id, role: 'admin', nome: admin.nome }, process.env.JWT_SECRET, {
      expiresIn: '12h',
    });

    res.json({ token });
  } catch (err) {
    next(err);
  }
}

module.exports = { login };
