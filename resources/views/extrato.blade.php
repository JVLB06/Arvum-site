@extends('layout')
@section('style', 'extrato.css')
@section('title', 'Extrato')
@section('content')
    <div class="main">
        <div class="header">
            <button class="back-button" onclick="window.history.back();">&lt;</button>
            <div class="right">
                <!-- Ícone de engrenagem que abre o pop-up -->
                <div class="icon-button" id="close_btn" name="filtros">Filtros</div>  
                <!-- Fundo escuro -->
                <div id="overlay"></div>
                <!-- Pop-up com opções -->
                <div id="popup">
                    <div class="options">
                        <label><input type="checkbox" class="filtro" value="renda">Renda</label>
                        <label><input type="checkbox" class="filtro" value="gastos">Gastos</label>
                        <label><input type="checkbox" class="filtro" value="investimentos">Investimentos</label>
                        <label><input type="checkbox" class="filtro" value="meta">Meta</label>
                        <label><input type="checkbox" class="filtro" value="divida">Dívidas</label>
                    </div>
                </div>
                <div class="date">
                    <input type="date" id="init" name="data_init">
                    <span>a</span>
                    <input type="date" id="fim" name="data_fim">
                </div>
            </div>
        </div>
        <div class="extrato">
            @foreach ($values as $item)
                <div class="lcto">
                    <h2>{{ $item }}</h2>
                    <strong>{{ $item }}</strong>
                    <strong>{{ $item }}</strong>
                    <span><h3>Nº lcto</h3>{{ $item }}</span>
                </div>   
            @endforeach
        </div>
    </div>
@endsection