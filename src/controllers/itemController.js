const itemModel = require('../models/itemModel');

// ?disponivel=true retorna só itens que não estão numa comanda aberta agora
async function list(req, res, next) {
  try {
    const apenasDisponiveis = req.query.disponivel === 'true';
    res.json(await itemModel.listAtivos({ apenasDisponiveis }));
  } catch (err) {
    next(err);
  }
}

// Create é aberto a todos (RF05)
async function create(req, res, next) {
  try {
    const { nome } = req.body;
    if (!nome) {
      return res.status(400).json({ error: 'nome é obrigatório' });
    }
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    res.status(201).json(await itemModel.create({ nome, image }));
  } catch (err) {
    next(err);
  }
}

// Update restrito ao Admin (RF05): funcionário só cria itens novos, não edita existentes
async function update(req, res, next) {
  try {
    const { nome } = req.body;
    if (!nome) {
      return res.status(400).json({ error: 'nome é obrigatório' });
    }
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;
    res.json(await itemModel.update(req.params.id, { nome, image }));
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await itemModel.softDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, update, remove };
