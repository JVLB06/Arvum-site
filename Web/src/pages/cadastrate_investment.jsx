import { useState } from "react";
import cadastrate from "../services/cadastrate.js";
import "../styles/cadastrate_investment.css";
import { BackButtonHeader } from "../components/backButtonHeader.jsx";

export function CadastrateInvestmento() {
    const [descricao, setDescricao] = useState("");
    const [vlr, setVlr] = useState("");
    const [data_init, setData_init] = useState("");
    const [juro, setJuro] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function preencherNomeInvestimento(valor) {
        setDescricao(valor);
    }

    async function enviaInvestimento(event) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const dados = await cadastrate.createInvestment({
                descricao,
                vlr,
                data_init,
                juro
            });

            alert("Investimento cadastrado com sucesso!");

            setDescricao("");
            setVlr("");
            setData_init("");
        } catch (err) {
            const mensagem =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Erro ao cadastrar renda.";

            setError(mensagem);
            alert(mensagem);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="main">
            <div className="grid">
                <section className="form">
                    <BackButtonHeader title={<>
                        Qual <span>investimento</span> você quer incluir?
                    </>} />
                    <form onSubmit={enviaInvestimento}>
                        <label htmlFor="investimento_cad_nome">Nome da aplicação</label><br/>
                        <input id="investimento_cad_nome" name="investimento_cad_nome" 
                        type="text" 
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)} required/>
                        <br/>
                        <label htmlFor="investimento_cad_data_init">Data início:</label>
                        <input id="investimento_cad_data_init" 
                        name="investimento_cad_data_init" 
                        type="date" required
                        value={data_init}
                        onChange={(e) => setData_init(e.target.value)}/>
                        <br/>
                        <label htmlFor="investimento_cad_data_fim">Data fim prevista</label>
                        <input id="investimento_cad_data_fim" 
                        name="investimento_cad_data_fim" 
                        type="date" required
                        value={data_init}
                        onChange={(e) => setData_init(e.target.value)}/>
                        <br/>
                        <label htmlFor="investimento_cad_vlr">Valor aplicado:</label>
                        <input id="investimento_cad_vlr" 
                        name="investimento_cad_vlr" 
                        type="number" 
                        step="0.01" required
                        value={vlr}
                        onChange={(e) => setVlr(e.target.value)}/>
                        <br/>
                        <label htmlFor="investimento_cad_juros">Juros:</label>
                        <input id="investimento_cad_juros" 
                        name="investimento_cad_juros" 
                        type="number" required
                        value={juro}
                        onChange={(e) => setJuro(e.target.value)}/>
                        <br/>
                        <button type="submit" name="submit">Incluir</button>
                    </form>
                </section>
                <aside className="sugestoes">
                    <table className="suggestion-table">
                        <tr>
                            <th>Opções comuns</th>
                        </tr>
                        <div className="scroll">
                            <tr>
                                <td><button type="button" className="fill-button"
                                onClick={() => preencherNomeInvestimento("Carro")}>Carro</button></td>
                            </tr>
                            <tr>
                                <td><button type="button" className="fill-button"
                                onClick={() => preencherNomeInvestimento("Casa própria")}>Casa própria</button></td>
                            </tr>
                            <tr>
                                <td><button type="button" className="fill-button"
                                onClick={() => preencherNomeInvestimento("Casa para aluguel")}>Casa para aluguel</button></td>
                            </tr>
                            <tr>
                                <td><button type="button" className="fill-button"
                                onClick={() => preencherNomeInvestimento("Faculdade")}>Faculdade</button></td>
                            </tr>
                            <tr>
                                <td><button type="button" className="fill-button"
                                onClick={() => preencherNomeInvestimento("Viagem")}>Viagem</button></td>
                            </tr>
                        </div>
                    </table>
                </aside>
            </div>
        </div>
    );
}