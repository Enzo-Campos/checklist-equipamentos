const pool = require('../config/db');

// em_uso: item está em alguma comanda com status 'aberta' agora (base pra RN01)
async function listAtivos({ apenasDisponiveis = false } = {}) {
  const [rows] = await pool.query(
    `SELECT i.id, i.nome, i.image, i.status, i.created_at,
            EXISTS (
              SELECT 1 FROM comanda_itens ci
              JOIN comandas c ON c.id = ci.id_comanda
              WHERE ci.id_item = i.id AND c.status = 'aberta'
            ) AS em_uso
     FROM itens i
     WHERE i.status = 'ativo'
     ${apenasDisponiveis ? 'HAVING em_uso = 0' : ''}
     ORDER BY i.nome`
  );
  return rows.map((row) => ({ ...row, em_uso: Boolean(row.em_uso) }));
}

async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, nome, image, status, created_at FROM itens WHERE id = ?',
    [id]
  );
  return rows[0];
}

async function create({ nome, image }) {
  const [result] = await pool.query('INSERT INTO itens (nome, image) VALUES (?, ?)', [
    nome,
    image || null,
  ]);
  return findById(result.insertId);
}

async function update(id, { nome, image }) {
  await pool.query('UPDATE itens SET nome = ?, image = ? WHERE id = ?', [nome, image, id]);
  return findById(id);
}

async function softDelete(id) {
  await pool.query('UPDATE itens SET status = "inativo" WHERE id = ?', [id]);
}

// RN01: item não pode estar em duas comandas abertas ao mesmo tempo
async function isEmComandaAberta(id, connection = pool) {
  const [rows] = await connection.query(
    `SELECT ci.id FROM comanda_itens ci
     JOIN comandas c ON c.id = ci.id_comanda
     WHERE ci.id_item = ? AND c.status = 'aberta'
     LIMIT 1`,
    [id]
  );
  return rows.length > 0;
}

module.exports = { listAtivos, findById, create, update, softDelete, isEmComandaAberta };
