// __tests__/components/ExpenseForm.test.jsx
// Testes para componente ExpenseForm

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExpenseForm from '../../src/components/expenseForm/ExpenseForm';

describe('ExpenseForm', () => {
  it('deve renderizar todos os campos do formulário', () => {
    const mockAoSalvar = jest.fn();
    
    render(<ExpenseForm aoSalvar={mockAoSalvar} />);

    expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/valor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/categoria/i)).toBeInTheDocument();
    expect(screen.getByText(/despesa recorrente/i)).toBeInTheDocument();
  });

  it('deve validar campos obrigatórios ao submeter', async () => {
    const mockAoSalvar = jest.fn();
    
    render(<ExpenseForm aoSalvar={mockAoSalvar} />);

    const botaoSalvar = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(botaoSalvar);

    await waitFor(() => {
      expect(screen.getByText(/descrição é obrigatória/i)).toBeInTheDocument();
    });

    expect(mockAoSalvar).not.toHaveBeenCalled();
  });

  it('deve chamar aoSalvar com dados corretos ao submeter formulário válido', async () => {
    const mockAoSalvar = jest.fn().mockResolvedValue();
    
    render(<ExpenseForm aoSalvar={mockAoSalvar} />);

    // Preencher formulário
    fireEvent.change(screen.getByLabelText(/título/i), {
      target: { value: 'Teste Despesa' },
    });
    
    fireEvent.change(screen.getByLabelText(/valor/i), {
      target: { value: '100.50' },
    });
    
    fireEvent.change(screen.getByLabelText(/data/i), {
      target: { value: '2025-11-06' },
    });
    
    fireEvent.change(screen.getByLabelText(/categoria/i), {
      target: { value: 'Alimentação' },
    });

    // Submeter
    const botaoSalvar = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(botaoSalvar);

    await waitFor(() => {
      expect(mockAoSalvar).toHaveBeenCalledWith(
        expect.objectContaining({
          descricao: 'Teste Despesa',
          valor: 100.50,
          data: '2025-11-06',
          categoria: 'Alimentação',
        })
      );
    });
  });

  it('deve preencher campos ao receber despesaInicial (modo edição)', () => {
    const despesaInicial = {
      descricao: 'Despesa Existente',
      valor: 50.00,
      data: '2025-11-01',
      categoria: 'Saúde',
      recorrente: true,
      tipoRecorrencia: 'MONTHLY',
      notas: 'Nota de teste',
    };

    render(<ExpenseForm despesaInicial={despesaInicial} aoSalvar={jest.fn()} />);

    expect(screen.getByDisplayValue('Despesa Existente')).toBeInTheDocument();
    expect(screen.getByDisplayValue('50')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2025-11-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Saúde')).toBeInTheDocument();
  });

  it('deve mostrar campo de tipo de recorrência quando recorrente está marcado', () => {
    render(<ExpenseForm aoSalvar={jest.fn()} />);

    // Inicialmente não deve estar visível
    expect(screen.queryByLabelText(/tipo de recorrência/i)).not.toBeInTheDocument();

    // Marcar checkbox
    const checkbox = screen.getByRole('checkbox', { name: /despesa recorrente/i });
    fireEvent.click(checkbox);

    // Agora deve aparecer
    expect(screen.getByLabelText(/tipo de recorrência/i)).toBeInTheDocument();
  });
});
