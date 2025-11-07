'use client';

import Link from 'next/link';
import './footer.css';

export default function Footer() {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-secao">
            <h3>Sobre</h3>
            <ul>
              <li><Link href="/" className="footer-link">Sobre o VittaCash</Link></li>
              <li><Link href="/" className="footer-link">Como Funciona</Link></li>
              <li><Link href="/" className="footer-link">Recursos</Link></li>
            </ul>
          </div>

          <div className="footer-secao">
            <h3>Links Rápidos</h3>
            <ul>
              <li><Link href="/" className="footer-link">Dashboard</Link></li>
              <li><Link href="/expenses" className="footer-link">Despesas</Link></li>
              <li><Link href="/reports" className="footer-link">Relatórios</Link></li>
            </ul>
          </div>

          <div className="footer-secao">
            <h3>Recursos</h3>
            <ul>
              <li><Link href="/" className="footer-link">Documentação</Link></li>
              <li><Link href="/" className="footer-link">Blog</Link></li>
              <li><Link href="/" className="footer-link">Tutoriais</Link></li>
            </ul>
          </div>

          <div className="footer-secao">
            <h3>Suporte</h3>
            <ul>
              <li><Link href="/" className="footer-link">Central de Ajuda</Link></li>
              <li><Link href="/" className="footer-link">Contato</Link></li>
              <li><Link href="/" className="footer-link">FAQ</Link></li>
            </ul>
          </div>
        </div>

        <hr className="footer-divider" />

        <p className="footer-copyright">
          © {anoAtual} VittaCash. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
