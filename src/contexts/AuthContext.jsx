'use client';

import { createContext, useContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

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

  const contextValue = useMemo(() => ({
    modalAberto,
    abaAtiva,
    abrirModal,
    fecharModal,
    abrirLogin,
    abrirCadastro,
  }), [modalAberto, abaAtiva]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
