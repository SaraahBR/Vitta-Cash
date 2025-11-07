'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { authService } from '@/services/api';
import AuthButton from '../authButton/AuthButton';
import './navbar.css';

export default function Navbar() {
  const [autenticado, setAutenticado] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setAutenticado(authService.isAuthenticated());
  }, []);

  const linkAtivo = (caminho) => {
    return pathname === caminho ? 'navbar-link-ativo' : '';
  };

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  const fecharMenu = () => {
    setMenuAberto(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">
          <Image 
            src="/LOGO_VittaCash.png" 
            alt="VittaCash" 
            width={40} 
            height={40}
            className="navbar-logo-icon"
          />
          <span className="navbar-logo-text">VittaCash</span>
        </Link>

        {autenticado && (
          <>
            {/* Botão Hamburguer para Mobile */}
            <button 
              className="navbar-hamburger"
              onClick={toggleMenu}
              aria-label="Menu"
            >
              <span className={`hamburger-line ${menuAberto ? 'open' : ''}`}></span>
              <span className={`hamburger-line ${menuAberto ? 'open' : ''}`}></span>
              <span className={`hamburger-line ${menuAberto ? 'open' : ''}`}></span>
            </button>

            {/* Menu Desktop e Mobile */}
            <div className={`navbar-menu ${menuAberto ? 'mobile-open' : ''}`}>
              <Link 
                href="/" 
                className={`navbar-link ${linkAtivo('/')}`}
                onClick={fecharMenu}
              >
                Dashboard
              </Link>
              <Link 
                href="/expenses" 
                className={`navbar-link ${linkAtivo('/expenses')}`}
                onClick={fecharMenu}
              >
                Despesas
              </Link>
              <Link 
                href="/reports" 
                className={`navbar-link ${linkAtivo('/reports')}`}
                onClick={fecharMenu}
              >
                Relatórios
              </Link>
            </div>
          </>
        )}

        <div className="navbar-auth">
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
