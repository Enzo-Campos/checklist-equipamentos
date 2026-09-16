const fs = require('fs');
const app = require('./src/app');

const SOCKET_PATH = process.env.SOCKET_PATH;
const PORT = process.env.PORT || 3000;

if (SOCKET_PATH) {
  if (fs.existsSync(SOCKET_PATH)) {
    fs.unlinkSync(SOCKET_PATH);
  }
  app.listen(SOCKET_PATH, () => {
    fs.chmodSync(SOCKET_PATH, '666');
    console.log(`Servidor rodando no socket ${SOCKET_PATH}`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}
