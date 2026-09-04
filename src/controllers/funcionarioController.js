const funcionarioModel = require('../models/funcionarioModel');

function isPinValido(pin) {
  return /^\d{4}$/.test(String(pin || ''));
}

async function list(req, res, next) {
  try {
    res.json(await funcionarioModel.listAtivos());
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { nome, role, pin } = req.body;
    if (!nome || !role || !isPinValido(pin)) {
      return res.status(400).json({ error: 'nome, role e pin (4 dígitos) são obrigatórios' });
    }
    res.status(201).json(await funcionarioModel.create({ nome, role, pin }));
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { nome, role } = req.body;
    if (!nome || !role) {
      return res.status(400).json({ error: 'nome e role são obrigatórios' });
    }
    res.json(await funcionarioModel.update(req.params.id, { nome, role }));
  } catch (err) {
    next(err);
  }
}

async function resetPin(req, res, next) {
  try {
    const { pin } = req.body;
    if (!isPinValido(pin)) {
      return res.status(400).json({ error: 'pin deve ter 4 dígitos' });
    }
    res.json(await funcionarioModel.resetPin(req.params.id, pin));
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await funcionarioModel.softDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, update, resetPin, remove };
