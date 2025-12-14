'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import './sendReportButton.css';

export default function SendReportButton({ type = 'monthly', year, month }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSendReport = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const token = globalThis.window === undefined ? null : localStorage.getItem('vittacash_token');

      // Construir URL com parâmetros
      const params = new URLSearchParams({
        type,
        year: year.toString(),
      });

      if (type === 'monthly' && month) {
        params.append('month', month.toString());
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/expenses/send-report?${params}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Erro ao enviar relatório');
      }

      setMessage(`Relatório enviado com sucesso para ${data.email}!`);
      
      // Limpar mensagem após 5 segundos
      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      setError(err.message || 'Erro ao enviar relatório por email');
      
      // Limpar erro após 5 segundos
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="send-report-container">
      <button
        onClick={handleSendReport}
        disabled={loading}
        className="send-report-btn"
        title="Enviar relatório por email"
      >
        {loading ? (
          <>
            <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Enviando...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            Enviar por Email
          </>
        )}
      </button>

      {message && (
        <div className="send-report-message success">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {message}
        </div>
      )}

      {error && (
        <div className="send-report-message error">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}

SendReportButton.propTypes = {
  type: PropTypes.oneOf(['monthly', 'yearly']),
  year: PropTypes.number.isRequired,
  month: PropTypes.number,
};
