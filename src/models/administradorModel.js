const pool = require('../config/db');

async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM administradores WHERE email = ?', [email]);
  return rows[0];
}

module.exports = { findByEmail };
