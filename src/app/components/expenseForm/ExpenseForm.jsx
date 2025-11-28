'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { formatarValorInput, desformatarValor } from '@/lib/formatadores';
import LoadingScreen from '../loading/LoadingScreen';
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
    valorFormatado: '', // Novo campo para exibição formatada
    data: new Date().toISOString().split('T')[0],
    categoria: 'Outros',
    recorrente: false,
    tipoRecorrencia: 'NONE',
    notas: '',
  });

  useEffect(() => {
    if (despesaInicial) {
      // Suportar tanto objetos com chaves em português quanto em inglês (vindos da API)
      const titulo = despesaInicial.descricao || despesaInicial.titulo || despesaInicial.title || '';
      const valorNumerico = despesaInicial.valor ?? despesaInicial.amount ?? 0;
      const dataVal = despesaInicial.data || despesaInicial.date || new Date().toISOString().split('T')[0];
      const categoria = despesaInicial.categoria || despesaInicial.category || 'Outros';
      const recorrente = despesaInicial.recorrente ?? despesaInicial.recurring ?? false;
      const tipoRecorrencia = despesaInicial.tipoRecorrencia || despesaInicial.recurrenceType || 'NONE';
      const notas = despesaInicial.notas || despesaInicial.notes || '';

      setFormData({
        titulo,
        valor: valorNumerico,
        valorFormatado: formatarValorInput((valorNumerico * 100).toString()),
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

  const handleValorChange = (e) => {
    const input = e.target.value;
    const valorFormatado = formatarValorInput(input);
    const valorNumerico = desformatarValor(valorFormatado);
    
    setFormData((prev) => ({
      ...prev,
      valorFormatado,
      valor: valorNumerico,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      // Validar se o valor foi preenchido
      if (!formData.valor || formData.valor <= 0) {
        setErro('Valor deve ser maior que zero');
        setCarregando(false);
        return;
      }

      // Criar data sem conversão de timezone (meio-dia do dia selecionado)
      const [ano, mes, dia] = formData.data.split('-');
      const dataCorreta = new Date(ano, mes - 1, dia, 12, 0, 0);

      // Enviar dados em português como o backend espera
      const dados = {
        descricao: formData.titulo,
        valor: formData.valor, // Já é um número
        data: dataCorreta.toISOString(), // Enviar como ISO string
        categoria: formData.categoria,
        recorrente: Boolean(formData.recorrente),
        tipoRecorrencia: formData.tipoRecorrencia,
        notas: formData.notas || null,
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
    <>
      {carregando && <LoadingScreen message="Salvando despesa..." />}
      
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
          type="text"
          id="valor"
          name="valor"
          value={formData.valorFormatado}
          onChange={handleValorChange}
          className="expense-form-input"
          placeholder="0,00"
          inputMode="numeric"
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
    </>
  );
}

ExpenseForm.propTypes = {
  despesaInicial: PropTypes.shape({
    descricao: PropTypes.string,
    titulo: PropTypes.string,
    title: PropTypes.string,
    valor: PropTypes.number,
    amount: PropTypes.number,
    data: PropTypes.string,
    date: PropTypes.string,
    categoria: PropTypes.string,
    category: PropTypes.string,
    recorrente: PropTypes.bool,
    recurring: PropTypes.bool,
    tipoRecorrencia: PropTypes.string,
    recurrenceType: PropTypes.string,
    notas: PropTypes.string,
    notes: PropTypes.string,
  }),
  aoSalvar: PropTypes.func,
  aoCancelar: PropTypes.func,
};
