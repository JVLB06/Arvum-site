import React, { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, CheckCircle2, RotateCcw, Save } from "lucide-react";
import cadastrate from "../services/cadastrate.js";
import { BackButtonHeader } from "../components/backButtonHeader.jsx";
import { AdBanner } from "../components/adBanner.jsx";
import "../styles/cadastrate_expenses.css";

const INITIAL_FORM = {
    id: "",
    description: "",
    minValue: "",
    maxValue: "",
    dueDate: "",
    priority: 1,
    isFixed: true,
};

function normalizeExpense(item) {
    return {
        id: item?.id ?? item?.id ?? "",
        description: item?.description ?? item?.descricao ?? item?.nome ?? "",
        minValue: item?.minValue ?? item?.vlr_min ?? "",
        maxValue: item?.maxValue ?? item?.vlr_max ?? item?.minValue ?? "",
        dueDate:
            item?.dueDate
                ? String(item.dueDate).split("T")[0]
                : item?.data_venc
                ? String(item.data_venc).split("T")[0]
                : item?.data_init
                ? String(item.data_init).split("T")[0]
                : "",
        priority:
            typeof item?.priority === "number"
                ? item.priority
                : Number(item?.priority ?? 1),
        isFixed:
            typeof item?.isFixed === "boolean"
                ? item.isFixed
                : item?.fix_var ?? true,
    };
}

