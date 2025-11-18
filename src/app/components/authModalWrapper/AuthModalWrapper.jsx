'use client';

import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '../authModal/AuthModal';

export default function AuthModalWrapper() {
  const { modalAberto, fecharModal, abaAtiva } = useAuth();

  return (
    <AuthModal 
      isOpen={modalAberto} 
      onClose={fecharModal}
      initialTab={abaAtiva}
    />
  );
}
