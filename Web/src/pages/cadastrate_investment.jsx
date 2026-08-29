import React, { useState } from "react";
import cadastrate from "../services/cadastrate.js";
import { BackButtonHeader } from "../components/backButtonHeader.jsx";
import { AdBanner } from "../components/adBanner.jsx";
import { PlusCircle, Sparkles, CheckCircle2 } from "lucide-react";
import "../styles/cadastrate_investment.css";

export function CadastrateInvestmento() {
    const [descricao, setDescricao] = useState("");
    const [vlr, setVlr] = useState("");
    const [data_init, setData_init] = useState("");
    const [juro, setJuro] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const opcoesComuns = [
        "CDB",
        "LCI / LCA",
        "CRI / CRA",
        "Tesouro Direto",
        "Ações",
        "Fundos Imobiliários (FIIs)",
        "Poupança"
    ];

    function preencherNomeInvestimento(valor) {
        setDescricao(valor);
    }

    async function enviaInvestimento(event) {
        event.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await cadastrate.createInvestment({
                description: descricao,
                value: parseFloat(vlr),
                initialDate: data_init,
                interest: parseFloat(juro || 0)
            });

            setSuccess("Investimento cadastrado com sucesso!");
            setDescricao("");
            setVlr("");
            setData_init("");
            setJuro("");
        } catch (err) {
            const mensagem =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Erro ao cadastrar investimento.";

            setError(mensagem);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="crud-page">
            <BackButtonHeader 
                title={<>Qual <span className="highlight">investimento</span> você quer incluir?</>} 
            />

            <main className="crud-container">
                <div className="crud-split-layout">
                    {/* FORMULÁRIO */}
                    <section className="crud-form-card">
                        <h2 className="crud-card-title">Dados do Investimento</h2>
                        <p className="crud-card-subtitle">Cadastre suas aplicações de renda fixa ou variável</p>

                        <form onSubmit={enviaInvestimento} className="crud-form">
                            <div className="crud-input-group">
                                <label htmlFor="investimento_cad_nome">Nome da aplicação</label>
                                <input 
                                    id="investimento_cad_nome" 
                                    type="text" 
                                    required 
                                    placeholder="Ex: CDB Banco Inter, Tesouro Selic..."
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)} 
                                />
                            </div>

                            <div className="crud-grid-2col">
                                <div className="crud-input-group">
                                    <label htmlFor="investimento_cad_data_init">Data início:</label>
                                    <input 
                                        id="investimento_cad_data_init" 
                                        type="date" 
                                        required
                                        value={data_init}
                                        onChange={(e) => setData_init(e.target.value)}
                                    />
                                </div>

                                <div className="crud-input-group">
                                    <label htmlFor="investimento_cad_vlr">Valor aplicado:</label>
                                    <input 
                                        id="investimento_cad_vlr" 
                                        type="number" 
                                        step="0.01" 
                                        required
                                        placeholder="0,00"
                                        value={vlr}
                                        onChange={(e) => setVlr(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="crud-input-group">
                                <label htmlFor="investimento_cad_juros">Taxa de Juros anual (% estimada):</label>
                                <input 
                                    id="investimento_cad_juros" 
                                    type="number" 
                                    step="0.01"
                                    placeholder="Ex: 12.5"
                                    value={juro}
                                    onChange={(e) => setJuro(e.target.value)}
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
                        <p className="options-subtitle">Clique para selecionar a modalidade de investimento:</p>

                        <div className="common-options-grid">
                            {opcoesComuns.map((opcao, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    className={`common-option-pill ${descricao === opcao ? 'active' : ''}`}
                                    onClick={() => preencherNomeInvestimento(opcao)}
                                >
                                    {opcao}
                                </button>
                            ))}
                        </div>
                    </aside>
                </div>

                <AdBanner slot="cadastrate-investment-slot" format="horizontal" />
            </main>
        </div>
    );
}

export default CadastrateInvestmento;