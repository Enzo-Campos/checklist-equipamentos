import client from './client';

export function login(email, senha) {
  return client.post('/auth/login', { email, senha }).then((res) => res.data);
}
