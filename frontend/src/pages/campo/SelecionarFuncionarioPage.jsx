import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as funcionariosApi from '../../api/funcionarios';
import { useFuncionario } from '../../context/FuncionarioContext';
import { extractErrorMessage } from '../../api/client';
import Loader from '../../components/Loader';

export default function SelecionarFuncionarioPage() {
  const { setFuncionario } = useFuncionario();
  const [funcionarios, setFuncionarios] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    funcionariosApi
      .listFuncionarios()
      .then(setFuncionarios)
      .catch((e) => setErro(extractErrorMessage(e)));
  }, []);

  return (
    <div className="shell" style={{ padding: '32px 0' }}>
      <div className="container" style={{ maxWidth: 480 }}>
        <Link to="/" className="eyebrow" style={{ textDecoration: 'none' }}>
          ← voltar
        </Link>
        <h2 style={{ marginTop: 16, marginBottom: 4 }}>Quem é você?</h2>
        <p style={{ marginBottom: 20 }}>Selecione seu nome na lista da equipe.</p>

        {erro && <div className="error-banner">{erro}</div>}
        {funcionarios === null && <Loader label="Carregando equipe" />}

        <div className="stack">
          {funcionarios &&
            funcionarios.map((f) => (
              <button
                key={f.id}
                className="tag-card"
                style={{ textAlign: 'left', cursor: 'pointer', border: '1.5px solid var(--hairline)' }}
                onClick={() => setFuncionario({ id: f.id, nome: f.nome })}
              >
                <p style={{ color: 'var(--paper)', fontWeight: 600 }}>{f.nome}</p>
                <span className="eyebrow">{f.role}</span>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
