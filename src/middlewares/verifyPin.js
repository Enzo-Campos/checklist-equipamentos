const bcrypt = require('bcrypt');
const funcionarioModel = require('../models/funcionarioModel');

// Identificação por PIN (RF09 / Estratégia de autenticação): sem sessão, valida a cada ação.
async function requireFuncionarioPin(req, res, next) {
  const { id_funcionario, pin } = req.body;

  if (!id_funcionario || !pin) {
    return res.status(400).json({ error: 'id_funcionario e pin são obrigatórios' });
  }

  try {
    const funcionario = await funcionarioModel.findAtivoComPin(id_funcionario);
    if (!funcionario) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }

    const valido = await bcrypt.compare(String(pin), funcionario.pin_hash);
    if (!valido) {
      return res.status(401).json({ error: 'PIN inválido' });
    }

    req.funcionario = { id: funcionario.id, nome: funcionario.nome };
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { requireFuncionarioPin };
