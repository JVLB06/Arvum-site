import React, { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, CheckCircle2, RotateCcw, Save } from "lucide-react";
import cadastrate from "../services/cadastrate.js";
import { BackButtonHeader } from "../components/backButtonHeader.jsx";
import { AdBanner } from "../components/adBanner.jsx";
import "../styles/cadastrate_receipt.css";

const INITIAL_FORM = {
    receiptId: "",
    name: "",
    minValue: "",
    maxValue: "",
    paymentDate: "",
};

function normalizeRenda(item) {
    return {
        receiptId: item?.receiptId ?? item?.id ?? "",
        name: item?.name ?? item?.descricao ?? item?.nome ?? "",
        minValue: item?.minValue ?? item?.vlr_min ?? "",
        maxValue: item?.maxValue ?? item?.vlr_max ?? item?.vlr_min ?? "",
        paymentDate: item?.paymentDate ? String(item.paymentDate).split("T")[0] : item?.data ? String(item.data).split("T")[0] : "",
    };
}

export function UpdateReceipt() {
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [rendas, setRendas] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loadingList, setLoadingList] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const hasSelectedItem = useMemo(() => Boolean(selectedId), [selectedId]);

    async function loadRendas() {
        try {
            setLoadingList(true);
            setError("");

            const data = await cadastrate.getRenda();
            const normalized = Array.isArray(data) ? data.map(normalizeRenda) : [];
            setRendas(normalized);
        } catch (err) {
            const mensagem =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Erro ao carregar rendas.";

            setError(mensagem);
        } finally {
            setLoadingList(false);
        }
    }

    useEffect(() => {
        loadRendas();
    }, []);

    function handleInputChange(event) {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function preencherFormulario(renda) {
        setSelectedId(renda.receiptId);
        setFormData({
            receiptId: renda.receiptId,
            name: renda.name,
            minValue: renda.minValue,
            maxValue: renda.maxValue,
            paymentDate: renda.paymentDate,
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

        if (!formData.receiptId) {
            setError("Selecione uma renda na lista para editar.");
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            await cadastrate.updateRenda({
                receiptId: formData.receiptId,
                name: formData.name,
                minValue: parseFloat(formData.minValue),
                maxValue: parseFloat(formData.maxValue || formData.minValue),
                paymentDate: formData.paymentDate,
            });

            setSuccess("Renda atualizada com sucesso!");
            await loadRendas();
            limparFormulario();
        } catch (err) {
            const mensagem =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Erro ao atualizar renda.";

            setError(mensagem);
        } finally {
            setSaving(false);
        }
    }

    async function removerRenda(renda) {
        const confirmar = window.confirm(`Deseja realmente remover a renda "${renda.name}"?`);
        if (!confirmar) return;

        setDeletingId(renda.receiptId);
        setError("");
        setSuccess("");

        try {
            await cadastrate.deleteRenda(renda.receiptId);
            setSuccess("Renda removida com sucesso!");
            if (selectedId === renda.receiptId) {
                limparFormulario();
            }
            await loadRendas();
        } catch (err) {
            const mensagem =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Erro ao remover renda.";

            setError(mensagem);
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="crud-page">
            <BackButtonHeader
                title={<>Qual <span className="highlight">renda</span> você quer atualizar?</>}
            />

            <main className="crud-container">
                <div className="crud-split-layout">
                    {/* ITENS PARA EDITAR (LADO ESQUERDO) */}
                    <section className="crud-options-card">
                        <div className="options-card-header">
                            <h3 className="options-title">Itens para editar</h3>
                        </div>
                        <p className="options-subtitle">Clique no item para preencher ou no ícone para gerenciar:</p>

                        <div className="manage-items-list">
                            {loadingList ? (
                                <p className="loading-text">Carregando rendas...</p>
                            ) : rendas.length === 0 ? (
                                <p className="empty-text">Nenhuma renda cadastrada.</p>
                            ) : (
                                rendas.map((renda) => {
                                    const isSelected = selectedId === renda.receiptId;
                                    return (
                                        <div
                                            key={renda.receiptId}
                                            className={`manage-item-row ${isSelected ? "manage-item-row--active" : ""}`}
                                        >
                                            <div
                                                className="manage-item-main"
                                                onClick={() => preencherFormulario(renda)}
                                                role="button"
                                                tabIndex={0}
                                            >
                                                <strong className="manage-item-name">{renda.name}</strong>
                                                <span className="manage-item-sub">
                                                    {Number(renda.minValue || 0).toLocaleString("pt-BR", {
                                                        style: "currency",
                                                        currency: "BRL",
                                                    })}
                                                </span>
                                            </div>

                                            <div className="manage-item-actions">
                                                <button
                                                    type="button"
                                                    className="action-icon-btn action-icon-btn--edit"
                                                    title="Editar"
                                                    onClick={() => preencherFormulario(renda)}
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="action-icon-btn action-icon-btn--delete"
                                                    title="Excluir"
                                                    disabled={deletingId === renda.receiptId}
                                                    onClick={() => removerRenda(renda)}
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

                    {/* FORMULÁRIO DE EDIÇÃO (LADO DIREITO) */}
                    <section className="crud-form-card">
                        <h2 className="crud-card-title">
                            {hasSelectedItem ? "Editar Renda Selecionada" : "Selecione uma renda"}
                        </h2>
                        <p className="crud-card-subtitle">
                            {hasSelectedItem ? `Atualizando informações de: ${formData.name}` : "Selecione um item da lista ao lado para começar a editar"}
                        </p>

                        <form onSubmit={salvarEdicao} className="crud-form">
                            <div className="crud-input-group">
                                <label htmlFor="renda_edit_nome">Nome da renda</label>
                                <input
                                    id="renda_edit_nome"
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="Nome da renda"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    disabled={!hasSelectedItem}
                                />
                            </div>

                            <div className="crud-input-group">
                                <label htmlFor="renda_edit_data">Data estimada de recebimento:</label>
                                <input
                                    id="renda_edit_data"
                                    name="paymentDate"
                                    type="date"
                                    required
                                    value={formData.paymentDate}
                                    onChange={handleInputChange}
                                    disabled={!hasSelectedItem}
                                />
                            </div>

                            <div className="crud-input-group">
                                <label htmlFor="renda_edit_vlr_min">Valor médio recebido:</label>
                                <input
                                    id="renda_edit_vlr_min"
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

                <AdBanner slot="update-receipt-slot" format="horizontal" />
            </main>
        </div>
    );
}

export default UpdateReceipt;