export function UpdateExpenses() {
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [gastos, setGastos] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loadingList, setLoadingList] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const hasSelectedItem = useMemo(() => Boolean(selectedId), [selectedId]);

    async function loadExpenses() {
        try {
            setLoadingList(true);
            setError("");

            const data = await cadastrate.getExpenses();
            const normalized = Array.isArray(data) ? data.map(normalizeExpense) : [];
            setGastos(normalized);
        } catch (err) {
            const mensagem =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Erro ao carregar gastos.";

            setError(mensagem);
        } finally {
            setLoadingList(false);
        }
    }

    useEffect(() => {
        loadExpenses();
    }, []);

    function handleInputChange(event) {
        const { name, value, type, checked } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    function preencherFormulario(gasto) {
        setSelectedId(gasto.id);
        setFormData({
            id: gasto.id,
            description: gasto.description,
            minValue: gasto.minValue,
            maxValue: gasto.maxValue,
            dueDate: gasto.dueDate,
            priority: gasto.priority,
            isFixed: gasto.isFixed,
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
            setError("Selecione um gasto para editar.");
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            await cadastrate.updateExpense({
                id: formData.id,
                description: formData.description,
                minValue: parseFloat(formData.minValue),
                maxValue: parseFloat(formData.maxValue || formData.minValue),
                dueDate: formData.dueDate,
                priority: parseInt(formData.priority),
                isFixed: formData.isFixed,
            });

            setSuccess("Gasto atualizado com sucesso!");
            await loadExpenses();
            limparFormulario();
        } catch (err) {
            const mensagem =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Erro ao atualizar gasto.";

            setError(mensagem);
        } finally {
            setSaving(false);
        }
    }

    async function removerGasto(gasto) {
        const confirmar = window.confirm(
            `Deseja realmente remover o gasto "${gasto.description}"?`
        );
        if (!confirmar) return;

        setDeletingId(gasto.id);
        setError("");
        setSuccess("");

        try {
            await cadastrate.inactivateExpense(gasto.id);
            setSuccess("Gasto removido com sucesso!");
            if (selectedId === gasto.id) {
                limparFormulario();
            }
            await loadExpenses();
        } catch (err) {
            const mensagem =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Erro ao remover gasto.";

            setError(mensagem);
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="crud-page">
            <BackButtonHeader
                title={<>Qual <span className="highlight">gasto</span> você quer atualizar?</>}
            />

            <main className="crud-container">
                <div className="crud-split-layout">
                    {/* LISTA DE GASTOS */}
                    <section className="crud-options-card">
                        <div className="options-card-header">
                            <h3 className="options-title">Itens para editar</h3>
                        </div>
                        <p className="options-subtitle">Clique no item para preencher ou no ícone para gerenciar:</p>

                        <div className="manage-items-list">
                            {loadingList ? (
                                <p className="loading-text">Carregando gastos...</p>
                            ) : gastos.length === 0 ? (
                                <p className="empty-text">Nenhum gasto cadastrado.</p>
                            ) : (
                                gastos.map((gasto) => {
                                    const isSelected = selectedId === gasto.id;
                                    return (
                                        <div
                                            key={gasto.id}
                                            className={`manage-item-row ${isSelected ? "manage-item-row--active" : ""}`}
                                        >
                                            <div
                                                className="manage-item-main"
                                                onClick={() => preencherFormulario(gasto)}
                                                role="button"
                                                tabIndex={0}
                                            >
                                                <strong className="manage-item-name">{gasto.description}</strong>
                                                <span className="manage-item-sub">
                                                    {Number(gasto.minValue || 0).toLocaleString("pt-BR", {
                                                        style: "currency",
                                                        currency: "BRL",
                                                    })}
                                                    {" • "}
                                                    {gasto.isFixed ? "Fixo" : "Variável"}
                                                </span>
                                            </div>

                                            <div className="manage-item-actions">
                                                <button
                                                    type="button"
                                                    className="action-icon-btn action-icon-btn--edit"
                                                    title="Editar"
                                                    onClick={() => preencherFormulario(gasto)}
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="action-icon-btn action-icon-btn--delete"
                                                    title="Excluir"
                                                    disabled={deletingId === gasto.id}
                                                    onClick={() => removerGasto(gasto)}
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
                            {hasSelectedItem ? "Editar Gasto Selecionado" : "Selecione um gasto"}
                        </h2>
                        <p className="crud-card-subtitle">
                            {hasSelectedItem ? `Atualizando informações de: ${formData.description}` : "Selecione um item da lista ao lado para começar a editar"}
                        </p>

                        <form onSubmit={salvarEdicao} className="crud-form">
                            <div className="crud-input-group">
                                <label htmlFor="gasto_edit_nome">Nome do gasto</label>
                                <input
                                    id="gasto_edit_nome"
                                    name="description"
                                    type="text"
                                    required
                                    placeholder="Nome do gasto"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    disabled={!hasSelectedItem}
                                />
                            </div>

                            <div className="crud-input-group">
                                <label htmlFor="gasto_edit_data">Data de pagamento prevista:</label>
                                <input
                                    id="gasto_edit_data"
                                    name="dueDate"
                                    type="date"
                                    required
                                    value={formData.dueDate}
                                    onChange={handleInputChange}
                                    disabled={!hasSelectedItem}
                                />
                            </div>

                            <div className="crud-grid-2col">
                                <div className="crud-input-group">
                                    <label htmlFor="gasto_edit_vlr_min">Valor mínimo:</label>
                                    <input
                                        id="gasto_edit_vlr_min"
                                        name="minValue"
                                        type="number"
                                        step="0.01"
                                        required
                                        placeholder="0,00"
                                        value={formData.minValue}
                                        onChange={handleInputChange}
                                        disabled={!hasSelectedItem}
                                    />
                                </div>

                                <div className="crud-input-group">
                                    <label htmlFor="gasto_edit_vlr_max">Valor máximo:</label>
                                    <input
                                        id="gasto_edit_vlr_max"
                                        name="maxValue"
                                        type="number"
                                        step="0.01"
                                        required
                                        placeholder="0,00"
                                        value={formData.maxValue}
                                        onChange={handleInputChange}
                                        disabled={!hasSelectedItem}
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
                                            className={`radio-pill ${Number(formData.priority) === p.val ? 'active' : ''} ${!hasSelectedItem ? 'disabled' : ''}`}
                                        >
                                            <input
                                                type="radio"
                                                name="priority"
                                                value={p.val}
                                                checked={Number(formData.priority) === p.val}
                                                onChange={() => setFormData(prev => ({ ...prev, priority: p.val }))}
                                                disabled={!hasSelectedItem}
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
                                    <label className={`radio-pill ${formData.isFixed === true ? 'active' : ''} ${!hasSelectedItem ? 'disabled' : ''}`}>
                                        <input
                                            type="radio"
                                            name="isFixed"
                                            checked={formData.isFixed === true}
                                            onChange={() => setFormData(prev => ({ ...prev, isFixed: true }))}
                                            disabled={!hasSelectedItem}
                                            className="sr-only"
                                        />
                                        Fixo
                                    </label>
                                    <label className={`radio-pill ${formData.isFixed === false ? 'active' : ''} ${!hasSelectedItem ? 'disabled' : ''}`}>
                                        <input
                                            type="radio"
                                            name="isFixed"
                                            checked={formData.isFixed === false}
                                            onChange={() => setFormData(prev => ({ ...prev, isFixed: false }))}
                                            disabled={!hasSelectedItem}
                                            className="sr-only"
                                        />
                                        Variável
                                    </label>
                                </div>
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

                <AdBanner slot="update-expenses-slot" format="horizontal" />
            </main>
        </div>
    );
}

export default UpdateExpenses;