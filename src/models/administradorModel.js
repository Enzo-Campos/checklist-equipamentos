const bcrypt = require('bcrypt');
const pool = require('../config/db');

async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM administradores WHERE email = ?', [email]);
  return rows[0];
}

async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, nome, email, created_at FROM administradores WHERE id = ?',
    [id]
  );
  return rows[0];
}

async function list() {
  const [rows] = await pool.query(
    'SELECT id, nome, email, created_at FROM administradores ORDER BY nome'
  );
  return rows;
}

async function create({ nome, email, senha }) {
  const senhaHash = await bcrypt.hash(senha, 10);
  const [result] = await pool.query(
    'INSERT INTO administradores (nome, email, senha_hash) VALUES (?, ?, ?)',
    [nome, email, senhaHash]
  );
  return findById(result.insertId);
}

module.exports = { findByEmail, findById, list, create };
