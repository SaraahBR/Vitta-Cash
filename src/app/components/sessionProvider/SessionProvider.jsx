'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import PropTypes from 'prop-types';

export function SessionProvider({ children }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}

SessionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
