import { useState } from "react";
import cadastrate from "../services/cadastrate.js";
import "../styles/cadastrate_goal.css";
import { BackButtonHeader } from "../components/backButtonHeader.jsx";

export function CadastrateGoal() {
    const [descricao, setDescricao] = useState("");
    const [vlr, setVlr] = useState("");
    const [data_prev, setData_prev] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function preencherNomeMeta(valor) {
        setDescricao(valor);
    }

    async function enviaMeta(event) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const dados = await cadastrate.createGoal({
                descricao,
                vlr,
                data_prev
            });

            alert("Meta cadastrada com sucesso!");

            setDescricao("");
            setVlr("");
            setData_prev("");
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
                        Qual <span>meta</span> você quer incluir?
                    </>} />
                    <form onSubmit={enviaMeta}>
                        <label htmlFor="meta_cad_nome">Nome da meta</label><br/>
                        <input id="meta_cad_nome" type="text" required
                        value={descricao} onChange={(e) => setDescricao(e.target.value)}/>
                        <br/>
                        <label htmlFor="meta_cad_data">Data que deseja alcançar a meta</label>
                        <input id="meta_cad_data" type="date" required
                        value={data_prev} onChange={(e) => setData_prev(e.target.value)}/>
                        <br/>
                        <label htmlFor="meta_cad_vlr">Valor desejado:</label>
                        <input id="meta_cad_vlr" type="number" step="0.01" required
                        value={vlr} onChange={(e) => setVlr(e.target.value)}/>
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
                                onClick={() => preencherNomeMeta("Carro")}>Carro</button></td>
                            </tr>
                            <tr>
                                <td><button type="button" className="fill-button"
                                onClick={() => preencherNomeMeta("Casa própria")}>Casa própria</button></td>
                            </tr>
                            <tr>
                                <td><button type="button" className="fill-button"
                                onClick={() => preencherNomeMeta("Casa para aluguel")}>Casa para aluguel</button></td>
                            </tr>
                            <tr>
                                <td><button type="button" className="fill-button"
                                onClick={() => preencherNomeMeta("Aposentadoria")}>Aposentadoria</button></td>
                            </tr>
                            <tr>
                                <td><button type="button" className="fill-button"
                                onClick={() => preencherNomeMeta("Faculdade")}>Faculdade</button></td>
                            </tr>
                        </div>
                    </table>
                </aside>
            </div>
        </div>
    );
}
