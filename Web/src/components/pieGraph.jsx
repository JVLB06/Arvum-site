import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import '../styles/pieGraph.css';

const DEFAULT_COLORS = [
  '#0F3B2E', // Verde Profundo
  '#D4A017', // Dourado
  '#084C61', // Azul Petróleo
  '#912824', // Vinho
  '#B4641E', // Bronze
  '#58508D', // Roxo
  '#228B22', // Verde Floresta
  '#D2691E'  // Caramelo
];

export const PieChart = ({ dataItems = [] }) => {
  const canvasRef = useRef(null);
  const chartInstance = useRef(null);

  const safeData = Array.isArray(dataItems) && dataItems.length > 0
    ? dataItems
    : [{ label: 'Sem registros', value: 1, color: '#8B9B96' }];

  const labels = safeData.map(item => item.label);
  let values = safeData.map(item => Number(item.value || 0));
  const colors = safeData.map((item, i) => item.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]);

  const allZero = values.every(v => v === 0);
  const chartValues = allZero ? safeData.map(() => 1) : values;
  const totalValue = values.reduce((acc, v) => acc + v, 0);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: chartValues,
          backgroundColor: colors,
          borderColor: 'transparent',
          borderWidth: 2,
          hoverOffset: 8,
          cutout: '68%'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0F3B2E',
            titleColor: '#D4A017',
            bodyColor: '#FFFFFF',
            padding: 12,
            cornerRadius: 10,
            callbacks: {
              label: function(context) {
                const val = values[context.dataIndex] || 0;
                const percent = totalValue > 0 ? ((val / totalValue) * 100).toFixed(1) : '0.0';
                return ` ${context.label}: ${val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} (${percent}%)`;
              }
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [dataItems]);

  return (
    <div className="grafico-card">
      <div className="grafico-header">
        <h3 className="grafico-title">Distribuição</h3>
        {totalValue > 0 && (
          <span className="grafico-total">
            Total: {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        )}
      </div>

      <div className="grafico-body">
        <div className="canvas-wrapper">
          <canvas ref={canvasRef}></canvas>
          <div className="canvas-center-info">
            <span className="center-label">Total</span>
            <span className="center-value">
              {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>

        <div className="grafico-legenda">
          {safeData.map((item, index) => {
            const val = Number(item.value || 0);
            const percent = totalValue > 0 ? ((val / totalValue) * 100).toFixed(0) : '0';
            const color = item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];

            return (
              <div className="legenda-item-box" key={index}>
                <div className="legenda-indicator" style={{ backgroundColor: color }}></div>
                <div className="legenda-texts">
                  <span className="legenda-label">{item.label}</span>
                  <span className="legenda-val">
                    {val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    <small className="legenda-percent">({percent}%)</small>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PieChart;