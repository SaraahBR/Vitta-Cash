'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import PropTypes from 'prop-types';

export default function AuthProvider({ children }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return children;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
