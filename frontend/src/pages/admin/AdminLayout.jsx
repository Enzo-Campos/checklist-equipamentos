import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const TABS = [
  { to: '/admin/historico', label: 'Histórico' },
  { to: '/admin/clientes', label: 'Clientes' },
  { to: '/admin/funcionarios', label: 'Funcionários' },
  { to: '/admin/itens', label: 'Itens' },
];

export default function AdminLayout() {
  const { nomeAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const sair = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="shell">
      <header className="admin-header">
        <div className="container spread">
          <div>
            <span className="eyebrow">Painel</span>
            <h2 style={{ fontSize: '1.4rem' }}>{nomeAdmin}</h2>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={sair}>
            Sair
          </button>
        </div>
        <nav className="container admin-tabs">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) => `admin-tab ${isActive ? 'active' : ''}`}
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="container" style={{ padding: '24px 20px 64px' }}>
        <Outlet />
      </main>
    </div>
  );
}
