import { Link } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing shell">
      <div className="container landing-inner">
        <div className="landing-mark eyebrow rise">Controle de Equipamentos · Social Media</div>
        <h1 className="rise" style={{ animationDelay: '0.05s' }}>
          Checklist
          <br />
          de Campo
        </h1>
        <p className="rise" style={{ animationDelay: '0.1s', maxWidth: 420, marginTop: 10 }}>
          Registre, acompanhe e finalize a retirada de equipamentos levados para os clientes.
        </p>

        <div className="landing-tiles rise" style={{ animationDelay: '0.18s' }}>
          <Link to="/campo" className="landing-tile">
            <span className="eyebrow">Equipe</span>
            <h2>Sou da equipe</h2>
            <p>Selecione seu nome e monte a comanda em campo.</p>
          </Link>
          <Link to="/entrar" className="landing-tile landing-tile-admin">
            <span className="eyebrow">Gestão</span>
            <h2>Administrador</h2>
            <p>Login para gerenciar cadastros e ver o histórico.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
