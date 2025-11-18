'use client';

import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [modalAberto, setModalAberto] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('login'); // 'login' ou 'cadastro'

  const abrirModal = (aba = 'login') => {
    setAbaAtiva(aba);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
  };

  const abrirLogin = () => abrirModal('login');
  const abrirCadastro = () => abrirModal('cadastro');

  return (
    <AuthContext.Provider
      value={{
        modalAberto,
        abaAtiva,
        abrirModal,
        fecharModal,
        abrirLogin,
        abrirCadastro,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
