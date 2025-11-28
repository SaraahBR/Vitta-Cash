import PropTypes from 'prop-types';
import AuthProvider from './components/authProvider/AuthProvider';
import { AuthProvider as AuthModalProvider } from '@/contexts/AuthContext';
import AuthModalWrapper from './components/authModalWrapper/AuthModalWrapper';
import './globals.css';

export const metadata = {
  title: 'VittaCash - Controle de Gastos Pessoais',
  description: 'Sistema de controle de gastos mensais e anuais',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <AuthModalProvider>
            {children}
            <AuthModalWrapper />
          </AuthModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
