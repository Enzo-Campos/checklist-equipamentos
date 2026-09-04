import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { extractErrorMessage } from '../api/client';

export default function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);
    try {
      await login(email, senha);
      navigate('/admin/historico');
    } catch (err) {
      setErro(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shell" style={{ alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
      <div className="container" style={{ maxWidth: 420 }}>
        <Link to="/" className="eyebrow" style={{ textDecoration: 'none' }}>
          ← voltar
        </Link>
        <div className="tag-card rise" style={{ marginTop: 16 }}>
          <span className="eyebrow">Acesso restrito</span>
          <h2 style={{ marginTop: 6, marginBottom: 20 }}>Login Admin</h2>

          <form className="stack" onSubmit={submit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="senha">Senha</label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            {erro && <div className="error-banner">{erro}</div>}

            <button className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
