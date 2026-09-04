import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Sun, Moon, LayoutGrid, Users, IdCard, Package, LogOut, ClipboardList, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './AdminLayout.css';

const SECTIONS = [
  { to: '/admin/historico', label: 'Histórico', icon: LayoutGrid },
  { to: '/admin/clientes', label: 'Clientes', icon: Users },
  { to: '/admin/funcionarios', label: 'Funcionários', icon: IdCard },
  { to: '/admin/itens', label: 'Itens', icon: Package },
];

export default function AdminLayout() {
  const { nomeAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const sair = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app-shell">
      <aside className="rail">
        <button className="rail-icon" onClick={toggleTheme} title="Alternar tema">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <div className="rail-nav">
          {SECTIONS.map((s) => (
            <NavLink key={s.to} to={s.to} className={({ isActive }) => `rail-icon ${isActive ? 'active' : ''}`} title={s.label}>
              <s.icon size={18} />
            </NavLink>
          ))}
        </div>
        <button className="rail-icon" onClick={sair} title="Sair">
          <LogOut size={18} />
        </button>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div className="topbar-brand">
            <span className="brand-mark">
              <ClipboardList size={18} />
            </span>
            <span className="brand-word">Checklist</span>
          </div>

          <nav className="pill-nav">
            {SECTIONS.map((s) => (
              <NavLink key={s.to} to={s.to} className={({ isActive }) => `pill-nav-item ${isActive ? 'active' : ''}`}>
                {s.label}
              </NavLink>
            ))}
          </nav>

          <div className="topbar-account">
            <span className="avatar-badge">{nomeAdmin?.slice(0, 2).toUpperCase()}</span>
            <div className="account-text">
              <span className="account-name">{nomeAdmin}</span>
              <span className="account-role">Administrador</span>
            </div>
            <ChevronDown size={16} color="var(--text-tertiary)" />
          </div>
        </header>

        <main className="container" style={{ padding: '28px 20px 64px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
