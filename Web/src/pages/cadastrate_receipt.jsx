import React, { useState } from "react";
import cadastrate from "../services/cadastrate.js";
import { BackButtonHeader } from "../components/backButtonHeader.jsx";
import { AdBanner } from "../components/adBanner.jsx";
import { PlusCircle, Sparkles, CheckCircle2 } from "lucide-react";
import "../styles/cadastrate_receipt.css";

export function CadastrateReceipt() {
    const [descricao, setdescricao] = useState("");
    const [vlr_min, setvlr_min] = useState("");
    const [vlr_max, setvlr_max] = useState("");
    const [data, setdata] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const opcoesComuns = ["Salário", "Pro-labore", "Aluguel", "Venda informal", "Freelance", "Investimentos"];

    function preencherNomeRenda(valor) {
        setdescricao(valor);
    }

    async function enviaRenda(event) {
        event.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await cadastrate.createRenda({
                name: descricao,
                minValue: parseFloat(vlr_min),
                maxValue: parseFloat(vlr_max || vlr_min),
                paymentDate: data,
            });

            setSuccess("Renda cadastrada com sucesso!");
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
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="crud-page">
            <BackButtonHeader 
                title={<>Qual <span className="highlight">renda</span> você quer incluir?</>} 
            />

            <main className="crud-container">
                <div className="crud-split-layout">
                    {/* FORMULÁRIO */}
                    <section className="crud-form-card">
                        <h2 className="crud-card-title">Dados da Renda</h2>
                        <p className="crud-card-subtitle">Cadastre fontes de receita fixas ou variáveis</p>

                        <form onSubmit={enviaRenda} className="crud-form">
                            <div className="crud-input-group">
                                <label htmlFor="renda_cad_nome">Nome da renda</label>
                                <input
                                    id="renda_cad_nome"
                                    type="text"
                                    required
                                    placeholder="Ex: Salário, Aluguel, Freelance..."
                                    value={descricao}
                                    onChange={(e) => setdescricao(e.target.value)}
                                />
                            </div>

                            <div className="crud-input-group">
                                <label htmlFor="renda_cad_data">Data estimada de recebimento:</label>
                                <input
                                    id="renda_cad_data"
                                    type="date"
                                    required
                                    value={data}
                                    onChange={(e) => setdata(e.target.value)}
                                />
                            </div>

                            <div className="crud-input-group">
                                <label htmlFor="renda_cad_vlr">Valor médio recebido:</label>
                                <input
                                    id="renda_cad_vlr"
                                    type="number"
                                    step="0.01"
                                    required
                                    placeholder="0,00"
                                    value={vlr_min}
                                    onChange={(e) => {
                                        setvlr_min(e.target.value);
                                        setvlr_max(e.target.value);
                                    }}
                                />
                            </div>

                            {error && <div className="crud-msg-box crud-msg--error">{error}</div>}
                            {success && <div className="crud-msg-box crud-msg--success"><CheckCircle2 size={16} /> {success}</div>}

                            <button type="submit" className="crud-submit-btn" disabled={loading}>
                                <PlusCircle size={18} />
                                <span>{loading ? "Incluindo..." : "Incluir"}</span>
                            </button>
                        </form>
                    </section>

                    {/* OPÇÕES COMUNS */}
                    <aside className="crud-options-card">
                        <div className="options-card-header">
                            <Sparkles size={18} />
                            <h3 className="options-title">Tipos mais comuns</h3>
                        </div>
                        <p className="options-subtitle">Clique para preencher rapidamente o nome da renda:</p>

                        <div className="common-options-grid">
                            {opcoesComuns.map((opcao, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    className={`common-option-pill ${descricao === opcao ? 'active' : ''}`}
                                    onClick={() => preencherNomeRenda(opcao)}
                                >
                                    {opcao}
                                </button>
                            ))}
                        </div>
                    </aside>
                </div>

                <AdBanner slot="cadastrate-receipt-slot" format="horizontal" />
            </main>
        </div>
    );
}

export default CadastrateReceipt;