const clienteModel = require('../models/clienteModel');

async function list(req, res, next) {
  try {
    res.json(await clienteModel.listAtivos());
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { nome } = req.body;
    if (!nome) {
      return res.status(400).json({ error: 'nome é obrigatório' });
    }
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const cliente = await clienteModel.create({ nome, image });
    res.status(201).json(cliente);
  } catch (err) {
    next(err);
  }
}

async function updateImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'imagem é obrigatória' });
    }
    const image = `/uploads/${req.file.filename}`;
    const cliente = await clienteModel.updateImage(req.params.id, image);
    res.json(cliente);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await clienteModel.softDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, updateImage, remove };
