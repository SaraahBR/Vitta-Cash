// __tests__/api/expenses.test.js
// Testes para API de despesas

/**
 * NOTA: Para executar estes testes, instale as dependências:
 * npm install --save-dev jest @testing-library/react @testing-library/jest-dom node-mocks-http
 * 
 * Configure o jest.config.js conforme indicado no README
 */

import { createMocks } from 'node-mocks-http';
import handler from '../../pages/api/expenses/index';

// Mock do Prisma
jest.mock('../../src/lib/prisma', () => ({
  prisma: {
    expense: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}));

import { getServerSession } from 'next-auth/next';
import { prisma } from '../../src/lib/prisma';

describe('/api/expenses - GET', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar 401 se não autenticado', async () => {
    getServerSession.mockResolvedValue(null);

    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData())).toEqual({ erro: 'Não autenticado' });
  });

  it('deve listar despesas do usuário autenticado', async () => {
    const sessaoMock = {
      user: { id: 'user-123', email: 'teste@example.com' },
    };
    
    getServerSession.mockResolvedValue(sessaoMock);

    const despesasMock = [
      {
        id: '1',
        userId: 'user-123',
        title: 'Almoço',
        amount: 25.50,
        date: '2025-11-01T00:00:00.000Z',
        category: 'Alimentação',
        recurring: false,
        recurrenceType: 'NONE',
        notes: null,
      },
    ];

    prisma.expense.findMany.mockResolvedValue(despesasMock);

    const { req, res } = createMocks({
      method: 'GET',
      query: {},
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(despesasMock);
  });

  it('deve filtrar despesas por mês e ano', async () => {
    const sessaoMock = {
      user: { id: 'user-123' },
    };
    
    getServerSession.mockResolvedValue(sessaoMock);
    prisma.expense.findMany.mockResolvedValue([]);

    const { req, res } = createMocks({
      method: 'GET',
      query: { month: '11', year: '2025' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(prisma.expense.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: 'user-123',
          date: expect.any(Object),
        }),
      })
    );
  });
});

describe('/api/expenses - POST', () => {
  it('deve criar despesa com dados válidos', async () => {
    const sessaoMock = {
      user: { id: 'user-123' },
    };
    
    getServerSession.mockResolvedValue(sessaoMock);

    const novaDespesa = {
      title: 'Supermercado',
      amount: 150.00,
      date: '2025-11-06',
      category: 'Alimentação',
      recurring: false,
      recurrenceType: 'NONE',
      notes: null,
    };

    const despesaCriada = {
      id: 'new-id',
      ...novaDespesa,
      date: new Date(novaDespesa.date).toISOString(),
      userId: 'user-123',
    };

    prisma.expense.create.mockResolvedValue(despesaCriada);

    const { req, res } = createMocks({
      method: 'POST',
      body: novaDespesa,
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(JSON.parse(res._getData())).toMatchObject({ id: 'new-id' });
  });

  it('deve rejeitar despesa com dados inválidos', async () => {
    const sessaoMock = {
      user: { id: 'user-123' },
    };
    
    getServerSession.mockResolvedValue(sessaoMock);

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        title: '', // Inválido
        amount: -10, // Inválido
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const resposta = JSON.parse(res._getData());
    expect(resposta.erro).toBe('Dados inválidos');
    expect(resposta.detalhes).toBeInstanceOf(Array);
  });
});
