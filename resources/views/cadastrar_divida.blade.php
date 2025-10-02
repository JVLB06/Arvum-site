@extends('layout')
@section('style', 'cadastrar_divida.css')
@section('title', 'Cadastrar Divida')
@section('content')
        <div class="main">
            <div class="grid">
                <section class="form">
                    <div class="header">
                        <button class="back-button" onclick="window.history.back();">&lt;</button>
                        <h1><strong>Qual <span>divida</span> você quer incluir?</strong></h1>
                    </div>
                    <form>
                        <label for="divida_cad_nome">Nome da divida</label><br>
                        <input id="divida_cad_nome" name="divida_cad_nome" type="text" required>
                        <br>
                        <label for="divida_cad_data_init">Data início:</label>
                        <input id="divida_cad_data_init" name="divida_cad_data_init" type="date" required>
                        <br>
                        <label for="divida_cad_data_fim">Data fim prevista</label>
                        <input id="divida_cad_data_fim" name="divida_cad_data_fim" type="date" required>
                        <br>
                        <label for="divida_cad_vlr">Valor total dívida:</label>
                        <input id="divida_cad_vlr" name="divida_cad_vlr" type="number" step="0.01" required>
                        <br>
                        <button type="submit">Incluir</button>
                    </form>
                </section>
                <aside class="sugestoes">
                    <table class="suggestion-table">
                    <tr>
                        <th>Opções comuns</th>
                    </tr>
                    <div class="scroll">
                        <tr>
                            <td><button type="button" class="fill-button" data-value="Carro" data-target="divida_cad_nome">Carro</button></td>
                        </tr>
                        <tr>
                            <td><button type="button" class="fill-button" data-value="Casa própria" data-target="divida_cad_nome">Casa própria</button></td>
                        </tr>
                        <tr>
                            <td><button type="button" class="fill-button" data-value="Casa para alguel" data-target="divida_cad_nome">Casa para aluguel</button></td>
                        </tr>
                        <tr>
                            <td><button type="button" class="fill-button" data-value="Faculdade" data-target="divida_cad_nome">Faculdade</button></td>
                        </tr>
                        <tr>
                            <td><button type="button" class="fill-button" data-value="Viagem" data-target="divida_cad_nome">Viagem</button></td>
                        </tr>
                    </div>
                </table>
                </aside>
            </div>
        </div>
        <script src="{{ asset('estilos/index.js') }}"></script>
@endsection