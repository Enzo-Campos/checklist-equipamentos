import client from './client';

export function listAdministradores() {
  return client.get('/administradores').then((res) => res.data);
}

export function createAdministrador({ nome, email, senha }) {
  return client.post('/administradores', { nome, email, senha }).then((res) => res.data);
}
