import { useEffect, useMemo, useState } from 'react';
import { ClipboardList, CheckCircle2, Users, Package, Search, Download, XCircle } from 'lucide-react';
import * as comandasApi from '../../api/comandas';
import * as clientesApi from '../../api/clientes';
import * as funcionariosApi from '../../api/funcionarios';
import * as itensApi from '../../api/itens';
import { extractErrorMessage } from '../../api/client';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import StatusStamp from '../../components/StatusStamp';
import StatCard from '../../components/StatCard';
import MiniBarChart from '../../components/MiniBarChart';

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function formatarData(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

function ultimosSeisMeses(comandas) {
  const hoje = new Date();
  const baldes = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    baldes.push({ chave: `${d.getFullYear()}-${d.getMonth()}`, label: MESES[d.getMonth()], value: 0 });
  }
  comandas.forEach((c) => {
    const d = new Date(c.created_at);
    const chave = `${d.getFullYear()}-${d.getMonth()}`;
    const balde = baldes.find((b) => b.chave === chave);
    if (balde) balde.value += 1;
  });
  return baldes;
}

export default function HistoricoPage() {
  const [todasComandas, setTodasComandas] = useState(null);
  const [comandas, setComandas] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [itens, setItens] = useState([]);
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroFuncionario, setFiltroFuncionario] = useState('');
  const [busca, setBusca] = useState('');
  const [erro, setErro] = useState(null);

  useEffect(() => {
    clientesApi.listClientes().then(setClientes).catch(() => {});
    funcionariosApi.listFuncionarios().then(setFuncionarios).catch(() => {});
    itensApi.listItens().then(setItens).catch(() => {});
    comandasApi.listHistorico().then(setTodasComandas).catch(() => {});
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
      comandasApi.listHistorico().then(setTodasComandas);
    } catch (err) {
      setErro(extractErrorMessage(err));
    }
  };

  const stats = useMemo(() => {
    if (!todasComandas) return null;
    const abertas = todasComandas.filter((c) => c.status === 'aberta').length;
    const hoje = new Date();
    const concluidasNoMes = todasComandas.filter((c) => {
      if (c.status !== 'concluida' || !c.concluded_at) return false;
      const d = new Date(c.concluded_at);
      return d.getMonth() === hoje.getMonth() && d.getFullYear() === hoje.getFullYear();
    }).length;
    const itensEmUso = itens.filter((i) => i.em_uso).length;
    return { abertas, concluidasNoMes, itensEmUso };
  }, [todasComandas, itens]);

  const chartData = useMemo(() => (todasComandas ? ultimosSeisMeses(todasComandas) : []), [todasComandas]);

  const comandasFiltradas = useMemo(() => {
    if (!comandas) return null;
    if (!busca.trim()) return comandas;
    const termo = busca.trim().toLowerCase();
    return comandas.filter(
      (c) =>
        c.cliente_nome.toLowerCase().includes(termo) ||
        c.funcionario_nome.toLowerCase().includes(termo) ||
        String(c.id).includes(termo)
    );
  }, [comandas, busca]);

  return (
    <div className="stack">
      <div>
        <h1>Histórico</h1>
        <p style={{ marginTop: 4 }}>Acompanhe as comandas de equipamentos em campo.</p>
      </div>

      <div className="stat-grid">
        <StatCard label="Comandas abertas" value={stats ? stats.abertas : '—'} hint="Em campo agora" icon={ClipboardList} accent />
        <StatCard label="Concluídas no mês" value={stats ? stats.concluidasNoMes : '—'} hint="Itens devolvidos" icon={CheckCircle2} />
        <StatCard label="Clientes ativos" value={clientes.length} hint="Cadastrados" icon={Users} />
        <StatCard label="Itens em uso" value={stats ? `${stats.itensEmUso}/${itens.length}` : '—'} hint="Do catálogo" icon={Package} />
      </div>

      <div className="card">
        <div className="spread" style={{ marginBottom: 4 }}>
          <div>
            <h3>Comandas por mês</h3>
            <p style={{ fontSize: '0.85rem' }}>Últimos 6 meses</p>
          </div>
        </div>
        {chartData.length > 0 ? <MiniBarChart data={chartData} /> : <Loader label="Carregando gráfico" />}
      </div>

      <div className="card row" style={{ alignItems: 'flex-end' }}>
        <div className="field" style={{ flex: '1 1 220px' }}>
          <label>Buscar</label>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              style={{ paddingLeft: 38 }}
              placeholder="Cliente, funcionário ou #id"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>
        <div className="field" style={{ minWidth: 180 }}>
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
        <div className="field" style={{ minWidth: 180 }}>
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
      {comandasFiltradas === null && <Loader label="Carregando histórico" />}
      {comandasFiltradas && comandasFiltradas.length === 0 && <EmptyState title="Nenhuma comanda encontrada" />}

      {comandasFiltradas && comandasFiltradas.length > 0 && (
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
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
              {comandasFiltradas.map((c) => (
                <tr key={c.id}>
                  <td className="mono">#{c.id}</td>
                  <td style={{ fontWeight: 600 }}>{c.cliente_nome}</td>
                  <td>{c.funcionario_nome}</td>
                  <td>
                    <StatusStamp status={c.status} />
                  </td>
                  <td className="mono">{formatarData(c.created_at)}</td>
                  <td className="mono">{formatarData(c.concluded_at)}</td>
                  <td>
                    <div className="row" style={{ justifyContent: 'flex-end' }}>
                      <a className="btn btn-ghost btn-icon" href={comandasApi.pdfUrl(c.id)} target="_blank" rel="noreferrer" title="Baixar PDF">
                        <Download size={16} />
                      </a>
                      {c.status === 'aberta' && (
                        <button className="btn btn-danger btn-icon" onClick={() => cancelar(c.id)} title="Cancelar">
                          <XCircle size={16} />
                        </button>
                      )}
                    </div>
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
