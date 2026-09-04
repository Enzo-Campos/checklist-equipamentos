import client from './client';

export function listFuncionarios() {
  return client.get('/funcionarios').then((res) => res.data);
}

export function createFuncionario({ nome, role, pin }) {
  return client.post('/funcionarios', { nome, role, pin }).then((res) => res.data);
}

export function updateFuncionario(id, { nome, role }) {
  return client.patch(`/funcionarios/${id}`, { nome, role }).then((res) => res.data);
}

export function resetPinFuncionario(id, pin) {
  return client.patch(`/funcionarios/${id}/pin`, { pin }).then((res) => res.data);
}

export function deleteFuncionario(id) {
  return client.delete(`/funcionarios/${id}`);
}
