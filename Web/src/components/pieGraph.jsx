import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const PieChart = ({ dataItems }) => {
  const canvasRef = useRef(null);
  const chartInstance = useRef(null);

  // Extraímos os labels, valores e cores do array que vier por prop
  const labels = dataItems.map(item => item.label);
  let values = dataItems.map(item => item.value);
  const colors = dataItems.map(item => item.color);

  // Lógica que você tinha no Blade: se tudo for 0, mostra igualitário
  if (values.every(v => v === 0 || !v)) {
    values = new Array(dataItems.length).fill(100);
  }

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy(); // Limpa o gráfico anterior antes de criar um novo
    }

    const ctx = canvasRef.current.getContext('2d');
    
    chartInstance.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderWidth: 0
        }]
      },
      options: {
        plugins: {
          legend: { display: false } // Mantendo sua preferência de legenda manual
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });

    // Cleanup: destrói o gráfico se o componente sumir da tela
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [dataItems]); // Sempre que os dados mudarem, o gráfico atualiza

  return (
    <section className="dados">
      <div className="grafico-container">
        {/* Legenda Dinâmica baseada nos itens */}
        <div className="legenda">
          {dataItems.map((item, index) => (
            <div className="legenda-item" key={index}>
              <span style={{ backgroundColor: item.color }}></span> 
              {item.label}
            </div>
          ))}
        </div>
        
        {/* O Canvas onde o Chart.js vai desenhar */}
        <div style={{ position: 'relative', height: '300px', width: '300px' }}>
          <canvas ref={canvasRef}></canvas>
        </div>
      </div>
    </section>
  );
};

export default PieChart;