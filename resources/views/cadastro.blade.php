@extends('layout')
@section('style', 'cadastro.css')
@section('title', 'Cadastro')
@section('content')
        <div class="main">
            <div class="header">
                <button class="back-button" onclick="window.history.back();">&lt;</button>
                <h1><strong>Primeira vez? Cadastre-se aqui!</strong></h1>
            </div>
            <form class="grid" action="{{ route('cadastro') }}" method="POST">
                @csrf
                <section class="form">
                    <label for="cadastro_nome">Qual o seu nome?</label>
                    <input id="cadastro_nome"  name="cadastro_nome" type="text" required>
            
                    <label for="cadastro_email">Qual o seu melhor email?</label>
                    <input id="cadastro_email" name="cadastro_email" type="email" required>
            
                    <label for="cadastro_nasce">Quando você nasceu?</label>
                    <input id="cadastro_nasce" name="cadastro_nasce" type="date" required>
            
                    <label for="cadastro_senha">Crie uma senha segura:</label>
                    <input id="cadastro_senha" name="cadastro_senha" type="password" required>
            
                    <label for="cadastro_confirma_senha">Confirme sua senha:</label>
                    <input id="cadastro_confirma_senha" name="cadastro_confirma_senha" type="password" required>
                </section>
                <aside class="pensar">
                    <p id="frase_do_dia"><em>{{ $obter['content'] ?? 'Bom dia'}}</em> - {{ $obter['author'] }}</p>
                    <button type="submit" name="submit">Cadastrar</button>
                </aside>
            </form>
        </div>
        <script src="{{ asset('estilos/index.js') }}"></script>
@endsection