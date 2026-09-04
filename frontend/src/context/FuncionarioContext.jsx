import { createContext, useContext, useMemo, useState } from 'react';

const STORAGE_KEY = 'funcionario_atual';

const FuncionarioContext = createContext(null);

export function FuncionarioProvider({ children }) {
  const [funcionario, setFuncionarioState] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  const setFuncionario = (f) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(f));
    setFuncionarioState(f);
  };

  const limparFuncionario = () => {
    localStorage.removeItem(STORAGE_KEY);
    setFuncionarioState(null);
  };

  const value = useMemo(
    () => ({ funcionario, setFuncionario, limparFuncionario }),
    [funcionario]
  );

  return <FuncionarioContext.Provider value={value}>{children}</FuncionarioContext.Provider>;
}

export function useFuncionario() {
  return useContext(FuncionarioContext);
}
