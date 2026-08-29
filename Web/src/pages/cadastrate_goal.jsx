import React, { useState } from "react";
import cadastrate from "../services/cadastrate.js";
import { BackButtonHeader } from "../components/backButtonHeader.jsx";
import { AdBanner } from "../components/adBanner.jsx";
import { PlusCircle, Sparkles, CheckCircle2 } from "lucide-react";
import "../styles/cadastrate_goal.css";

export function CadastrateGoal() {
    const [descricao, setDescricao] = useState("");
    const [vlr, setVlr] = useState("");
    const [data_prev, setData_prev] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const opcoesComuns = [
        "Carro",
        "Casa própria",
        "Aposentadoria",
        "Faculdade",
        "Reserva de emergência",
        "Viagem internacional"
    ];

    function preencherNomeMeta(valor) {
        setDescricao(valor);
    }

    async function enviaMeta(event) {
        event.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await cadastrate.createGoal({
                description: descricao,
                value: parseFloat(vlr),
                goalDate: data_prev,
                progress: 0
            });

            setSuccess("Meta cadastrada com sucesso!");
            setDescricao("");
            setVlr("");
            setData_prev("");
        } catch (err) {
            const mensagem =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Erro ao cadastrar meta.";

            setError(mensagem);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="crud-page">
            <BackButtonHeader 
                title={<>Qual <span className="highlight">meta</span> você quer incluir?</>} 
            />

            <main className="crud-container">
                <div className="crud-split-layout">
                    {/* FORMULÁRIO */}
                    <section className="crud-form-card">
                        <h2 className="crud-card-title">Dados da Meta</h2>
                        <p className="crud-card-subtitle">Estabeleça seus sonhos e objetivos financeiros com clareza</p>

                        <form onSubmit={enviaMeta} className="crud-form">
                            <div className="crud-input-group">
                                <label htmlFor="meta_cad_nome">Nome da meta</label>
                                <input 
                                    id="meta_cad_nome" 
                                    type="text" 
                                    required 
                                    placeholder="Ex: Compra do Carro, Entrada da Casa..."
                                    value={descricao} 
                                    onChange={(e) => setDescricao(e.target.value)}
                                />
                            </div>

                            <div className="crud-input-group">
                                <label htmlFor="meta_cad_data">Data que deseja alcançar a meta:</label>
                                <input 
                                    id="meta_cad_data" 
                                    type="date" 
                                    required
                                    value={data_prev} 
                                    onChange={(e) => setData_prev(e.target.value)}
                                />
                            </div>

                            <div className="crud-input-group">
                                <label htmlFor="meta_cad_vlr">Valor total desejado:</label>
                                <input 
                                    id="meta_cad_vlr" 
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
                        <p className="options-subtitle">Clique para selecionar uma meta sugerida:</p>

                        <div className="common-options-grid">
                            {opcoesComuns.map((opcao, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    className={`common-option-pill ${descricao === opcao ? 'active' : ''}`}
                                    onClick={() => preencherNomeMeta(opcao)}
                                >
                                    {opcao}
                                </button>
                            ))}
                        </div>
                    </aside>
                </div>

                <AdBanner slot="cadastrate-goal-slot" format="horizontal" />
            </main>
        </div>
    );
}

export default CadastrateGoal;
