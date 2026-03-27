import { useState } from "react";
import cadastrate from "../services/cadastrate.js";
import "../styles/cadastrate_receipt.css";

export function CadastrateReceipt() {
    const [description, setDescription] = useState("");
    const [minValue, setMinValue] = useState("");
    const [maxValue, setMaxValue] = useState("");
    const [date, setDate] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function preencherNomeRenda(valor) {
        setDescription(valor);
    }

    async function enviaRenda(event) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await cadastrate.createRenda({
                description,
                minValue,
                maxValue,
                date,
            });

            alert("Renda cadastrada com sucesso!");

            setDescription("");
            setMinValue("");
            setMaxValue("");
            setDate("");
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
                    <div className="header">
                        <button
                            className="back-button"
                            onClick={() => window.history.back()}
                            type="button"
                        >
                            &lt;
                        </button>
                        <h1>
                            <strong>
                                Qual <span>renda</span> você quer incluir?
                            </strong>
                        </h1>
                    </div>

                    <form onSubmit={enviaRenda}>
                        <label htmlFor="renda_cad_nome">Nome da renda</label>
                        <br />
                        <input
                            id="renda_cad_nome"
                            name="renda_cad_nome"
                            type="text"
                            required
                            placeholder="Qualquer tipo de entrada é válida"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <br />

                        <label htmlFor="renda_cad_data">Data do último recebimento:</label>
                        <input
                            id="renda_cad_data"
                            name="renda_cad_data"
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                        <br />

                        <label htmlFor="renda_cad_vlr">Valor médio:</label>
                        <input
                            id="renda_cad_vlr"
                            name="renda_cad_vlr"
                            type="number"
                            step="0.01"
                            required
                            value={minValue}
                            onChange={(e) => {
                                setMinValue(e.target.value);
                                setMaxValue(e.target.value);
                            }}
                        />
                        <br />

                        <button type="submit" name="submit" disabled={loading}>
                            {loading ? "Incluindo..." : "Incluir"}
                        </button>
                    </form>
                </section>

                <aside className="sugestoes">
                    <table className="suggestion-table">
                        <thead>
                            <tr>
                                <th>Opções comuns</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="scroll">
                                        <button
                                            type="button"
                                            className="fill-button"
                                            onClick={() => preencherNomeRenda("Salário")}
                                        >
                                            Salário
                                        </button>

                                        <button
                                            type="button"
                                            className="fill-button"
                                            onClick={() => preencherNomeRenda("Pro-labore")}
                                        >
                                            Pro-labore
                                        </button>

                                        <button
                                            type="button"
                                            className="fill-button"
                                            onClick={() => preencherNomeRenda("Aluguel")}
                                        >
                                            Aluguel
                                        </button>

                                        <button
                                            type="button"
                                            className="fill-button"
                                            onClick={() => preencherNomeRenda("Vendas")}
                                        >
                                            Vendas
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </aside>
            </div>
        </div>
    );
}