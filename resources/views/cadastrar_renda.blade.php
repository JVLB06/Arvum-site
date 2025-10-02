@extends('layout')
@section('style', 'cadastrar_renda.css')
@section('title', 'Cadastrar Renda')
@section('content')
        <div class="main">
            <div class="grid">
                <section class="form">
                    <div class="header">
                        <button class="back-button" onclick="window.history.back();">&lt;</button>
                        <h1><strong>Qual <span>renda</span> você quer incluir?</strong></h1>
                    </div>
                    <form>
                        <label for="renda_cad_nome">Nome da renda</label><br>
                        <input id="renda_cad_nome" name="renda_cad_nome" type="text" required placeholder="Qualquer tipo de entrada é válida">
                        <br>
                        <label for="renda_cad_data">Data do último recebimento:</label>
                        <input id="renda_cad_data" name="renda_cad_data" type="date" required>
                        <br>
                        <label for="renda_cad_vlr">Valor médio:</label>
                        <input id="renda_cad_vlr" name="renda_cad_vlr" type="number" step="0.01" required>
                        <br>
                        <button type="submit" name="submit">Incluir</button>
                    </form>
                </section>
                <aside class="sugestoes">
                    <table class="suggestion-table">
                    <tr>
                        <th>Opções comuns</th>
                    </tr>
                    <div class="scroll">
                        <tr>
                            <td><button type="button" class="fill-button" data-value="Salário" data-target="renda_cad_nome">Salário</button></td>
                        </tr>
                        <tr>
                            <td><button type="button" class="fill-button" data-value="Pro-labore" data-target="renda_cad_nome">Pro-labore</button></td>
                        </tr>
                        <tr>
                            <td><button type="button" class="fill-button" data-value="Aluguel" data-target="renda_cad_nome">Aluguel</button></td>
                        </tr>
                        <tr>
                            <td><button type="button" class="fill-button" data-value="Vendas" data-target="renda_cad_nome">Vendas</button></td>
                        </tr>
                    </div>
                </table>
                </aside>
            </div>
        </div>
        <script src="{{ asset('estilos/index.js') }}"></script>
@endsection