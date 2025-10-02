@extends('layout')
@section('style', 'login.css')
@section('title', 'Login')
@section('content')
        <div class="main">
            <div class="header">
                <button class="back-button" onclick="window.history.back();">&lt;</button>
                <h1><strong>Acesse sua conta aqui!</strong></h1>
            </div>
            <form class="grid" action="{{ route('login') }}" method="POST">
                <aside class="pensar">
                    <p id="frase_do_dia"><em>{{ $obter['content'] ?? 'Bom dia'}}</em> - {{ $obter['author'] }}</p>
                    </aside>
                <section class="form">
                    @csrf
                    <label for="login_user">Nome do usuário ou email?</label>
                    <input id="login_user" name="login_user" type="text" required>
                    <label for="login_senha">Confirme sua senha:</label>
                    <input id="login_senha" name="login_senha" type="password" required>
                    <button type="submit" name="submit">Entrar</button>
                </section>
            </form>
        </div>
        <script src="{{ asset('estilos/index.js') }}"></script>
@endsection