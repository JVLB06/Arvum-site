@extends('layout')
@section('style', 'cadastrar_meta.css')
@section('title', 'Cadastrar Meta')
@section('content')
        <div class="main">
            <div class="grid">
                <section class="form">
                    <div class="header">
                        <button class="back-button" onclick="window.history.back();">&lt;</button>
                        <h1><strong>Qual <span>meta</span> você quer incluir?</strong></h1>
                    </div>
                    <form>
                        <label for="meta_cad_nome">Nome da meta</label><br>
                        <input id="meta_cad_nome" type="text" required>
                        <br>
                        <label for="meta_cad_data">Data que deseja alcançar a meta</label>
                        <input id="meta_cad_data" type="date" required>
                        <br>
                        <label for="meta_cad_vlr">Valor desejado:</label>
                        <input id="meta_cad_vlr" type="number" step="0.01" required>
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
                            <td><button type="button" class="fill-button" data-value="Carro" data-target="meta_cad_nome">Carro</button></td>
                        </tr>
                        <tr>
                            <td><button type="button" class="fill-button" data-value="Casa própria" data-target="meta_cad_nome">Casa própria</button></td>
                        </tr>
                        <tr>
                            <td><button type="button" class="fill-button" data-value="Casa para alguel" data-target="meta_cad_nome">Casa para aluguel</button></td>
                        </tr>
                        <tr>
                            <td><button type="button" class="fill-button" data-value="Aposentadoria" data-target="meta_cad_nome">Aposentadoria</button></td>
                        </tr>
                        <tr>
                            <td><button type="button" class="fill-button" data-value="Faculdade" data-target="meta_cad_nome">Faculdade</button></td>
                        </tr>
                    </div>
                </table>
                </aside>
            </div>
        </div>
        <script src="{{ asset('estilos/index.js') }}"></script>
@endsection