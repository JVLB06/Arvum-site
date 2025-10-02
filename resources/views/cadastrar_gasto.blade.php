@extends('layout')
@section('style', 'cadastrar_gasto.css')
@section('title', 'Cadastrar Gasto')
@section('content')
        <div class="main">
            <div class="grid">
                <section class="form">
                    <div class="header">
                        <button class="back-button" onclick="window.history.back();">&lt;</button>
                        <h1><strong>Qual <span>gasto</span> você quer incluir?</strong></h1>
                    </div>
                    <form>
                        <label for="gasto_cad_nome">Nome do gasto</label>
                        <input id="gasto_cad_nome" name="gasto_cad_nome" type="text" required placeholder="Desconsidere parcelamentos e financiamentos">
                        <br>
                        <label for="gasto_cad_data">Data do último pagamento:</label>
                        <input id="gasto_cad_data" name="gasto_cad_data" type="date" required>
                        <br>
                        <label for="gasto_cad_vlr_min">Valor mínimo:</label>
                        <input id="gasto_cad_vlr_min" name="gasto_cad_vlr_min" type="number" step="0.01" required>
                        <br>
                        <label for="gasto_cad_vlr_max">Valor máximo:</label>
                        <input id="gasto_cad_vlr_max" name="gasto_cad_vlr_max" type="number" step="0.01" required>
                        <br>
                        <div class="radio-group">
                            <label>Nível de prioridade:</label>
                            <div class="radio-option">
                                <input type="radio" id="gasto_cad_prioridade_baixa" name="gasto_cad_prioridade" value="baixa">
                                <label for="gasto_cad_prioridade_baixa">Baixa</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" id="gasto_cad_prioridade_media" name="gasto_cad_prioridade" value="media">
                                <label for="gasto_cad_prioridade_media">Média</label>                
                            </div>
                            <div class="radio-option">
                                <input type="radio" id="gasto_cad_prioridade_alta" name="gasto_cad_prioridade" value="alta">
                                <label for="gasto_cad_prioridade_alta">Alta</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" id="gasto_cad_prioridade_essencial" name="gasto_cad_prioridade" value="essencial">
                                <label for="gasto_cad_prioridade_essencial">Essencial</label>
                            </div>
                        </div>
                        <br>
                        <div class="radio-group">
                            <label>Gasto fixo ou variável?</label>
                            <div class="radio-option">
                                <input type="radio" id="gasto_fixo" name="gasto_cad_fixvar" value="fixo">
                                <label for="gasto_fixo">Fixo</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" id="gasto_variavel" name="gasto_cad_fixvar" value="variavel">
                                <label for="gasto_variavel">Variável</label>
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
                            <td><button type="button" class="fill-button" data-value="Aluguel" data-target="gasto_cad_nome">Aluguel</button></td>
                        </tr>
                        <tr>
                            <td><button type="button" class="fill-button" data-value="Internet" data-target="gasto_cad_nome">Internet</button></td>
                        </tr>
                        <tr>
                            <td><button type="button" class="fill-button" data-value="Supermercado" data-target="gasto_cad_nome">Supermercado</button></td>
                        </tr>
                        <tr>
                            <td><button type="button" class="fill-button" data-value="Energia" data-target="gasto_cad_nome">Energia</button></td>
                        </tr>
                        <tr>
                            <td><button type="button" class="fill-button" data-value="Gás" data-target="gasto_cad_nome">Gás</button></td>
                        </tr>
                        <tr>
                            <td><button type="button" class="fill-button" data-value="Bar" data-target="gasto_cad_nome">Bar</button></td>
                        </tr>
                        <tr>
                            <td><button type="button" class="fill-button" data-value="Lanches" data-target="gasto_cad_nome">Lanches</button></td>
                        </tr>
                        <tr>
                            <td><button type="button" class="fill-button" data-value="Almoço" data-target="gasto_cad_nome">Almoço</button></td>
                        </tr>
                        <tr>
                            <td><button type="button" class="fill-button" data-value="Gasolina" data-target="gasto_cad_nome">Gasolina</button></td>
                        </tr>
                        <tr>
                            <td><button type="button" class="fill-button" data-value="Viagem" data-target="gasto_cad_nome">Viagem</button></td>
                        </tr>
                        <tr>
                            <td><button type="button" class="fill-button" data-value="Compras" data-target="gasto_cad_nome">Compras</button></td>
                        </tr>
                        <tr>
                            <td><button type="button" class="fill-button" data-value="Roupas" data-target="gasto_cad_nome">Roupas</button></td>
                        </tr>
                    </div>
                </table>
                </aside>
            </div>
        </div>
        <script src="{{ asset('estilos/index.js') }}"></script>
@endsection