import React, { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, CheckCircle2, RotateCcw, Save } from "lucide-react";
import cadastrate from "../services/cadastrate.js";
import { BackButtonHeader } from "../components/backButtonHeader.jsx";
import { AdBanner } from "../components/adBanner.jsx";
import "../styles/cadastrate_goal.css";

const INITIAL_FORM = {
    id: "",
    description: "",
    value: "",
    goalDate: "",
    progress: 0,
};

function normalizeGoal(item) {
    return {
        id: item?.id ?? item?.id ?? "",
        description: item?.description ?? item?.descricao ?? item?.nome ?? "",
        value: item?.value ?? item?.vlr ?? "",
        goalDate:
            item?.goalDate
                ? String(item.goalDate).split("T")[0]
                : item?.data_prev
                ? String(item.data_prev).split("T")[0]
                : item?.data_venc
                ? String(item.data_venc).split("T")[0]
                : item?.data_init
                ? String(item.data_init).split("T")[0]
                : "",
        progress: item?.progress ?? 0,
    };
}

export function UpdateGoal() {
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [metas, setMetas] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loadingList, setLoadingList] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const hasSelectedItem = useMemo(() => Boolean(selectedId), [selectedId]);

    async function loadGoals() {
        try {
            setLoadingList(true);
            setError("");

            const data = await cadastrate.getGoals();
            const normalized = Array.isArray(data) ? data.map(normalizeGoal) : [];
            setMetas(normalized);
        } catch (err) {
            const mensagem =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Erro ao carregar metas.";

            setError(mensagem);
        } finally {
            setLoadingList(false);
        }
    }

    useEffect(() => {
        loadGoals();
    }, []);

    function handleInputChange(event) {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function preencherFormulario(meta) {
        setSelectedId(meta.id);
        setFormData({
            id: meta.id,
            description: meta.description,
            value: meta.value,
            goalDate: meta.goalDate,
            progress: meta.progress,
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
            setError("Selecione uma meta para editar.");
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            await cadastrate.updateGoal({
                id: formData.id,
                description: formData.description,
                value: parseFloat(formData.value),
                goalDate: formData.goalDate,
                progress: formData.progress,
            });

            setSuccess("Meta atualizada com sucesso!");
            await loadGoals();
            limparFormulario();
        } catch (err) {
            const mensagem =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Erro ao atualizar meta.";

            setError(mensagem);
        } finally {
            setSaving(false);
        }
    }

    async function removerMeta(meta) {
        const confirmar = window.confirm(
            `Deseja realmente remover a meta "${meta.description}"?`
        );
        if (!confirmar) return;

        setDeletingId(meta.id);
        setError("");
        setSuccess("");

        try {
            await cadastrate.inactivateGoal(meta.id);
            setSuccess("Meta removida com sucesso!");
            if (selectedId === meta.id) {
                limparFormulario();
            }
            await loadGoals();
        } catch (err) {
            const mensagem =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Erro ao remover meta.";

            setError(mensagem);
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="crud-page">
            <BackButtonHeader
                title={<>Qual <span className="highlight">meta</span> você quer atualizar?</>}
            />

            <main className="crud-container">
                <div className="crud-split-layout">
                    {/* LISTA DE METAS */}
                    <section className="crud-options-card">
                        <div className="options-card-header">
                            <h3 className="options-title">Itens para editar</h3>
                        </div>
                        <p className="options-subtitle">Clique no item para preencher ou no ícone para gerenciar:</p>

                        <div className="manage-items-list">
                            {loadingList ? (
                                <p className="loading-text">Carregando metas...</p>
                            ) : metas.length === 0 ? (
                                <p className="empty-text">Nenhuma meta cadastrada.</p>
                            ) : (
                                metas.map((meta) => {
                                    const isSelected = selectedId === meta.id;
                                    return (
                                        <div
                                            key={meta.id}
                                            className={`manage-item-row ${isSelected ? "manage-item-row--active" : ""}`}
                                        >
                                            <div
                                                className="manage-item-main"
                                                onClick={() => preencherFormulario(meta)}
                                                role="button"
                                                tabIndex={0}
                                            >
                                                <strong className="manage-item-name">{meta.description}</strong>
                                                <span className="manage-item-sub">
                                                    {Number(meta.value || 0).toLocaleString("pt-BR", {
                                                        style: "currency",
                                                        currency: "BRL",
                                                    })}
                                                    {meta.progress ? ` • ${meta.progress}% concluído` : ""}
                                                </span>
                                            </div>

                                            <div className="manage-item-actions">
                                                <button
                                                    type="button"
                                                    className="action-icon-btn action-icon-btn--edit"
                                                    title="Editar"
                                                    onClick={() => preencherFormulario(meta)}
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="action-icon-btn action-icon-btn--delete"
                                                    title="Excluir"
                                                    disabled={deletingId === meta.id}
                                                    onClick={() => removerMeta(meta)}
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
                            {hasSelectedItem ? "Editar Meta Selecionada" : "Selecione uma meta"}
                        </h2>
                        <p className="crud-card-subtitle">
                            {hasSelectedItem ? `Atualizando informações de: ${formData.description}` : "Selecione um item da lista ao lado para começar a editar"}
                        </p>

                        <form onSubmit={salvarEdicao} className="crud-form">
                            <div className="crud-input-group">
                                <label htmlFor="meta_edit_nome">Nome da meta</label>
                                <input
                                    id="meta_edit_nome"
                                    name="description"
                                    type="text"
                                    required
                                    placeholder="Nome da meta"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    disabled={!hasSelectedItem}
                                />
                            </div>

                            <div className="crud-input-group">
                                <label htmlFor="meta_edit_data">Data prevista:</label>
                                <input
                                    id="meta_edit_data"
                                    name="goalDate"
                                    type="date"
                                    required
                                    value={formData.goalDate}
                                    onChange={handleInputChange}
                                    disabled={!hasSelectedItem}
                                />
                            </div>

                            <div className="crud-input-group">
                                <label htmlFor="meta_edit_vlr">Valor desejado:</label>
                                <input
                                    id="meta_edit_vlr"
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

                <AdBanner slot="update-goal-slot" format="horizontal" />
            </main>
        </div>
    );
}

export default UpdateGoal;