const pool = require('../config/db');
const itemModel = require('./itemModel');

async function findById(id) {
  const [comandaRows] = await pool.query(
    `SELECT c.id, c.id_funcionario, c.id_cliente, c.status, c.created_at, c.concluded_at,
            cl.nome AS cliente_nome, f.nome AS funcionario_nome
     FROM comandas c
     JOIN clientes cl ON cl.id = c.id_cliente
     JOIN funcionarios f ON f.id = c.id_funcionario
     WHERE c.id = ?`,
    [id]
  );
  const comanda = comandaRows[0];
  if (!comanda) return null;

  const [itens] = await pool.query(
    `SELECT i.id, i.nome, i.image FROM comanda_itens ci
     JOIN itens i ON i.id = ci.id_item
     WHERE ci.id_comanda = ?`,
    [id]
  );
  comanda.itens = itens;
  return comanda;
}

// Create requer PIN válido (verificado no middleware) e valida RN01 dentro da transação
async function create({ id_funcionario, id_cliente, id_itens }) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    for (const idItem of id_itens) {
      const emUso = await itemModel.isEmComandaAberta(idItem, connection);
      if (emUso) {
        const err = new Error(`Item ${idItem} já está em uma comanda aberta`);
        err.status = 409;
        throw err;
      }
    }

    const [result] = await connection.query(
      'INSERT INTO comandas (id_funcionario, id_cliente) VALUES (?, ?)',
      [id_funcionario, id_cliente]
    );
    const idComanda = result.insertId;

    const values = id_itens.map((idItem) => [idComanda, idItem]);
    await connection.query('INSERT INTO comanda_itens (id_comanda, id_item) VALUES ?', [values]);

    await connection.commit();
    return findById(idComanda);
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

// Admin: aba de histórico completa (RF07 / RN02).
// id_cliente filtra a timeline de um cliente; id_funcionario filtra o uso por funcionário.
async function listHistorico({ id_cliente, id_funcionario } = {}) {
  const condicoes = [];
  const params = [];

  if (id_cliente) {
    condicoes.push('c.id_cliente = ?');
    params.push(id_cliente);
  }
  if (id_funcionario) {
    condicoes.push('c.id_funcionario = ?');
    params.push(id_funcionario);
  }

  const where = condicoes.length ? `WHERE ${condicoes.join(' AND ')}` : '';

  const [rows] = await pool.query(
    `SELECT c.id, c.status, c.created_at, c.concluded_at,
            cl.nome AS cliente_nome, f.nome AS funcionario_nome
     FROM comandas c
     JOIN clientes cl ON cl.id = c.id_cliente
     JOIN funcionarios f ON f.id = c.id_funcionario
     ${where}
     ORDER BY c.created_at DESC`,
    params
  );
  return rows;
}

// Funcionário: apenas as próprias comandas abertas (RN02)
async function listAbertasPorFuncionario(idFuncionario) {
  const [rows] = await pool.query(
    `SELECT c.id, c.status, c.created_at, cl.nome AS cliente_nome
     FROM comandas c
     JOIN clientes cl ON cl.id = c.id_cliente
     WHERE c.id_funcionario = ? AND c.status = 'aberta'
     ORDER BY c.created_at DESC`,
    [idFuncionario]
  );
  return rows;
}

async function concluir(id) {
  await pool.query(
    "UPDATE comandas SET status = 'concluida', concluded_at = NOW() WHERE id = ? AND status = 'aberta'",
    [id]
  );
  return findById(id);
}

async function cancelar(id) {
  await pool.query("UPDATE comandas SET status = 'cancelada' WHERE id = ?", [id]);
}

module.exports = {
  findById,
  create,
  listHistorico,
  listAbertasPorFuncionario,
  concluir,
  cancelar,
};
