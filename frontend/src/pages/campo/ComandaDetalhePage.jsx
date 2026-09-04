import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as comandasApi from '../../api/comandas';
import { imageUrl, extractErrorMessage } from '../../api/client';
import { useFuncionario } from '../../context/FuncionarioContext';
import Loader from '../../components/Loader';
import StatusStamp from '../../components/StatusStamp';
import Modal from '../../components/Modal';
import PinPad from '../../components/PinPad';

function formatarData(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

export default function ComandaDetalhePage() {
  const { id } = useParams();
  const { funcionario } = useFuncionario();
  const [comanda, setComanda] = useState(null);
  const [erro, setErro] = useState(null);
  const [mostrarPin, setMostrarPin] = useState(false);
  const [concluindo, setConcluindo] = useState(false);
  const [erroPin, setErroPin] = useState(null);

  const carregar = () =>
    comandasApi
      .getComanda(id, funcionario.id)
      .then(setComanda)
      .catch((e) => setErro(extractErrorMessage(e)));

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const concluir = async (pin) => {
    setConcluindo(true);
    setErroPin(null);
    try {
      const atualizada = await comandasApi.concluirComanda(id, { id_funcionario: funcionario.id, pin });
      setComanda(atualizada);
      setMostrarPin(false);
    } catch (err) {
      setErroPin(extractErrorMessage(err));
    } finally {
      setConcluindo(false);
    }
  };

  if (erro) return <div className="error-banner">{erro}</div>;
  if (!comanda) return <Loader label="Carregando comanda" />;

  return (
    <div className="stack">
      <Link to="/campo" className="eyebrow" style={{ textDecoration: 'none' }}>
        ← minhas comandas
      </Link>

      <div className="tag-card stack">
        <div className="spread">
          <div>
            <span className="eyebrow mono">Comanda #{comanda.id}</span>
            <h2 style={{ marginTop: 4 }}>{comanda.cliente_nome}</h2>
          </div>
          <StatusStamp status={comanda.status} />
        </div>

        <hr className="tear" />

        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div>
            <span className="eyebrow">Responsável</span>
            <p style={{ color: 'var(--paper)' }}>{comanda.funcionario_nome}</p>
          </div>
          <div>
            <span className="eyebrow">Criada em</span>
            <p className="mono">{formatarData(comanda.created_at)}</p>
          </div>
          {comanda.concluded_at && (
            <div>
              <span className="eyebrow">Concluída em</span>
              <p className="mono">{formatarData(comanda.concluded_at)}</p>
            </div>
          )}
        </div>

        <hr className="tear" />

        <span className="eyebrow">Itens do checklist ({comanda.itens.length})</span>
        <div className="item-picker">
          {comanda.itens.map((item) => (
            <div key={item.id} className="item-tile" style={{ cursor: 'default' }}>
              <div className="item-tile-thumb">
                {item.image ? <img src={imageUrl(item.image)} alt="" /> : <span className="mono">{item.nome.slice(0, 2).toUpperCase()}</span>}
              </div>
              <span className="item-tile-nome">{item.nome}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="row">
        <a className="btn btn-ghost btn-block" href={comandasApi.pdfUrl(comanda.id)} target="_blank" rel="noreferrer">
          Baixar PDF
        </a>
        {comanda.status === 'aberta' && (
          <button className="btn btn-primary btn-block" onClick={() => setMostrarPin(true)}>
            Concluir
          </button>
        )}
      </div>

      {mostrarPin && (
        <Modal title="Concluir comanda" onClose={() => setMostrarPin(false)}>
          <PinPad
            nomeFuncionario={funcionario.nome}
            onConfirm={concluir}
            onCancel={() => setMostrarPin(false)}
            loading={concluindo}
            error={erroPin}
          />
        </Modal>
      )}
    </div>
  );
}
