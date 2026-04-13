import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BarChart = ({ dataItems }) => {
  const canvasRef = useRef(null);
  const chartInstance = useRef(null);

  const labels = dataItems.map(item => item.label);
  let values = dataItems.map(item => item.value);
  const colors = dataItems.map(item => item.color);

  // Se todos os valores forem 0 ou vazios, evita gráfico "morto"
  if (values.every(v => v === 0 || !v)) {
    values = new Array(dataItems.length).fill(100);
  }

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
            borderWidth: 0,
            borderRadius: 6,
            barThickness: 40
          }
        ]
      },
      options: {
        plugins: {
          legend: { display: false }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#444'
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#444'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.08)'
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
  }, [dataItems, labels, values, colors]);

  return (
    <section className="dados">
      <div className="grafico-container">
        <div className="legenda">
          {dataItems.map((item, index) => (
            <div className="legenda-item" key={index}>
              <span style={{ backgroundColor: item.color }}></span>
              {item.label}
            </div>
          ))}
        </div>

        <div style={{ position: 'relative', height: '300px', width: '300px' }}>
          <canvas ref={canvasRef}></canvas>
        </div>
      </div>
    </section>
  );
};

export default BarChart;