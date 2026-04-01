import { useState } from "react";
import cadastrate from "../services/cadastrate.js";
import "../styles/cadastrate_debt.css";
import { BackButtonHeader } from "../components/BackButtonHeader.jsx";

export function CadastrateDebt() {
    const [descricao, setDescricao] = useState("");
    const [vlr, setVlr] = useState("");
    const [data_venc, setData_venc] = useState("");
    const [data_init, setData_init] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function preencherNomeDivida(valor) {
        setDescricao(valor);
    }

    async function enviaDivida(event) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const dados = await cadastrate.createDebt({
                descricao,
                vlr,
                data_venc,
                data_init
            });

            alert("Dívida cadastrada com sucesso!");

            setDescricao("");
            setVlr("");
            setData_venc("");
            setData_init("");
        } catch (err) {
            const mensagem =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Erro ao cadastrar dívida.";

            setError(mensagem);
            alert(mensagem);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div class="main">
            <div class="grid">
                <section class="form">
                    <BackButtonHeader title={<>
                        Qual <span>divida</span> você quer incluir?
                    </>} />
                    <form onSubmit={enviaDivida}>
                        <label htmlFor="divida_cad_nome">Nome da divida</label><br/>
                        <input id="divida_cad_nome" name="divida_cad_nome" 
                        type="text" required
                        value={descricao} onChange={(e) => setDescricao(e.target.value)}/>
                        <br/>
                        <label htmlFor="divida_cad_data_init">Data início:</label>
                        <input id="divida_cad_data_init" name="divida_cad_data_init" 
                        type="date" required
                        value={data_init} onChange={(e) => setData_init(e.target.value)}/>
                        <br/>
                        <label htmlFor="divida_cad_data_fim">Data fim prevista</label>
                        <input id="divida_cad_data_fim" name="divida_cad_data_fim" 
                        type="date" required
                        value={data_venc} onChange={(e) => setData_venc(e.target.value)}/>
                        <br/>
                        <label htmlFor="divida_cad_vlr">Valor total dívida:</label>
                        <input id="divida_cad_vlr" name="divida_cad_vlr" type="number" step="0.01" required
                        value={vlr} onChange={(e) => setVlr(e.target.value)}/>
                        <br/>
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
                                <td><button type="button" class="fill-button"
                                onClick={() => preencherNomeDivida("Carro")}>Carro</button></td>
                            </tr>
                            <tr>
                                <td><button type="button" class="fill-button"
                                onClick={() => preencherNomeDivida("Casa própria")}>Casa própria</button></td>
                            </tr>
                            <tr>
                                <td><button type="button" class="fill-button"
                                onClick={() => preencherNomeDivida("Casa para aluguel")}>Casa para aluguel</button></td>
                            </tr>
                            <tr>
                                <td><button type="button" class="fill-button"
                                onClick={() => preencherNomeDivida("Faculdade")}>Faculdade</button></td>
                            </tr>
                            <tr>
                                <td><button type="button" class="fill-button"
                                onClick={() => preencherNomeDivida("Viagem")}>Viagem</button></td>
                            </tr>
                        </div>
                    </table>
                </aside>
            </div>
        </div>
    );
}