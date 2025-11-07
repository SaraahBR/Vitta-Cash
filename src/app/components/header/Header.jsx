'use client';

import './header.css';

export default function Header({ titulo, subtitulo, acoes }) {
  return (
    <header className="header">
      <div className="header-top">
        <div className="header-textos">
          <h1 className="header-titulo">{titulo}</h1>
          {subtitulo && <p className="header-subtitulo">{subtitulo}</p>}
        </div>
        {acoes && <div className="header-acoes">{acoes}</div>}
      </div>
    </header>
  );
}
