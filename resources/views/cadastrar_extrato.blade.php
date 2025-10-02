@extends('layout')
@section('style', 'cadastrar_extrato.css')
@section('title', 'Incluir Lançamento')
@section('content')
        <div class="main">
            <div class="grid">
                <section class="form">
                    <div class="header">
                        <button class="back-button" onclick="window.history.back();">&lt;</button>
                        <h1><strong>O que aconteceu nesse dia?</strong></h1>
                    </div>
                    <form action="{{ route('cadastrar_extrato') }}" method="POST">
                        @csrf
                        <div class="paralelo">
                            <label for="extrato_cad_vlr">Valor:</label>
                            <input name="extrato_cad_vlr" type="number" step="0.01" required>
                        </div>
                            <br>
                        <div class="paralelo">
                            <label for="extrato_cad_data">Data:</label>
                            <input name="extrato_cad_data" type="date" required>
                            
                        </div>
                        <br>
                        <label for="extrato_cad_hist">Histórico</label><br>
                        <input name="extrato_cad_hist" type="text" required placeholder="Descrição da movimentação">
                        <br>
                        <button type="submit" name="submit">Incluir</button>
                    </form>
                </section>
                <aside class="sugestoes">
                    <div class="scroll">
                        <table class="suggestion-table">
                            <tr>
                                <th>Opções comuns</th>
                            </tr>
                            
                            @foreach ($data as $lista):
                                @foreach ($lista as $item):
                                    <tr><td><button type="button" class="btn-preencher"
                                    data-hist='<?php echo htmlspecialchars($item["historico"], ENT_QUOTES, 'UTF-8'); ?>'
                                    data-vlr="<?php echo htmlspecialchars($item['vlr'], ENT_QUOTES, 'UTF-8'); ?>">
                                    <?php echo htmlspecialchars($item['historico'], ENT_QUOTES, 'UTF-8'); ?>
                                    </button></td></tr>
                                @endforeach
                            @endforeach
                        </table>
                    </div>
                </aside>
            </div>
        </div>
        <script src="{{ asset('estilos/index.js') }}"></script>
@endsection