import { useEffect, useState } from 'react';
import * as funcionariosApi from '../../api/funcionarios';
import { extractErrorMessage } from '../../api/client';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';

export default function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState(null);
  const [erro, setErro] = useState(null);
  const [nome, setNome] = useState('');
  const [role, setRole] = useState('');
  const [pin, setPin] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [editando, setEditando] = useState(null);
  const [resetandoPin, setResetandoPin] = useState(null);
  const [novoPin, setNovoPin] = useState('');

  const carregar = () =>
    funcionariosApi.listFuncionarios().then(setFuncionarios).catch((e) => setErro(extractErrorMessage(e)));

  useEffect(() => {
    carregar();
  }, []);

  const criar = async (e) => {
    e.preventDefault();
    setErro(null);
    setSalvando(true);
    try {
      await funcionariosApi.createFuncionario({ nome, role, pin });
      setNome('');
      setRole('');
      setPin('');
      await carregar();
    } catch (err) {
      setErro(extractErrorMessage(err));
    } finally {
      setSalvando(false);
    }
  };

  const salvarEdicao = async () => {
    setErro(null);
    try {
      await funcionariosApi.updateFuncionario(editando.id, { nome: editando.nome, role: editando.role });
      setEditando(null);
      await carregar();
    } catch (err) {
      setErro(extractErrorMessage(err));
    }
  };

  const confirmarResetPin = async () => {
    setErro(null);
    try {
      await funcionariosApi.resetPinFuncionario(resetandoPin.id, novoPin);
      setResetandoPin(null);
      setNovoPin('');
    } catch (err) {
      setErro(extractErrorMessage(err));
    }
  };

  const remover = async (id) => {
    if (!confirm('Excluir este funcionário?')) return;
    setErro(null);
    try {
      await funcionariosApi.deleteFuncionario(id);
      await carregar();
    } catch (err) {
      setErro(extractErrorMessage(err));
    }
  };

  return (
    <div className="stack">
      <h2>Funcionários</h2>

      <form className="tag-card stack" onSubmit={criar}>
        <span className="eyebrow">Novo funcionário</span>
        <div className="row" style={{ alignItems: 'flex-end' }}>
          <div className="field" style={{ flex: 1, minWidth: 160 }}>
            <label>Nome</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div className="field" style={{ flex: 1, minWidth: 160 }}>
            <label>Cargo</label>
            <input type="text" value={role} onChange={(e) => setRole(e.target.value)} required />
          </div>
          <div className="field" style={{ width: 110 }}>
            <label>PIN (4 dígitos)</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              required
            />
          </div>
          <button className="btn btn-primary" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Adicionar'}
          </button>
        </div>
      </form>

      {erro && <div className="error-banner">{erro}</div>}

      {funcionarios === null && <Loader label="Carregando funcionários" />}
      {funcionarios && funcionarios.length === 0 && (
        <EmptyState title="Nenhum funcionário cadastrado" />
      )}

      {funcionarios && funcionarios.length > 0 && (
        <div className="tag-card" style={{ padding: 0, overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Cargo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {funcionarios.map((f) =>
                editando?.id === f.id ? (
                  <tr key={f.id}>
                    <td>
                      <input
                        type="text"
                        value={editando.nome}
                        onChange={(e) => setEditando({ ...editando, nome: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editando.role}
                        onChange={(e) => setEditando({ ...editando, role: e.target.value })}
                      />
                    </td>
                    <td className="row">
                      <button className="btn btn-primary btn-sm" onClick={salvarEdicao}>
                        Salvar
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditando(null)}>
                        Cancelar
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={f.id}>
                    <td>{f.nome}</td>
                    <td>{f.role}</td>
                    <td className="row">
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditando(f)}>
                        Editar
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setResetandoPin(f)}>
                        Redefinir PIN
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => remover(f.id)}>
                        Excluir
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      {resetandoPin && (
        <Modal title={`Novo PIN — ${resetandoPin.nome}`} onClose={() => setResetandoPin(null)}>
          <div className="stack">
            <div className="field">
              <label>PIN (4 dígitos)</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={novoPin}
                onChange={(e) => setNovoPin(e.target.value.replace(/\D/g, ''))}
                autoFocus
              />
            </div>
            <button className="btn btn-primary btn-block" onClick={confirmarResetPin} disabled={novoPin.length !== 4}>
              Salvar novo PIN
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
