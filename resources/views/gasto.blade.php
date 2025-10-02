@extends('layout')
@section('style', 'gasto.css')
@section('title', 'Gastos')
@section('content')
<nav>
    <div class="logo">
        <button class="back-button" onclick="window.history.back();">&lt;</button>
        <img src="../adicionais/patinhas_grana.png" alt="Logo">
        <span>Rendas</span>
    </div>
    <div class="nav-links">
        <a href="{{ route('editar_gasto') }}"><button>Icone lápis</button></a>
        <a href="{{ route('cadastrar_gasto') }}"><button>+</button></a>
        <button class="tema" id="troca_tema"></button>
    </div>
</nav>
<div class="structure">
    <div class="corpo">
        <div class="gastos">
            @foreach($data as $item)
                <h2><span>{{ $item['nome'] }}</span>{{ $item['vlr'] }}</h2>
            @endforeach
        </div>
        <div class="grafico-container">
            <canvas id="grafico"></canvas>
            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
            <script>
                var ctx = document.getElementById('grafico').getContext('2d');
                 // Pegar os dados do Laravel e transformá-los em um array
                var dataLaravel = @json($data);
                var labels = dataLaravel['nome'] || []; // Pega os nomes
                var valores = dataLaravel['vlr'] || []; // Pega os valores
                var cores = ['rgb(11, 61, 46)', 'rgb(201, 162, 39)', 'rgb(8, 76, 97)', 'rgb(145, 40, 36)', 'rgb(100, 100, 255)', 'rgb(255, 100, 100)'];
                // Se todos os valores forem 0, substituí-los por valores iguais para exibição
                if (valores.every(v => v === 0)) {
                    valores = [100, 100, 100, 100];
                }
                var meuGrafico = new Chart(ctx, {
                    type: 'pie',
                    data: {
                    labels: labels,
                    datasets: [{data: valores, backgroundColor: cores.slice(0, labels.length)}]},
                    options: { 
                        plugins: {
                            legend: {display: false} // Remove legenda
                }}});
            </script>        
        </div>
    </div>
    <div class="colum-graphic">
        <canvas id="graficoColuna"></canvas>
        <script>
            document.addEventListener("DOMContentLoaded", function() {
                var ctxColunas = document.getElementById('grafico_colunas').getContext('2d');
                // Capturar os dados de meses anteriores do Laravel
                var dadosAnteriores = @json($antes);
                var labelsMeses = Object.keys(dadosAnteriores); // Pega os meses
                var valoresMeses = Object.values(dadosAnteriores); // Pega os valores
                var estimativa = @json($estimate);
                // Se todos os valores forem 0, definir valores padrão
                if (valoresMeses.every(v => v === 0)) {
                    valoresMeses = new Array(labelsMeses.length).fill(100);
                }
                var graficoColunas = new Chart(ctxColunas, {
                    type: 'bar',
                    data: {
                        labels: labelsMeses,
                        datasets: [{
                            label: 'Renda Mensal',
                            data: valoresMeses,
                            backgroundColor: 'rgb(11, 61, 46)', // Verde padrão
                            borderColor: 'rgb(245,245,245)',
                            borderWidth: 0
                        },
                        {
                        label: 'Estimativa ideal',
                        data: valoresLinha,
                        type: 'line', // Adiciona a linha
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgb(201, 162, 39)',
                        borderWidth: 0,
                        pointRadius: 4,
                        tension: 0.4 // Suaviza a curva
                    }]},
                    options: {
                        responsive: true,
                        scales: {
                            y: { beginAtZero: true }
                        },
                        plugins: {
                            legend: { display: true }
                        }
                    }
                });
            });
        </script>
        <script src="{{ asset('estilos/index.js') }}"></script>
    </div>
</div>
@endsection