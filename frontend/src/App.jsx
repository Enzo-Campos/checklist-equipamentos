import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FuncionarioProvider } from './context/FuncionarioContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

import LandingPage from './pages/LandingPage';
import AdminLoginPage from './pages/AdminLoginPage';

import AdminLayout from './pages/admin/AdminLayout';
import ClientesPage from './pages/admin/ClientesPage';
import FuncionariosPage from './pages/admin/FuncionariosPage';
import ItensPage from './pages/admin/ItensPage';
import HistoricoPage from './pages/admin/HistoricoPage';
import AdministradoresPage from './pages/admin/AdministradoresPage';

import CampoGate from './pages/campo/CampoGate';
import MinhasComandasPage from './pages/campo/MinhasComandasPage';
import NovaComandaPage from './pages/campo/NovaComandaPage';
import ComandaDetalhePage from './pages/campo/ComandaDetalhePage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FuncionarioProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/entrar" element={<AdminLoginPage />} />

              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout />
                  </ProtectedAdminRoute>
                }
              >
                <Route index element={<HistoricoPage />} />
                <Route path="historico" element={<HistoricoPage />} />
                <Route path="clientes" element={<ClientesPage />} />
                <Route path="funcionarios" element={<FuncionariosPage />} />
                <Route path="itens" element={<ItensPage />} />
                <Route path="administradores" element={<AdministradoresPage />} />
              </Route>

              <Route path="/campo" element={<CampoGate />}>
                <Route index element={<MinhasComandasPage />} />
                <Route path="nova" element={<NovaComandaPage />} />
                <Route path="comandas/:id" element={<ComandaDetalhePage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </FuncionarioProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
