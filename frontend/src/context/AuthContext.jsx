import { createContext, useContext, useMemo, useState } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

function decodeNome(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.nome || 'Administrador';
  } catch {
    return 'Administrador';
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));

  const login = async (email, senha) => {
    const { token: newToken } = await authApi.login(email, senha);
    localStorage.setItem('admin_token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
  };

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      nomeAdmin: token ? decodeNome(token) : null,
      login,
      logout,
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
