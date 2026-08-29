import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import '../styles/columnGraph.css';

export const BarChart = ({ dataItems = [] }) => {
  const canvasRef = useRef(null);
  const chartInstance = useRef(null);

  const safeData = Array.isArray(dataItems) && dataItems.length > 0
    ? dataItems
    : [{ label: 'jan', value: 0, color: '#0F3B2E' }];

  const labels = safeData.map(item => item.label);
  const values = safeData.map(item => Number(item.value || 0));
  const colors = safeData.map(item => item.color || '#0F3B2E');

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: '#0F3B2E',
          hoverBackgroundColor: '#D4A017',
          borderRadius: 8,
          borderSkipped: false,
          maxBarThickness: 38,
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
                const val = Number(context.raw || 0);
                return ` Total: ${val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#627A73',
              font: { weight: '600', size: 12 }
            },
            border: { display: false }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(15, 59, 46, 0.06)',
              drawBorder: false
            },
            ticks: {
              color: '#627A73',
              font: { size: 11 },
              callback: function(value) {
                return value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value;
              }
            },
            border: { display: false }
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
    <div className="column-chart-card">
      <div className="column-chart-header">
        <h3 className="column-chart-title">Evolução Mensal</h3>
        <div className="column-chart-legend">
          <span className="legend-dot"></span>
          <span>Valores mensais</span>
        </div>
      </div>
      <div className="column-chart-body">
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
};

export default BarChart;