const comandaModel = require('../models/comandaModel');
const { gerarPdfComanda } = require('../utils/pdfGenerator');

async function create(req, res, next) {
  try {
    const { id_cliente, id_itens } = req.body;
    if (!id_cliente || !Array.isArray(id_itens) || id_itens.length === 0) {
      return res.status(400).json({ error: 'id_cliente e id_itens (lista) são obrigatórios' });
    }

    const comanda = await comandaModel.create({
      id_funcionario: req.funcionario.id,
      id_cliente,
      id_itens,
    });
    res.status(201).json(comanda);
  } catch (err) {
    next(err);
  }
}

// Leitura livre por nome, sem PIN (ver "Estratégia de autenticação")
async function listMinhas(req, res, next) {
  try {
    const { id_funcionario } = req.query;
    if (!id_funcionario) {
      return res.status(400).json({ error: 'id_funcionario é obrigatório' });
    }
    res.json(await comandaModel.listAbertasPorFuncionario(id_funcionario));
  } catch (err) {
    next(err);
  }
}

// Admin vê qualquer comanda; funcionário só a própria (passando ?id_funcionario=)
async function getOne(req, res, next) {
  try {
    const comanda = await comandaModel.findById(req.params.id);
    if (!comanda) {
      return res.status(404).json({ error: 'Comanda não encontrada' });
    }

    const isAdmin = Boolean(req.admin);
    const idFuncionario = req.query.id_funcionario;
    const isDono = idFuncionario && Number(idFuncionario) === comanda.id_funcionario;

    if (!isAdmin && !isDono) {
      return res.status(403).json({ error: 'Sem permissão para ver esta comanda' });
    }

    res.json(comanda);
  } catch (err) {
    next(err);
  }
}

async function listHistorico(req, res, next) {
  try {
    const { id_cliente, id_funcionario } = req.query;
    res.json(await comandaModel.listHistorico({ id_cliente, id_funcionario }));
  } catch (err) {
    next(err);
  }
}

// Concluir exige PIN válido (middleware) e só o funcionário dono da comanda pode concluir
async function concluir(req, res, next) {
  try {
    const comanda = await comandaModel.findById(req.params.id);
    if (!comanda) {
      return res.status(404).json({ error: 'Comanda não encontrada' });
    }
    if (comanda.id_funcionario !== req.funcionario.id) {
      return res.status(403).json({ error: 'Você só pode concluir suas próprias comandas' });
    }
    if (comanda.status !== 'aberta') {
      return res.status(409).json({ error: 'Comanda não está aberta' });
    }
    res.json(await comandaModel.concluir(req.params.id));
  } catch (err) {
    next(err);
  }
}

// Soft delete: apenas Admin (RN03)
async function cancelar(req, res, next) {
  try {
    await comandaModel.cancelar(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function gerarPdf(req, res, next) {
  try {
    const comanda = await comandaModel.findById(req.params.id);
    if (!comanda) {
      return res.status(404).json({ error: 'Comanda não encontrada' });
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=comanda-${comanda.id}.pdf`);
    gerarPdfComanda(comanda, res);
  } catch (err) {
    next(err);
  }
}

module.exports = { create, getOne, listMinhas, listHistorico, concluir, cancelar, gerarPdf };
