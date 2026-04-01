import { useState } from "react";
import cadastrate from "../services/cadastrate.js";
import "../styles/cadastrate_receipt.css";
import { BackButtonHeader } from "../components/backButtonHeader.jsx";

export function CadastrateReceipt() {
    const [descricao, setdescricao] = useState("");
    const [vlr_min, setvlr_min] = useState("");
    const [vlr_max, setvlr_max] = useState("");
    const [data, setdata] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function preencherNomeRenda(valor) {
        setdescricao(valor);
    }

    async function enviaRenda(event) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const dados = await cadastrate.createRenda({
                descricao,
                vlr_min,
                vlr_max,
                data,
            });

            alert("Renda cadastrada com sucesso!");

            setdescricao("");
            setvlr_min("");
            setvlr_max("");
            setdata("");
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
                        Qual <span>renda</span> você quer incluir?</>} />

                    <form onSubmit={enviaRenda}>
                        <label htmlFor="renda_cad_nome">Nome da renda</label>
                        <br />
                        <input
                            id="renda_cad_nome"
                            name="renda_cad_nome"
                            type="text"
                            required
                            placeholder="Qualquer tipo de entrada é válida"
                            value={descricao}
                            onChange={(e) => setdescricao(e.target.value)}
                        />
                        <br />

                        <label htmlFor="renda_cad_data">Data do último recebimento:</label>
                        <input
                            id="renda_cad_data"
                            name="renda_cad_data"
                            type="date"
                            required
                            value={data}
                            onChange={(e) => setdata(e.target.value)}
                        />
                        <br />

                        <label htmlFor="renda_cad_vlr">Valor médio:</label>
                        <input
                            id="renda_cad_vlr"
                            name="renda_cad_vlr"
                            type="number"
                            step="0.01"
                            required
                            value={vlr_min}
                            onChange={(e) => {
                                setvlr_min(e.target.value);
                                setvlr_max(e.target.value);
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