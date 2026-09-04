import { NavLink, Outlet, Link } from 'react-router-dom';
import { ClipboardList, Home, Repeat } from 'lucide-react';
import { useFuncionario } from '../../context/FuncionarioContext';
import SelecionarFuncionarioPage from './SelecionarFuncionarioPage';
import '../admin/AdminLayout.css';

export default function CampoGate() {
  const { funcionario, limparFuncionario } = useFuncionario();

  if (!funcionario) {
    return <SelecionarFuncionarioPage />;
  }

  return (
    <div className="shell">
      <header className="topbar" style={{ margin: '16px' }}>
        <div className="topbar-brand">
          <span className="brand-mark">
            <ClipboardList size={18} />
          </span>
          <div style={{ lineHeight: 1.15 }}>
            <div className="eyebrow">Em campo</div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{funcionario.nome}</div>
          </div>
        </div>

        <nav className="pill-nav">
          <NavLink to="/campo" end className={({ isActive }) => `pill-nav-item ${isActive ? 'active' : ''}`}>
            Minhas comandas
          </NavLink>
          <NavLink to="/campo/nova" className={({ isActive }) => `pill-nav-item ${isActive ? 'active' : ''}`}>
            Nova comanda
          </NavLink>
        </nav>

        <div className="row" style={{ flexShrink: 0 }}>
          <Link to="/" className="btn btn-ghost btn-icon" title="Início">
            <Home size={16} />
          </Link>
          <button className="btn btn-ghost btn-icon" onClick={limparFuncionario} title="Trocar funcionário">
            <Repeat size={16} />
          </button>
        </div>
      </header>
      <main className="container" style={{ padding: '24px 20px 64px' }}>
        <Outlet />
      </main>
    </div>
  );
}
