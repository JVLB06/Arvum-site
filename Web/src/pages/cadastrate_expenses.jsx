import React, { useState } from "react";
import cadastrate from "../services/cadastrate.js";
import { BackButtonHeader } from "../components/backButtonHeader.jsx";
import { AdBanner } from "../components/adBanner.jsx";
import { PlusCircle, Sparkles, CheckCircle2 } from "lucide-react";
import "../styles/cadastrate_expenses.css";

export function CadastrateExpenses() {
    const [descricao, setDescricao] = useState("");
    const [vlr_min, setVlr_min] = useState("");
    const [vlr_max, setVlr_max] = useState("");
    const [data_venc, setData_venc] = useState("");
    const [prioridade, setPrioridade] = useState(1);
    const [fixvar, setFixvar] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const opcoesComuns = [
        "Energia elétrica", 
        "Água", 
        "Internet", 
        "Mercado", 
        "Aluguel", 
        "Faculdade", 
        "Gasolina", 
        "Lanches"
    ];

    function preencherNomeGastos(valor) {
        setDescricao(valor);
    }

    async function enviaGastos(event) {
        event.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await cadastrate.createExpense({
                description: descricao,
                minValue: parseFloat(vlr_min),
                maxValue: parseFloat(vlr_max || vlr_min),
                dueDate: data_venc,
                priority: parseInt(prioridade),
                isFixed: fixvar
            });

            setSuccess("Gasto cadastrado com sucesso!");
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
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="crud-page">
            <BackButtonHeader 
                title={<>Qual <span className="highlight">gasto</span> você quer incluir?</>} 
            />

            <main className="crud-container">
                <div className="crud-split-layout">
                    {/* FORMULÁRIO */}
                    <section className="crud-form-card">
                        <h2 className="crud-card-title">Dados do Gasto</h2>
                        <p className="crud-card-subtitle">Cadastre despesas recorrentes ou variáveis</p>

                        <form onSubmit={enviaGastos} className="crud-form">
                            <div className="crud-input-group">
                                <label htmlFor="gasto_cad_nome">Nome do gasto</label>
                                <input 
                                    id="gasto_cad_nome" 
                                    type="text" 
                                    required 
                                    placeholder="Desconsidere parcelamentos e financiamentos"
                                    value={descricao} 
                                    onChange={(e) => setDescricao(e.target.value)}
                                />
                            </div>

                            <div className="crud-input-group">
                                <label htmlFor="gasto_cad_data">Data de pagamento prevista:</label>
                                <input 
                                    id="gasto_cad_data" 
                                    type="date" 
                                    required
                                    value={data_venc} 
                                    onChange={(e) => setData_venc(e.target.value)}
                                />
                            </div>

                            <div className="crud-grid-2col">
                                <div className="crud-input-group">
                                    <label htmlFor="gasto_cad_vlr_min">Valor mínimo:</label>
                                    <input 
                                        id="gasto_cad_vlr_min" 
                                        type="number" 
                                        step="0.01" 
                                        required
                                        placeholder="0,00"
                                        value={vlr_min} 
                                        onChange={(e) => {
                                            setVlr_min(e.target.value);
                                            if (!vlr_max) setVlr_max(e.target.value);
                                        }}
                                    />
                                </div>

                                <div className="crud-input-group">
                                    <label htmlFor="gasto_cad_vlr_max">Valor máximo:</label>
                                    <input 
                                        id="gasto_cad_vlr_max" 
                                        type="number" 
                                        step="0.01" 
                                        required
                                        placeholder="0,00"
                                        value={vlr_max} 
                                        onChange={(e) => setVlr_max(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="crud-input-group">
                                <label>Nível de prioridade:</label>
                                <div className="priority-radio-grid">
                                    {[
                                        { val: 0, label: "Baixa" },
                                        { val: 1, label: "Média" },
                                        { val: 2, label: "Alta" },
                                        { val: 3, label: "Essencial" }
                                    ].map(p => (
                                        <label 
                                            key={p.val} 
                                            className={`radio-pill ${prioridade === p.val ? 'active' : ''}`}
                                        >
                                            <input
                                                type="radio"
                                                name="prioridade"
                                                value={p.val}
                                                checked={prioridade === p.val}
                                                onChange={() => setPrioridade(p.val)}
                                                className="sr-only"
                                            />
                                            {p.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="crud-input-group">
                                <label>Fixo ou variável?</label>
                                <div className="priority-radio-grid">
                                    <label className={`radio-pill ${fixvar === true ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            name="fixvar"
                                            checked={fixvar === true}
                                            onChange={() => setFixvar(true)}
                                            className="sr-only"
                                        />
                                        Fixo
                                    </label>
                                    <label className={`radio-pill ${fixvar === false ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            name="fixvar"
                                            checked={fixvar === false}
                                            onChange={() => setFixvar(false)}
                                            className="sr-only"
                                        />
                                        Variável
                                    </label>
                                </div>
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
                        <p className="options-subtitle">Clique para preencher o nome do gasto rapidamente:</p>

                        <div className="common-options-grid">
                            {opcoesComuns.map((opcao, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    className={`common-option-pill ${descricao === opcao ? 'active' : ''}`}
                                    onClick={() => preencherNomeGastos(opcao)}
                                >
                                    {opcao}
                                </button>
                            ))}
                        </div>
                    </aside>
                </div>

                <AdBanner slot="cadastrate-expenses-slot" format="horizontal" />
            </main>
        </div>
    );
}

export default CadastrateExpenses;
