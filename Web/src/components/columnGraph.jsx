import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import '../styles/columnGraph.css';

const COLORS = ['#0F3B2E', '#D4A017', '#084C61', '#912824'];

export const BarChart = ({ dataItems = [], title = 'Evolução mensal', legendLabel = 'Valor mensal', series = [] }) => {
  const canvasRef = useRef(null);
  const chartInstance = useRef(null);
  const safeData = Array.isArray(dataItems) && dataItems.length ? dataItems : [{ label: '—', value: 0 }];
  const labels = safeData.map(item => item.label);
  const datasets = series.length
    ? series.map((item, index) => ({
        label: item.label,
        data: safeData.map(row => Number(row[item.key] || 0)),
        type: item.type || 'line',
        backgroundColor: item.color || COLORS[index % COLORS.length],
        borderColor: item.color || COLORS[index % COLORS.length],
        borderWidth: item.type === 'bar' ? 0 : 2,
        borderRadius: item.type === 'bar' ? 7 : 0,
        pointRadius: item.type === 'bar' ? 0 : 3,
        tension: 0.25,
        maxBarThickness: 38,
      }))
    : [{ label: legendLabel, data: safeData.map(item => Number(item.value || 0)), backgroundColor: '#0F3B2E', hoverBackgroundColor: '#D4A017', borderRadius: 8, borderSkipped: false, maxBarThickness: 38 }];

  useEffect(() => {
    if (!canvasRef.current) return;
    chartInstance.current?.destroy();
    chartInstance.current = new Chart(canvasRef.current.getContext('2d'), {
      type: 'bar', data: { labels, datasets },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: datasets.length > 1 || Boolean(series.length), labels: { color: '#627A73', usePointStyle: true, boxWidth: 8 } },
          tooltip: { backgroundColor: '#0F3B2E', titleColor: '#D4A017', bodyColor: '#FFFFFF', padding: 12, cornerRadius: 10,
            callbacks: { label: context => ` ${context.dataset.label || 'Total'}: ${Number(context.raw || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}` } }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#627A73', font: { weight: '600', size: 11 } }, border: { display: false } },
          y: { beginAtZero: true, grid: { color: 'rgba(15, 59, 46, 0.06)', drawBorder: false }, ticks: { color: '#627A73', font: { size: 11 }, callback: value => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value }, border: { display: false } }
        }
      }
    });
    return () => chartInstance.current?.destroy();
  }, [dataItems, series, title, legendLabel]);

  return <div className="column-chart-card">
    <div className="column-chart-header"><h3 className="column-chart-title">{title}</h3>
      {!series.length && <div className="column-chart-legend"><span className="legend-dot"></span><span>{legendLabel}</span></div>}
    </div>
    <div className="column-chart-body"><canvas ref={canvasRef}></canvas></div>
  </div>;
};
export default BarChart;
