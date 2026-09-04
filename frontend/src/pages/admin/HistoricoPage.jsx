import { useEffect, useState } from 'react';
import * as comandasApi from '../../api/comandas';
import * as clientesApi from '../../api/clientes';
import * as funcionariosApi from '../../api/funcionarios';
import { extractErrorMessage } from '../../api/client';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import StatusStamp from '../../components/StatusStamp';

function formatarData(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

export default function HistoricoPage() {
  const [comandas, setComandas] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroFuncionario, setFiltroFuncionario] = useState('');
  const [erro, setErro] = useState(null);

  useEffect(() => {
    clientesApi.listClientes().then(setClientes).catch(() => {});
    funcionariosApi.listFuncionarios().then(setFuncionarios).catch(() => {});
  }, []);

  const carregar = () => {
    setErro(null);
    comandasApi
      .listHistorico({ id_cliente: filtroCliente || undefined, id_funcionario: filtroFuncionario || undefined })
      .then(setComandas)
      .catch((e) => setErro(extractErrorMessage(e)));
  };

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroCliente, filtroFuncionario]);

  const cancelar = async (id) => {
    if (!confirm('Cancelar esta comanda? Os itens voltam a ficar disponíveis.')) return;
    try {
      await comandasApi.cancelarComanda(id);
      carregar();
    } catch (err) {
      setErro(extractErrorMessage(err));
    }
  };

  return (
    <div className="stack">
      <h2>Histórico</h2>

      <div className="tag-card row" style={{ alignItems: 'flex-end' }}>
        <div className="field" style={{ minWidth: 200 }}>
          <label>Cliente</label>
          <select value={filtroCliente} onChange={(e) => setFiltroCliente(e.target.value)}>
            <option value="">Todos</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="field" style={{ minWidth: 200 }}>
          <label>Funcionário</label>
          <select value={filtroFuncionario} onChange={(e) => setFiltroFuncionario(e.target.value)}>
            <option value="">Todos</option>
            {funcionarios.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      {erro && <div className="error-banner">{erro}</div>}
      {comandas === null && <Loader label="Carregando histórico" />}
      {comandas && comandas.length === 0 && <EmptyState title="Nenhuma comanda encontrada" />}

      {comandas && comandas.length > 0 && (
        <div className="tag-card" style={{ padding: 0, overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Funcionário</th>
                <th>Status</th>
                <th>Criada em</th>
                <th>Concluída em</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {comandas.map((c) => (
                <tr key={c.id}>
                  <td className="mono">#{c.id}</td>
                  <td>{c.cliente_nome}</td>
                  <td>{c.funcionario_nome}</td>
                  <td>
                    <StatusStamp status={c.status} />
                  </td>
                  <td className="mono">{formatarData(c.created_at)}</td>
                  <td className="mono">{formatarData(c.concluded_at)}</td>
                  <td className="row">
                    <a className="btn btn-ghost btn-sm" href={comandasApi.pdfUrl(c.id)} target="_blank" rel="noreferrer">
                      PDF
                    </a>
                    {c.status === 'aberta' && (
                      <button className="btn btn-danger btn-sm" onClick={() => cancelar(c.id)}>
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
