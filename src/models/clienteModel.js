const pool = require('../config/db');

async function listAtivos() {
  const [rows] = await pool.query(
    'SELECT id, nome, image, status, created_at FROM clientes WHERE status = "ativo" ORDER BY nome'
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, nome, image, status, created_at FROM clientes WHERE id = ?',
    [id]
  );
  return rows[0];
}

async function create({ nome, image }) {
  const [result] = await pool.query('INSERT INTO clientes (nome, image) VALUES (?, ?)', [
    nome,
    image || null,
  ]);
  return findById(result.insertId);
}

// Regra: Update de Cliente só pode alterar a imagem (ver CRUD.md)
async function updateImage(id, image) {
  await pool.query('UPDATE clientes SET image = ? WHERE id = ?', [image, id]);
  return findById(id);
}

async function softDelete(id) {
  await pool.query('UPDATE clientes SET status = "inativo" WHERE id = ?', [id]);
}

module.exports = { listAtivos, findById, create, updateImage, softDelete };
