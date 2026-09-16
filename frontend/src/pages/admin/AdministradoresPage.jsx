import { useEffect, useState } from 'react';
import * as administradoresApi from '../../api/administradores';
import { extractErrorMessage } from '../../api/client';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';

export default function AdministradoresPage() {
  const [administradores, setAdministradores] = useState(null);
  const [erro, setErro] = useState(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [salvando, setSalvando] = useState(false);

  const carregar = () =>
    administradoresApi
      .listAdministradores()
      .then(setAdministradores)
      .catch((e) => setErro(extractErrorMessage(e)));

  useEffect(() => {
    carregar();
  }, []);

  const criar = async (e) => {
    e.preventDefault();
    setErro(null);
    setSalvando(true);
    try {
      await administradoresApi.createAdministrador({ nome, email, senha });
      setNome('');
      setEmail('');
      setSenha('');
      await carregar();
    } catch (err) {
      setErro(extractErrorMessage(err));
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="stack">
      <div>
        <h1>Administradores</h1>
        <p style={{ marginTop: 4 }}>Contas com acesso total ao painel.</p>
      </div>

      <form className="tag-card stack" onSubmit={criar}>
        <span className="eyebrow">Novo administrador</span>
        <div className="row" style={{ alignItems: 'flex-end' }}>
          <div className="field" style={{ flex: 1, minWidth: 160 }}>
            <label>Nome</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div className="field" style={{ flex: 1, minWidth: 200 }}>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field" style={{ flex: 1, minWidth: 160 }}>
            <label>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              minLength={6}
              required
            />
          </div>
          <button className="btn btn-primary" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Adicionar'}
          </button>
        </div>
      </form>

      {erro && <div className="error-banner">{erro}</div>}

      {administradores === null && <Loader label="Carregando administradores" />}
      {administradores && administradores.length === 0 && (
        <EmptyState title="Nenhum administrador cadastrado" />
      )}

      {administradores && administradores.length > 0 && (
        <div className="tag-card" style={{ padding: 0, overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {administradores.map((a) => (
                <tr key={a.id}>
                  <td>{a.nome}</td>
                  <td>{a.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
