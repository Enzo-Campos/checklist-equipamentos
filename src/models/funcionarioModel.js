const bcrypt = require('bcrypt');
const pool = require('../config/db');

async function listAtivos() {
  const [rows] = await pool.query(
    'SELECT id, nome, role, status, created_at FROM funcionarios WHERE status = "ativo" ORDER BY nome'
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, nome, role, status, created_at FROM funcionarios WHERE id = ?',
    [id]
  );
  return rows[0];
}

// Uso interno do middleware de PIN — inclui o pin_hash, nunca exposto pela API (ver CRUD.md)
async function findAtivoComPin(id) {
  const [rows] = await pool.query(
    'SELECT id, nome, pin_hash FROM funcionarios WHERE id = ? AND status = "ativo"',
    [id]
  );
  return rows[0];
}

async function create({ nome, role, pin }) {
  const pinHash = await bcrypt.hash(String(pin), 10);
  const [result] = await pool.query(
    'INSERT INTO funcionarios (nome, role, pin_hash) VALUES (?, ?, ?)',
    [nome, role, pinHash]
  );
  return findById(result.insertId);
}

async function update(id, { nome, role }) {
  await pool.query('UPDATE funcionarios SET nome = ?, role = ? WHERE id = ?', [nome, role, id]);
  return findById(id);
}

async function resetPin(id, pin) {
  const pinHash = await bcrypt.hash(String(pin), 10);
  await pool.query('UPDATE funcionarios SET pin_hash = ? WHERE id = ?', [pinHash, id]);
  return findById(id);
}

async function softDelete(id) {
  await pool.query('UPDATE funcionarios SET status = "inativo" WHERE id = ?', [id]);
}

module.exports = { listAtivos, findById, findAtivoComPin, create, update, resetPin, softDelete };
