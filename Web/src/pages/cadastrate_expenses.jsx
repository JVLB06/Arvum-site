import { useState } from "react";
import cadastrate from "../services/cadastrate.js";
import "../styles/cadastrate_expenses.css";
import { BackButtonHeader } from "../components/backButtonHeader.jsx";

export function CadastrateExpenses() {
    const [descricao, setDescricao] = useState("");
    const [vlr_min, setVlr_min] = useState("");
    const [vlr_max, setVlr_max] = useState("");
    const [data_venc, setData_venc] = useState("");
    const [prioridade, setPrioridade] = useState(1);
    const [fixvar, setFixvar] = useState(true);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function preencherNomeGastos(valor) {
        setDescricao(valor);
    }

    async function enviaGastos(event) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const dados = await cadastrate.createExpense({
                descricao,
                vlr_min,
                vlr_max,
                data_venc,
                prioridade,
                fixvar
            });

            alert("Gasto cadastrado com sucesso!");

            setDescricao("");
            setVlr_min("");
            setVlr_max("");
            setData_venc("");
            setPrioridade(1);
            setFixvar(true);
        } catch (err) {
            const mensagem =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Erro ao cadastrar gasto.";

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
                        Qual <span>gasto</span> você quer incluir?
                    </>} />
                    
                    <form onSubmit={enviaGastos}>
                        <label for="gasto_cad_nome">Nome do gasto</label>
                        <input id="gasto_cad_nome" name="gasto_cad_nome" type="text" required 
                        placeholder="Desconsidere parcelamentos e financiamentos"
                        value={descricao} onChange={(e) => setDescricao(e.target.value)}/>
                        <br/>
                        <label for="gasto_cad_data">Data do último pagamento:</label>
                        <input id="gasto_cad_data" name="gasto_cad_data" type="date" required
                        value={data_venc} onChange={(e) => setData_venc(e.target.value)}/>
                        <br/>
                        <label for="gasto_cad_vlr_min">Valor mínimo:</label>
                        <input id="gasto_cad_vlr_min" name="gasto_cad_vlr_min" type="number" step="0.01" required
                        value={vlr_min} onChange={(e) => setVlr_min(e.target.value)}/>
                        <br/>
                        <label for="gasto_cad_vlr_max">Valor máximo:</label>
                        <input id="gasto_cad_vlr_max" name="gasto_cad_vlr_max" type="number" step="0.01" required
                        value={vlr_max} onChange={(e) => setVlr_max(e.target.value)}/>
                        <br/>
                        <div className="radio-group">
                            <label>Nível de prioridade:</label>

                            <div className="radio-option">
                                <input
                                    type="radio"
                                    id="gasto_cad_prioridade_baixa"
                                    name="gasto_cad_prioridade"
                                    value="0"
                                    checked={prioridade === 0}
                                    onChange={(e) => setPrioridade(Number(e.target.value))}
                                />
                                <label htmlFor="gasto_cad_prioridade_baixa">Baixa</label>
                            </div>

                            <div className="radio-option">
                                <input
                                    type="radio"
                                    id="gasto_cad_prioridade_media"
                                    name="gasto_cad_prioridade"
                                    value="1"
                                    checked={prioridade === 1}
                                    onChange={(e) => setPrioridade(Number(e.target.value))}
                                />
                                <label htmlFor="gasto_cad_prioridade_media">Média</label>
                            </div>

                            <div className="radio-option">
                                <input
                                    type="radio"
                                    id="gasto_cad_prioridade_alta"
                                    name="gasto_cad_prioridade"
                                    value="2"
                                    checked={prioridade === 2}
                                    onChange={(e) => setPrioridade(Number(e.target.value))}
                                />
                                <label htmlFor="gasto_cad_prioridade_alta">Alta</label>
                            </div>

                            <div className="radio-option">
                                <input
                                    type="radio"
                                    id="gasto_cad_prioridade_essencial"
                                    name="gasto_cad_prioridade"
                                    value="3"
                                    checked={prioridade === 3}
                                    onChange={(e) => setPrioridade(Number(e.target.value))}
                                />
                                <label htmlFor="gasto_cad_prioridade_essencial">Essencial</label>
                            </div>
                        </div>
                        <br/>
                        <div className="radio-group">
                            <label>Gasto fixo ou variável?</label>

                            <div className="radio-option">
                                <input
                                    type="radio"
                                    id="gasto_fixo"
                                    name="gasto_cad_fixvar"
                                    checked={fixvar === true}
                                    onChange={() => setFixvar(true)}
                                />
                                <label htmlFor="gasto_fixo">Fixo</label>
                            </div>

                            <div className="radio-option">
                                <input
                                    type="radio"
                                    id="gasto_variavel"
                                    name="gasto_cad_fixvar"
                                    checked={fixvar === false}
                                    onChange={() => setFixvar(false)}
                                />
                                <label htmlFor="gasto_variavel">Variável</label>
                            </div>
                        </div>
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
                                onClick={() => preencherNomeGastos("Aluguel")}>Aluguel</button></td>
                            </tr>
                            <tr>
                                <td><button type="button" className="fill-button"
                                onClick={() => preencherNomeGastos("Internet")}>Internet</button></td>
                            </tr>
                            <tr>
                                <td><button type="button" className="fill-button"
                                onClick={() => preencherNomeGastos("Supermercado")}>Supermercado</button></td>
                            </tr>
                            <tr>
                                <td><button type="button" className="fill-button"
                                onClick={() => preencherNomeGastos("Energia")}>Energia</button></td>
                            </tr>
                            <tr>
                                <td><button type="button" className="fill-button"
                                onClick={() => preencherNomeGastos("Gás")}>Gás</button></td>
                            </tr>
                            <tr>
                                <td><button type="button" className="fill-button"
                                onClick={() => preencherNomeGastos("Bar")}>Bar</button></td>
                            </tr>
                            <tr>
                                <td><button type="button" className="fill-button"
                                onClick={() => preencherNomeGastos("Lanches")}>Lanches</button></td>
                            </tr>
                            <tr>
                                <td><button type="button" className="fill-button"
                                onClick={() => preencherNomeGastos("Almoço")}>Almoço</button></td>
                            </tr>
                            <tr>
                                <td><button type="button" className="fill-button"
                                onClick={() => preencherNomeGastos("Gasolina")}>Gasolina</button></td>
                            </tr>
                            <tr>
                                <td><button type="button" className="fill-button"
                                onClick={() => preencherNomeGastos("Viagem")}>Viagem</button></td>
                            </tr>
                            <tr>
                                <td><button type="button" className="fill-button"
                                onClick={() => preencherNomeGastos("Compras")}>Compras</button></td>
                            </tr>
                            <tr>
                                <td><button type="button" className="fill-button"
                                onClick={() => preencherNomeGastos("Roupas")}>Roupas</button></td>
                            </tr>
                        </div>
                    </table>
                </aside>
            </div>
        </div>
    );
}
