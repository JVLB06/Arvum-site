@extends('layout')
@section('style', 'dashboard.css')
@section('title', 'Dashboard')
@section('content')
        <nav>
            <div class="logo">
                <img src="../adicionais/patinhas_grana.png" alt="Logo">
                <span>Nome da Empresa</span>
            </div>
            <div class="nav-links">
                <a href="{{ route('extrato') }}"><button class="head_button"><strong>Extrato</strong></button></a>
                <a href="{{ route('renda') }}"><button class="head_button"><strong>Renda</strong></button></a>
                <a href="{{ route('gasto') }}"><button class="head_button"><strong>Gastos</strong></button></a>
                <a href="{{ route('investimento') }}"><button class="head_button"><strong>Investimentos</strong></button></a>
                <a href="{{ route('meta') }}"><button class="head_button"><strong>Metas</strong></button></a>
                <!--sugest--><a href="{{ route('meta') }}"><button class="head_button"><strong>Sugestões</strong></button></a>
                <a href="{{ route('meta') }}"><button class="head_button"><strong>Perfil</strong></button></a>            
            </div>
            <div class="nav-right">
                <!--Alterações no perfil, editar perfil ou sair-->
                <button class="tema" id="troca_tema"></button>
            </div>
        </nav>
        <div class="corpo">
            <main>
                <section class="dados">
                    <div class="grafico-container">
                        <div class="legenda">
                            <div class="legenda-item"><span style="background-color: rgb(11, 61, 46);"></span> Renda</div>
                            <div class="legenda-item"><span style="background-color: rgb(201, 162, 39);"></span> Gasto</div>
                            <div class="legenda-item"><span style="background-color: rgb(8, 76, 97);"></span> Investimento</div>
                            <div class="legenda-item"><span style="background-color: rgb(145, 40, 36);"></span> Dívida</div>
                        </div>
                        <canvas id="grafico"></canvas>
                        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
                        <script>
                            var ctx = document.getElementById('grafico').getContext('2d');
                            var valores = [{{ $data['renda'] ?? 0 }},{{ $data['gasto'] ?? 0 }},{{ $data['investimento'] ?? 0 }},{{ $data['divida'] ?? 0 }}];
                            // Se todos os valores forem 0, substituí-los por valores iguais para exibição
                            if (valores.every(v => v === 0)) {
                                valores = [100, 100, 100, 100];
                            }
                            var meuGrafico = new Chart(ctx, {
                                type: 'pie',
                                data: {
                                labels: ['Renda', 'Gasto', 'Investimento', 'Dívida'],
                                datasets: [{data: valores, backgroundColor: ['rgb(11, 61, 46)', 'rgb(201, 162, 39)', 'rgb(8, 76, 97)', 'rgb(145, 40, 36)']}]},
                                options: { 
                                    plugins: {
                                        legend: {display: false} // Remove a legenda
                            }}});
                        </script>        
                    </div>
                </section>
            </main>
            <div class="funcoes">
                <div class="opcoes">
                    <div class="option">
                        <a href="{{ route('cadastrar_renda') }}">+</a>
                        <span>Incluir nova renda</span>
                    </div>
                    <div class="option">
                        <a href="{{ route('cadastrar_gasto') }}">+</a>
                        <span>Incluir novo gasto</span>
                    </div>
                    <div class="option">
                        <a href="{{ route('cadastrar_investimento') }}">+</a>
                        <span>Incluir novo investimento</span>
                    </div>
                    <div class="option">
                        <a href="{{ route('cadastrar_meta') }}">+</a>
                        <span>Incluir nova meta</span>
                    </div>
                    <div class="option">
                        <a href="{{ route('cadastrar_extrato') }}">+</a>
                        <span>Incluir novo lançamento</span>
                    </div>
                    <h2>Frase do pensador:</h2>
                </div>
                <div class="pensador">
                    <h3><em>{{ $frase['content'] }}</em> - {{ $frase['author'] }}</h3>
                </div>
            </div>
        </div>        
        <footer>
            <div class="sugest">
                <h3>Nos dê sugestões</h3>
            </div>
            <div class="redes_sociais">
                <h3>Siga nossas redes sociais</h3>
            </div>
            <div class="sla">
                <h3>E eu sei lá</h3>
            </div>
        </footer>
        <script src="{{ asset('estilos/index.js') }}"></script>
@endsection