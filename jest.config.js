// jest.config.js
// Configuração do Jest para testes

const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Ajustado para apontar para a pasta `src` onde o App Router está localizado.
  // Evita erro quando existem diretórios `pages` e `app` em locais diferentes.
  dir: './src',
});

// Configuração customizada do Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Mapear imports de CSS modules
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    
    // Mapear paths absolutos
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/services/(.*)$': '<rootDir>/services/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverageFrom: [
    'pages/**/*.{js,jsx}',
    'src/**/*.{js,jsx}',
    'services/**/*.{js,jsx}',
    '!pages/_app.js',
    '!pages/_document.js',
    '!**/*.module.css',
  ],
};

// Exportar configuração para Next.js processar
module.exports = createJestConfig(customJestConfig);
