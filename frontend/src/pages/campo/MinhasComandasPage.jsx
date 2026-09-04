import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as comandasApi from '../../api/comandas';
import { useFuncionario } from '../../context/FuncionarioContext';
import { extractErrorMessage } from '../../api/client';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import StatusStamp from '../../components/StatusStamp';

function formatarData(iso) {
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

export default function MinhasComandasPage() {
  const { funcionario } = useFuncionario();
  const [comandas, setComandas] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    comandasApi
      .listMinhasComandas(funcionario.id)
      .then(setComandas)
      .catch((e) => setErro(extractErrorMessage(e)));
  }, [funcionario.id]);

  return (
    <div className="stack">
      <div className="spread">
        <h2>Minhas comandas</h2>
        <Link to="/campo/nova" className="btn btn-primary btn-sm">
          + Nova
        </Link>
      </div>

      {erro && <div className="error-banner">{erro}</div>}
      {comandas === null && <Loader label="Carregando comandas" />}
      {comandas && comandas.length === 0 && (
        <EmptyState title="Nenhuma comanda aberta" hint="Toque em “Nova” para montar um checklist." />
      )}

      <div className="stack">
        {comandas &&
          comandas.map((c) => (
            <Link key={c.id} to={`/campo/comandas/${c.id}`} className="tag-card" style={{ textDecoration: 'none' }}>
              <div className="spread">
                <div>
                  <span className="eyebrow mono">Comanda #{c.id}</span>
                  <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.05rem', marginTop: 4 }}>
                    {c.cliente_nome}
                  </p>
                  <span className="eyebrow">{formatarData(c.created_at)}</span>
                </div>
                <StatusStamp status={c.status} />
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
