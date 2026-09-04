import { NavLink, Outlet, Link } from 'react-router-dom';
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
      <header className="admin-header">
        <div className="container spread">
          <div>
            <span className="eyebrow">Em campo</span>
            <h2 style={{ fontSize: '1.4rem' }}>{funcionario.nome}</h2>
          </div>
          <div className="row">
            <Link to="/" className="btn btn-ghost btn-sm">
              Início
            </Link>
            <button className="btn btn-ghost btn-sm" onClick={limparFuncionario}>
              Trocar
            </button>
          </div>
        </div>
        <nav className="container admin-tabs">
          <NavLink to="/campo" end className={({ isActive }) => `admin-tab ${isActive ? 'active' : ''}`}>
            Minhas comandas
          </NavLink>
          <NavLink to="/campo/nova" className={({ isActive }) => `admin-tab ${isActive ? 'active' : ''}`}>
            Nova comanda
          </NavLink>
        </nav>
      </header>
      <main className="container" style={{ padding: '24px 20px 64px' }}>
        <Outlet />
      </main>
    </div>
  );
}
