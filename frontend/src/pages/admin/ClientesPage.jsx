import { useEffect, useRef, useState } from 'react';
import * as clientesApi from '../../api/clientes';
import { imageUrl, extractErrorMessage } from '../../api/client';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';

export default function ClientesPage() {
  const [clientes, setClientes] = useState(null);
  const [erro, setErro] = useState(null);
  const [nome, setNome] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const fileInputRef = useRef(null);
  const trocaImagemRefs = useRef({});

  const carregar = () => clientesApi.listClientes().then(setClientes).catch((e) => setErro(extractErrorMessage(e)));

  useEffect(() => {
    carregar();
  }, []);

  const criar = async (e) => {
    e.preventDefault();
    setErro(null);
    setSalvando(true);
    try {
      await clientesApi.createCliente({ nome, imageFile });
      setNome('');
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await carregar();
    } catch (err) {
      setErro(extractErrorMessage(err));
    } finally {
      setSalvando(false);
    }
  };

  const trocarImagem = async (id, file) => {
    if (!file) return;
    setErro(null);
    try {
      await clientesApi.updateClienteImagem(id, file);
      await carregar();
    } catch (err) {
      setErro(extractErrorMessage(err));
    }
  };

  const remover = async (id) => {
    if (!confirm('Excluir este cliente?')) return;
    setErro(null);
    try {
      await clientesApi.deleteCliente(id);
      await carregar();
    } catch (err) {
      setErro(extractErrorMessage(err));
    }
  };

  return (
    <div className="stack">
      <div className="spread">
        <h2>Clientes</h2>
      </div>

      <form className="tag-card stack" onSubmit={criar}>
        <span className="eyebrow">Novo cliente</span>
        <div className="row" style={{ alignItems: 'flex-end' }}>
          <div className="field" style={{ flex: 1, minWidth: 200 }}>
            <label htmlFor="nome-cliente">Nome</label>
            <input id="nome-cliente" type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div className="field" style={{ flex: 1, minWidth: 200 }}>
            <label>Foto</label>
            <div className="field-file">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0] || null)}
              />
            </div>
          </div>
          <button className="btn btn-primary" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Adicionar'}
          </button>
        </div>
      </form>

      {erro && <div className="error-banner">{erro}</div>}

      {clientes === null && <Loader label="Carregando clientes" />}

      {clientes && clientes.length === 0 && (
        <EmptyState title="Nenhum cliente cadastrado" hint="Adicione o primeiro cliente acima." />
      )}

      {clientes && clientes.length > 0 && (
        <div className="item-picker" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
          {clientes.map((cliente) => (
            <div key={cliente.id} className="tag-card" style={{ padding: 14, textAlign: 'center' }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 8,
                  margin: '0 auto 10px',
                  overflow: 'hidden',
                  background: 'var(--ink-950)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {cliente.image ? (
                  <img src={imageUrl(cliente.image)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span className="mono">{cliente.nome.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <p style={{ color: 'var(--paper)', fontWeight: 600, marginBottom: 10 }}>{cliente.nome}</p>
              <div className="stack" style={{ gap: 6 }}>
                <input
                  ref={(el) => (trocaImagemRefs.current[cliente.id] = el)}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => trocarImagem(cliente.id, e.target.files[0])}
                />
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => trocaImagemRefs.current[cliente.id]?.click()}
                >
                  Trocar foto
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => remover(cliente.id)}>
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
