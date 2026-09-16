const administradorModel = require('../models/administradorModel');

async function list(req, res, next) {
  try {
    res.json(await administradorModel.list());
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'nome, email e senha são obrigatórios' });
    }
    if (senha.length < 6) {
      return res.status(400).json({ error: 'senha deve ter ao menos 6 caracteres' });
    }

    const existente = await administradorModel.findByEmail(email);
    if (existente) {
      return res.status(409).json({ error: 'Já existe um administrador com esse email' });
    }

    res.status(201).json(await administradorModel.create({ nome, email, senha }));
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create };
