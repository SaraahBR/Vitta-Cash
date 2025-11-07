'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { validarDespesa } from '@/lib/validacoes';
import './expenseForm.css';

const CATEGORIAS = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Banco',
  'Outros',
];

const TIPOS_RECORRENCIA = [
  { valor: 'NONE', label: 'Não recorrente' },
  { valor: 'MONTHLY', label: 'Mensal' },
  { valor: 'YEARLY', label: 'Anual' },
];

export default function ExpenseForm({ despesaInicial, aoSalvar, aoCancelar }) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const [formData, setFormData] = useState({
    titulo: '',
    valor: '',
    data: new Date().toISOString().split('T')[0],
    categoria: 'Outros',
    recorrente: false,
    tipoRecorrencia: 'NONE',
    notas: '',
  });

  useEffect(() => {
    if (despesaInicial) {
      // Suportar tanto objetos com chaves em português (titulo, valor, data, ...) quanto em inglês
      const titulo = despesaInicial.titulo || despesaInicial.title || '';
      const valor = (despesaInicial.valor ?? despesaInicial.amount)?.toString() || '';
      const dataVal = despesaInicial.data || despesaInicial.date || new Date().toISOString().split('T')[0];
      const categoria = despesaInicial.categoria || despesaInicial.category || 'Outros';
      const recorrente = despesaInicial.recorrente ?? despesaInicial.recurring ?? false;
      const tipoRecorrencia = despesaInicial.tipoRecorrencia || despesaInicial.recurrenceType || 'NONE';
      const notas = despesaInicial.notas || despesaInicial.notes || '';

      setFormData({
        titulo,
        valor,
        data: dataVal ? new Date(dataVal).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        categoria,
        recorrente,
        tipoRecorrencia,
        notas,
      });
    }
  }, [despesaInicial]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      // Mapear campos do formulário (em português) para o shape esperado pela API/tests (em inglês)
      const dadosParaValidar = {
        title: formData.titulo,
        amount: formData.valor,
        date: formData.data,
        category: formData.categoria,
        recurring: Boolean(formData.recorrente),
        recurrenceType: formData.tipoRecorrencia,
        notes: formData.notas,
      };

      const { valido, erros } = validarDespesa(dadosParaValidar);
      if (!valido) {
        setErro(erros.join(', '));
        setCarregando(false);
        return;
      }

      const dados = {
        title: formData.titulo,
        amount: parseFloat(formData.valor),
        date: formData.data, // manter formato YYYY-MM-DD para os testes
        category: formData.categoria,
        recurring: Boolean(formData.recorrente),
        recurrenceType: formData.tipoRecorrencia,
        notes: formData.notas || null,
      };

      if (aoSalvar) {
        await aoSalvar(dados);
      }
    } catch (error) {
      setErro(error.message || 'Erro ao salvar despesa');
    } finally {
      setCarregando(false);
    }
  };

  const handleCancel = () => {
    if (aoCancelar) {
      aoCancelar();
    } else {
      router.back();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      {erro && <div className="expense-form-error">{erro}</div>}

      <div className="expense-form-group">
        <label htmlFor="titulo" className="expense-form-label">
          Título *
        </label>
        <input
          type="text"
          id="titulo"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          className="expense-form-input"
          placeholder="Ex: Conta de luz"
        />
      </div>

      <div className="expense-form-group">
        <label htmlFor="valor" className="expense-form-label">
          Valor (R$) *
        </label>
        <input
          type="number"
          id="valor"
          name="valor"
          value={formData.valor}
          onChange={handleChange}
          step="0.01"
          min="0"
          className="expense-form-input"
          placeholder="0.00"
        />
      </div>

      <div className="expense-form-group">
        <label htmlFor="data" className="expense-form-label">
          Data *
        </label>
        <input
          type="date"
          id="data"
          name="data"
          value={formData.data}
          onChange={handleChange}
          className="expense-form-input"
        />
      </div>

      <div className="expense-form-group">
        <label htmlFor="categoria" className="expense-form-label">
          Categoria
        </label>
        <select
          id="categoria"
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          className="expense-form-select"
        >
          {CATEGORIAS.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="expense-form-group">
        <div className="expense-form-checkbox-group">
          <input
            type="checkbox"
            id="recorrente"
            name="recorrente"
            checked={formData.recorrente}
            onChange={handleChange}
            className="expense-form-checkbox"
          />
          <label htmlFor="recorrente" className="expense-form-label">
            Despesa recorrente
          </label>
        </div>
      </div>

      {formData.recorrente && (
        <div className="expense-form-group">
          <label htmlFor="tipoRecorrencia" className="expense-form-label">
            Tipo de Recorrência
          </label>
          <select
            id="tipoRecorrencia"
            name="tipoRecorrencia"
            value={formData.tipoRecorrencia}
            onChange={handleChange}
            className="expense-form-select"
          >
            {TIPOS_RECORRENCIA.map((tipo) => (
              <option key={tipo.valor} value={tipo.valor}>
                {tipo.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="expense-form-group">
        <label htmlFor="notas" className="expense-form-label">
          Notas
        </label>
        <textarea
          id="notas"
          name="notas"
          value={formData.notas}
          onChange={handleChange}
          className="expense-form-textarea"
          placeholder="Observações adicionais (opcional)"
        />
      </div>

      <div className="expense-form-actions">
        <button
          type="button"
          onClick={handleCancel}
          className="expense-form-btn expense-form-btn-cancel"
          disabled={carregando}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="expense-form-btn expense-form-btn-submit"
          disabled={carregando}
        >
          {carregando ? 'Salvando...' : 'Salvar Despesa'}
        </button>
      </div>
    </form>
  );
}
