import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as clientesApi from '../../api/clientes';
import * as itensApi from '../../api/itens';
import * as comandasApi from '../../api/comandas';
import { useFuncionario } from '../../context/FuncionarioContext';
import { extractErrorMessage } from '../../api/client';
import Loader from '../../components/Loader';
import ItemPicker from '../../components/ItemPicker';
import Modal from '../../components/Modal';
import PinPad from '../../components/PinPad';

export default function NovaComandaPage() {
  const { funcionario } = useFuncionario();
  const navigate = useNavigate();

  const [clientes, setClientes] = useState(null);
  const [itens, setItens] = useState(null);
  const [idCliente, setIdCliente] = useState('');
  const [selecionados, setSelecionados] = useState([]);
  const [erro, setErro] = useState(null);

  const [mostrarNovoItem, setMostrarNovoItem] = useState(false);
  const [novoItemNome, setNovoItemNome] = useState('');
  const [novoItemFoto, setNovoItemFoto] = useState(null);
  const [criandoItem, setCriandoItem] = useState(false);
  const fileRef = useRef(null);

  const [mostrarPin, setMostrarPin] = useState(false);
  const [criandoComanda, setCriandoComanda] = useState(false);
  const [erroPin, setErroPin] = useState(null);

  const carregarItens = () => itensApi.listItens({ apenasDisponiveis: true }).then(setItens);

  useEffect(() => {
    clientesApi.listClientes().then(setClientes).catch((e) => setErro(extractErrorMessage(e)));
    carregarItens().catch((e) => setErro(extractErrorMessage(e)));
  }, []);

  const toggleItem = (id) => {
    setSelecionados((sel) => (sel.includes(id) ? sel.filter((i) => i !== id) : [...sel, id]));
  };

  const criarItemRapido = async (e) => {
    e.preventDefault();
    setCriandoItem(true);
    setErro(null);
    try {
      const item = await itensApi.createItem({ nome: novoItemNome, imageFile: novoItemFoto });
      setNovoItemNome('');
      setNovoItemFoto(null);
      if (fileRef.current) fileRef.current.value = '';
      setMostrarNovoItem(false);
      await carregarItens();
      setSelecionados((sel) => [...sel, item.id]);
    } catch (err) {
      setErro(extractErrorMessage(err));
    } finally {
      setCriandoItem(false);
    }
  };

  const podeConfirmar = idCliente && selecionados.length > 0;

  const confirmarComPin = async (pin) => {
    setCriandoComanda(true);
    setErroPin(null);
    try {
      const comanda = await comandasApi.createComanda({
        id_funcionario: funcionario.id,
        pin,
        id_cliente: Number(idCliente),
        id_itens: selecionados,
      });
      navigate(`/campo/comandas/${comanda.id}`);
    } catch (err) {
      setErroPin(extractErrorMessage(err));
    } finally {
      setCriandoComanda(false);
    }
  };

  return (
    <div className="stack">
      <h2>Nova comanda</h2>

      {erro && <div className="error-banner">{erro}</div>}

      <div className="tag-card stack">
        <span className="eyebrow">1. Cliente</span>
        {clientes === null ? (
          <Loader label="Carregando clientes" />
        ) : (
          <select value={idCliente} onChange={(e) => setIdCliente(e.target.value)}>
            <option value="">Selecione o cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="tag-card stack">
        <div className="spread">
          <span className="eyebrow">2. Itens ({selecionados.length} selecionados)</span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setMostrarNovoItem(true)}>
            + Item novo
          </button>
        </div>

        {itens === null ? <Loader label="Carregando itens" /> : <ItemPicker itens={itens} selecionados={selecionados} onToggle={toggleItem} />}
      </div>

      <button className="btn btn-primary btn-block" disabled={!podeConfirmar} onClick={() => setMostrarPin(true)}>
        Confirmar comanda
      </button>

      {mostrarNovoItem && (
        <Modal title="Novo item" onClose={() => setMostrarNovoItem(false)}>
          <form className="stack" onSubmit={criarItemRapido}>
            <div className="field">
              <label>Nome do item</label>
              <input
                type="text"
                value={novoItemNome}
                onChange={(e) => setNovoItemNome(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="field">
              <label>Foto (opcional)</label>
              <div className="field-file">
                <input ref={fileRef} type="file" accept="image/*" onChange={(e) => setNovoItemFoto(e.target.files[0] || null)} />
              </div>
            </div>
            <button className="btn btn-primary btn-block" disabled={criandoItem}>
              {criandoItem ? 'Criando...' : 'Adicionar à lista'}
            </button>
          </form>
        </Modal>
      )}

      {mostrarPin && (
        <Modal title="Confirmar comanda" onClose={() => setMostrarPin(false)}>
          <PinPad
            nomeFuncionario={funcionario.nome}
            onConfirm={confirmarComPin}
            onCancel={() => setMostrarPin(false)}
            loading={criandoComanda}
            error={erroPin}
          />
        </Modal>
      )}
    </div>
  );
}
