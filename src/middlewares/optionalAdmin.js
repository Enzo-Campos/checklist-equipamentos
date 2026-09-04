const jwt = require('jsonwebtoken');

// Não bloqueia a requisição: só popula req.admin quando há um token de Admin válido.
// Usado em rotas de leitura que têm um comportamento a mais para Admin, mas continuam
// acessíveis a funcionários sem login (ver "Estratégia de autenticação").
function optionalAdmin(req, res, next) {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    try {
      const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET);
      if (payload.role === 'admin') {
        req.admin = payload;
      }
    } catch (err) {
      // token ausente/expirado: segue como não-admin
    }
  }
  next();
}

module.exports = { optionalAdmin };
