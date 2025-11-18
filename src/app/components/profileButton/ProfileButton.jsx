'use client';

import { useState, useEffect, useRef } from 'react';
import { authService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import './profileButton.css';

export default function ProfileButton() {
  const [usuario, setUsuario] = useState(null);
  const [autenticado, setAutenticado] = useState(false);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const dropdownRef = useRef(null);
  const { abrirLogin } = useAuth();

  useEffect(() => {
    const verificarAuth = () => {
      const isAuth = authService.isAuthenticated();
      setAutenticado(isAuth);
      if (isAuth) {
        setUsuario(authService.getUser());
      }
    };

    verificarAuth();

    // Fechar dropdown ao clicar fora
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownAberto(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setDropdownAberto(!dropdownAberto);
  };

  const handleLogout = () => {
    authService.logout();
    setDropdownAberto(false);
  };

  const handleAbrirModal = () => {
    abrirLogin();
    setDropdownAberto(false);
  };

  if (!autenticado) {
    return (
      <div className="profile-button-container" ref={dropdownRef}>
        <button className="profile-icon-btn" onClick={toggleDropdown}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </button>

        {dropdownAberto && (
          <div className="profile-dropdown">
            <button className="profile-dropdown-item login-item" onClick={handleAbrirModal}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              Login
            </button>
          </div>
        )}
      </div>
    );
  }

  // Suporte para campos em português e inglês
  const imagemUsuario = usuario?.image || usuario?.imagem;
  const nomeUsuario = usuario?.name || usuario?.nome;

  return (
    <div className="profile-button-container" ref={dropdownRef}>
      <button className="profile-icon-btn authenticated" onClick={toggleDropdown}>
        {imagemUsuario ? (
          <img 
            src={imagemUsuario} 
            alt={nomeUsuario || usuario.email} 
            className="profile-avatar-img"
            referrerPolicy="no-referrer"
          />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        )}
      </button>

      {dropdownAberto && (
        <div className="profile-dropdown">
          <div className="profile-dropdown-header">
            <div className="profile-dropdown-avatar">
              {imagemUsuario ? (
                <img 
                  src={imagemUsuario} 
                  alt={nomeUsuario || usuario.email}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              )}
            </div>
            <div className="profile-dropdown-info">
              <p className="profile-dropdown-name">{nomeUsuario || 'Usuário'}</p>
              <p className="profile-dropdown-email">{usuario?.email}</p>
            </div>
          </div>

          <div className="profile-dropdown-divider"></div>

          <button className="profile-dropdown-item logout-item" onClick={handleLogout}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
