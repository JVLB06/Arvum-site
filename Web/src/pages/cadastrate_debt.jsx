import React, { useState } from "react";
import cadastrate from "../services/cadastrate.js";
import { BackButtonHeader } from "../components/backButtonHeader.jsx";
import { AdBanner } from "../components/adBanner.jsx";
import { PlusCircle, Sparkles, CheckCircle2 } from "lucide-react";
import "../styles/cadastrate_debt.css";

export function CadastrateDebt() {
    const [descricao, setDescricao] = useState("");
    const [vlr, setVlr] = useState("");
    const [data_venc, setData_venc] = useState("");
    const [data_init, setData_init] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const opcoesComuns = [
        "Financiamento de Carro",
        "Financiamento Imobiliário",
        "Cartão de Crédito",
        "Empréstimo Pessoal",
        "Faculdade / FIES",
        "Cheque Especial"
    ];

    function preencherNomeDivida(valor) {
        setDescricao(valor);
    }

    async function enviaDivida(event) {
        event.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await cadastrate.createDebt({
                name: descricao,
                value: parseFloat(vlr),
                receiveDate: data_venc,
                initialDate: data_init
            });

            setSuccess("Dívida cadastrada com sucesso!");
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
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="crud-page">
            <BackButtonHeader 
                title={<>Qual <span className="highlight">dívida</span> você quer incluir?</>} 
            />

            <main className="crud-container">
                <div className="crud-split-layout">
                    {/* FORMULÁRIO */}
                    <section className="crud-form-card">
                        <h2 className="crud-card-title">Dados da Dívida</h2>
                        <p className="crud-card-subtitle">Cadastre financiamentos, empréstimos e parcelamentos</p>

                        <form onSubmit={enviaDivida} className="crud-form">
                            <div className="crud-input-group">
                                <label htmlFor="divida_cad_nome">Nome da dívida</label>
                                <input 
                                    id="divida_cad_nome" 
                                    type="text" 
                                    required
                                    placeholder="Ex: Financiamento Carro, Cartão Nubank..."
                                    value={descricao} 
                                    onChange={(e) => setDescricao(e.target.value)}
                                />
                            </div>

                            <div className="crud-grid-2col">
                                <div className="crud-input-group">
                                    <label htmlFor="divida_cad_data_init">Data início:</label>
                                    <input 
                                        id="divida_cad_data_init" 
                                        type="date" 
                                        required
                                        value={data_init} 
                                        onChange={(e) => setData_init(e.target.value)}
                                    />
                                </div>

                                <div className="crud-input-group">
                                    <label htmlFor="divida_cad_data_fim">Data fim prevista:</label>
                                    <input 
                                        id="divida_cad_data_fim" 
                                        type="date" 
                                        required
                                        value={data_venc} 
                                        onChange={(e) => setData_venc(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="crud-input-group">
                                <label htmlFor="divida_cad_vlr">Valor total da dívida:</label>
                                <input 
                                    id="divida_cad_vlr" 
                                    type="number" 
                                    step="0.01" 
                                    required
                                    placeholder="0,00"
                                    value={vlr} 
                                    onChange={(e) => setVlr(e.target.value)}
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
                        <p className="options-subtitle">Clique para selecionar uma opção sugerida:</p>

                        <div className="common-options-grid">
                            {opcoesComuns.map((opcao, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    className={`common-option-pill ${descricao === opcao ? 'active' : ''}`}
                                    onClick={() => preencherNomeDivida(opcao)}
                                >
                                    {opcao}
                                </button>
                            ))}
                        </div>
                    </aside>
                </div>

                <AdBanner slot="cadastrate-debt-slot" format="horizontal" />
            </main>
        </div>
    );
}

export default CadastrateDebt;