@extends('layout')
@section('style', 'cadastrar_investimento.css')
@section('title', 'Cadastrar Investimento')
@section('content')
        <div class="main">
            <div class="grid">
                <section class="form">
                    <div class="header">
                        <button class="back-button" onclick="window.history.back();">&lt;</button>
                        <h1><strong>Qual <span>investimento</span> você quer incluir?</strong></h1>
                    </div>
                    <form>
                        <label for="investimento_cad_nome">Nome da aplicação</label><br>
                        <input id="investimento_cad_nome" name="investimento_cad_nome" type="text" required>
                        <br>
                        <label for="investimento_cad_data_init">Data início:</label>
                        <input id="investimento_cad_data_init" name="investimento_cad_data_init" type="date" required>
                        <br>
                        <label for="investimento_cad_data_fim">Data fim prevista</label>
                        <input id="investimento_cad_data_fim" name="investimento_cad_data_fim" type="date" required>
                        <br>
                        <label for="investimento_cad_vlr">Valor aplicado:</label>
                        <input id="investimento_cad_vlr" name="investimento_cad_vlr" type="number" step="0.01" required>
                        <br>
                        <label for="investimento_cad_juros">Juros:</label>
                        <input id="investimento_cad_juros" name="investimento_cad_juros" type="number" required>
                        <br>
                        <div class="radio-group">
                            <label>Renda variável?</label>
                            <div class="radio-option">
                                <input type="radio" id="bloquear_sim" name="investimento_cad_option" value="sim">
                                <label for="bloquear_sim">Sim</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" id="bloquear_nao" name="investimento_cad_option" value="nao" checked>
                                <label for="bloquear_nao">Não</label>
                            </div>
                        </div>
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
                            <td><button type="button" class="fill-button" data-value="Carro" data-target="investimento_cad_nome">Carro</button></td>
                        </tr>
                        <tr>
                            <td><button type="button" class="fill-button" data-value="Casa própria" data-target="investimento_cad_nome">Casa própria</button></td>
                        </tr>
                        <tr>
                            <td><button type="button" class="fill-button" data-value="Casa para alguel" data-target="investimento_cad_nome">Casa para aluguel</button></td>
                        </tr>
                        <tr>
                            <td><button type="button" class="fill-button" data-value="Faculdade" data-target="investimento_cad_nome">Faculdade</button></td>
                        </tr>
                        <tr>
                            <td><button type="button" class="fill-button" data-value="Viagem" data-target="investimento_cad_nome">Viagem</button></td>
                        </tr>
                    </div>
                </table>
                </aside>
            </div>
        </div>
        <script src="{{ asset('estilos/index.js') }}"></script>
@endsection