'use client';

import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#34d399', '#fbbf24', '#60a5fa', '#f87171', '#a78bfa', '#fb923c', '#fb7185', '#4ade80'];

export function PieChartCategories({ data }) {
  if (!data || data.length === 0) return null;

  // Detecta se é mobile
  const isMobile = globalThis.window !== undefined && globalThis.window.innerWidth < 768;
  const outerRadius = isMobile ? 80 : 120;

  return (
    <div style={{ width: '100%', height: '400px', background: '#f9fafb', padding: '1.5rem', borderRadius: '8px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={isMobile ? false : (entry) => `${entry.categoria}: R$ ${entry.total.toFixed(2)}`}
            outerRadius={outerRadius}
            fill="#8884d8"
            dataKey="total"
            nameKey="categoria"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${entry.categoria}-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => `R$ ${value.toFixed(2)}`}
            contentStyle={{ fontSize: isMobile ? '12px' : '14px' }}
          />
          <Legend 
            wrapperStyle={{ fontSize: isMobile ? '12px' : '14px' }}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Calcula configurações responsivas para o gráfico de barras
 */
function getResponsiveChartConfig() {
  const isMobile = globalThis.window !== undefined && globalThis.window.innerWidth < 768;
  
  return {
    chartHeight: isMobile ? '350px' : '400px',
    margins: { 
      top: isMobile ? 10 : 20, 
      right: isMobile ? 5 : 30, 
      left: isMobile ? 5 : 60, 
      bottom: isMobile ? 60 : 40 
    },
    barSize: isMobile ? 20 : 40,
    fontSize: {
      tick: isMobile ? '9px' : '12px',
      yTick: isMobile ? '8px' : '12px',
      tooltip: isMobile ? '10px' : '14px',
      legend: isMobile ? '10px' : '14px'
    },
    yAxisWidth: isMobile ? 40 : 80,
    xAxisLabel: isMobile ? undefined : { 
      value: 'Mês', 
      position: 'insideBottom', 
      offset: -10,
      style: { fontSize: '14px', fontWeight: 'bold' }
    },
    yAxisLabel: isMobile ? undefined : { 
      value: 'Valor (R$)', 
      angle: -90, 
      position: 'insideLeft',
      offset: 10,
      style: { fontSize: '14px', fontWeight: 'bold' }
    },
    interval: isMobile ? 0 : 'preserveStartEnd'
  };
}

export function BarChartMonths({ data }) {
  if (!data || data.length === 0) return null;

  const config = getResponsiveChartConfig();

  return (
    <div style={{ 
      width: '100%', 
      height: config.chartHeight, 
      background: '#f9fafb', 
      padding: config.margins.top > 10 ? '1.5rem' : '0.75rem', 
      borderRadius: '8px' 
    }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={config.margins}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="mes" 
            label={config.xAxisLabel}
            tick={{ fontSize: config.fontSize.tick }}
            interval={config.interval}
          />
          <YAxis 
            label={config.yAxisLabel}
            tick={{ fontSize: config.fontSize.yTick }}
            width={config.yAxisWidth}
          />
          <Tooltip 
            formatter={(value) => `R$ ${value.toFixed(2)}`}
            contentStyle={{ fontSize: config.fontSize.tooltip }}
          />
          <Legend 
            wrapperStyle={{ 
              paddingTop: config.margins.top > 10 ? '40px' : '15px', 
              fontSize: config.fontSize.legend 
            }}
            iconType="square"
            verticalAlign="bottom"
          />
          <Bar dataKey="total" fill="#34d399" name="Total Gasto" barSize={config.barSize} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

PieChartCategories.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      categoria: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired,
    })
  ),
};

BarChartMonths.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      mes: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired,
    })
  ),
};
