import client from './client';

export function listClientes() {
  return client.get('/clientes').then((res) => res.data);
}

export function createCliente({ nome, imageFile }) {
  const form = new FormData();
  form.append('nome', nome);
  if (imageFile) form.append('image', imageFile);
  return client.post('/clientes', form).then((res) => res.data);
}

export function updateClienteImagem(id, imageFile) {
  const form = new FormData();
  form.append('image', imageFile);
  return client.patch(`/clientes/${id}/image`, form).then((res) => res.data);
}

export function deleteCliente(id) {
  return client.delete(`/clientes/${id}`);
}
