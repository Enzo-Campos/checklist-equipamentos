require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../src/config/db');

async function seed() {
  const [, , nome, email, senha] = process.argv;

  if (!nome || !email || !senha) {
    console.error('Uso: npm run seed:admin -- "Nome" email@exemplo.com senha123');
    process.exit(1);
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  await pool.query('INSERT INTO administradores (nome, email, senha_hash) VALUES (?, ?, ?)', [
    nome,
    email,
    senhaHash,
  ]);

  console.log('Administrador criado com sucesso.');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
