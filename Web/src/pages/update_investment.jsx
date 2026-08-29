import React, { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, CheckCircle2, RotateCcw, Save } from "lucide-react";
import cadastrate from "../services/cadastrate.js";
import { BackButtonHeader } from "../components/backButtonHeader.jsx";
import { AdBanner } from "../components/adBanner.jsx";
import "../styles/cadastrate_investment.css";

const INITIAL_FORM = {
    id: "",
    description: "",
    value: "",
    initialDate: "",
    interest: "",
};

function normalizeInvestment(item) {
    return {
        id: item?.id ?? item?.id ?? "",
        description: item?.description ?? item?.descricao ?? item?.nome ?? "",
        value: item?.value ?? item?.vlr ?? "",
        initialDate: item?.initialDate ? String(item.initialDate).split("T")[0] : item?.data_init ? String(item.data_init).split("T")[0] : "",
        interest: item?.interest ?? item?.juro ?? "",
    };
}

export function UpdateInvestment() {
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [investimentos, setInvestimentos] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loadingList, setLoadingList] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const hasSelectedItem = useMemo(() => Boolean(selectedId), [selectedId]);

    async function loadInvestments() {
        try {
            setLoadingList(true);
            setError("");

            const data = await cadastrate.getActiveInvestments();
            const normalized = Array.isArray(data) ? data.map(normalizeInvestment) : [];
            setInvestimentos(normalized);
        } catch (err) {
            const mensagem =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Erro ao carregar investimentos.";

            setError(mensagem);
        } finally {
            setLoadingList(false);
        }
    }

    useEffect(() => {
        loadInvestments();
    }, []);

    function handleInputChange(event) {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function preencherFormulario(investimento) {
        setSelectedId(investimento.id);
        setFormData({
            id: investimento.id,
            description: investimento.description,
            value: investimento.value,
            initialDate: investimento.initialDate,
            interest: investimento.interest,
        });
        setError("");
        setSuccess("");
    }

    function limparFormulario() {
        setSelectedId(null);
        setFormData(INITIAL_FORM);
        setError("");
        setSuccess("");
    }

    async function salvarEdicao(event) {
        event.preventDefault();

        if (!formData.id) {
            setError("Selecione um investimento para editar.");
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            await cadastrate.updateInvestment({
                id: formData.id,
                description: formData.description,
                value: parseFloat(formData.value),
                initialDate: formData.initialDate,
                interest: parseFloat(formData.interest || 0),
            });

            setSuccess("Investimento atualizado com sucesso!");
            await loadInvestments();
            limparFormulario();
        } catch (err) {
            const mensagem =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Erro ao atualizar investimento.";

            setError(mensagem);
        } finally {
            setSaving(false);
        }
    }

    async function removerInvestimento(investimento) {
        const confirmar = window.confirm(
            `Deseja realmente remover o investimento "${investimento.description}"?`
        );
        if (!confirmar) return;

        setDeletingId(investimento.id);
        setError("");
        setSuccess("");

        try {
            await cadastrate.inactivateInvestment(investimento.id);
            setSuccess("Investimento removido com sucesso!");
            if (selectedId === investimento.id) {
                limparFormulario();
            }
            await loadInvestments();
        } catch (err) {
            const mensagem =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Erro ao remover investimento.";

            setError(mensagem);
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="crud-page">
            <BackButtonHeader
                title={<>Qual <span className="highlight">investimento</span> você quer atualizar?</>}
            />

            <main className="crud-container">
                <div className="crud-split-layout">
                    {/* LISTA DE INVESTIMENTOS */}
                    <section className="crud-options-card">
                        <div className="options-card-header">
                            <h3 className="options-title">Itens para editar</h3>
                        </div>
                        <p className="options-subtitle">Clique no item para preencher ou no ícone para gerenciar:</p>

                        <div className="manage-items-list">
                            {loadingList ? (
                                <p className="loading-text">Carregando investimentos...</p>
                            ) : investimentos.length === 0 ? (
                                <p className="empty-text">Nenhum investimento cadastrado.</p>
                            ) : (
                                investimentos.map((investimento) => {
                                    const isSelected = selectedId === investimento.id;
                                    return (
                                        <div
                                            key={investimento.id}
                                            className={`manage-item-row ${isSelected ? "manage-item-row--active" : ""}`}
                                        >
                                            <div
                                                className="manage-item-main"
                                                onClick={() => preencherFormulario(investimento)}
                                                role="button"
                                                tabIndex={0}
                                            >
                                                <strong className="manage-item-name">{investimento.description}</strong>
                                                <span className="manage-item-sub">
                                                    {Number(investimento.value || 0).toLocaleString("pt-BR", {
                                                        style: "currency",
                                                        currency: "BRL",
                                                    })}
                                                    {investimento.interest ? ` • Juros: ${investimento.interest}%` : ""}
                                                </span>
                                            </div>

                                            <div className="manage-item-actions">
                                                <button
                                                    type="button"
                                                    className="action-icon-btn action-icon-btn--edit"
                                                    title="Editar"
                                                    onClick={() => preencherFormulario(investimento)}
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="action-icon-btn action-icon-btn--delete"
                                                    title="Excluir"
                                                    disabled={deletingId === investimento.id}
                                                    onClick={() => removerInvestimento(investimento)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </section>

                    {/* FORMULÁRIO DE EDIÇÃO */}
                    <section className="crud-form-card">
                        <h2 className="crud-card-title">
                            {hasSelectedItem ? "Editar Investimento Selecionado" : "Selecione uma aplicação"}
                        </h2>
                        <p className="crud-card-subtitle">
                            {hasSelectedItem ? `Atualizando informações de: ${formData.description}` : "Selecione um item da lista ao lado para começar a editar"}
                        </p>

                        <form onSubmit={salvarEdicao} className="crud-form">
                            <div className="crud-input-group">
                                <label htmlFor="investimento_edit_nome">Nome da aplicação</label>
                                <input
                                    id="investimento_edit_nome"
                                    name="description"
                                    type="text"
                                    required
                                    placeholder="Nome da aplicação"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    disabled={!hasSelectedItem}
                                />
                            </div>

                            <div className="crud-grid-2col">
                                <div className="crud-input-group">
                                    <label htmlFor="investimento_edit_data_init">Data início:</label>
                                    <input
                                        id="investimento_edit_data_init"
                                        name="initialDate"
                                        type="date"
                                        required
                                        value={formData.initialDate}
                                        onChange={handleInputChange}
                                        disabled={!hasSelectedItem}
                                    />
                                </div>

                                <div className="crud-input-group">
                                    <label htmlFor="investimento_edit_vlr">Valor aplicado:</label>
                                    <input
                                        id="investimento_edit_vlr"
                                        name="value"
                                        type="number"
                                        step="0.01"
                                        required
                                        placeholder="0,00"
                                        value={formData.value}
                                        onChange={handleInputChange}
                                        disabled={!hasSelectedItem}
                                    />
                                </div>
                            </div>

                            <div className="crud-input-group">
                                <label htmlFor="investimento_edit_juros">Taxa de Juros anual (% estimada):</label>
                                <input
                                    id="investimento_edit_juros"
                                    name="interest"
                                    type="number"
                                    step="0.01"
                                    placeholder="0,00"
                                    value={formData.interest}
                                    onChange={handleInputChange}
                                    disabled={!hasSelectedItem}
                                />
                            </div>

                            {error && <div className="crud-msg-box crud-msg--error">{error}</div>}
                            {success && <div className="crud-msg-box crud-msg--success"><CheckCircle2 size={16} /> {success}</div>}

                            <div className="crud-actions-row">
                                <button
                                    type="submit"
                                    className="crud-submit-btn"
                                    disabled={!hasSelectedItem || saving}
                                >
                                    <Save size={18} />
                                    <span>{saving ? "Salvando..." : "Atualizar"}</span>
                                </button>

                                {hasSelectedItem && (
                                    <button
                                        type="button"
                                        className="crud-reset-btn"
                                        onClick={limparFormulario}
                                        disabled={saving}
                                    >
                                        <RotateCcw size={16} />
                                        <span>Limpar seleção</span>
                                    </button>
                                )}
                            </div>
                        </form>
                    </section>
                </div>

                <AdBanner slot="update-investment-slot" format="horizontal" />
            </main>
        </div>
    );
}

export default UpdateInvestment;