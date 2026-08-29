import React, { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, CheckCircle2, RotateCcw, Save } from "lucide-react";
import cadastrate from "../services/cadastrate.js";
import { BackButtonHeader } from "../components/backButtonHeader.jsx";
import { AdBanner } from "../components/adBanner.jsx";
import "../styles/cadastrate_debt.css";

const INITIAL_FORM = {
    id: "",
    name: "",
    value: "",
    receiveDate: "",
    initDate: "",
};

function normalizeDebt(item) {
    return {
        id: item?.id ?? item?.id ?? "",
        name: item?.name ?? item?.description ?? item?.descricao ?? item?.nome ?? "",
        value: item?.value ?? item?.vlr ?? "",
        initDate: item?.initialDate ?? item?.initDate ? String(item.initialDate || item.initDate).split("T")[0] : item?.data_init ? String(item.data_init).split("T")[0] : "",
        receiveDate:
            item?.receiveDate
                ? String(item.receiveDate).split("T")[0]
                : item?.endDate
                ? String(item.endDate).split("T")[0]
                : item?.data_venc
                ? String(item.data_venc).split("T")[0]
                : item?.data_fim
                ? String(item.data_fim).split("T")[0]
                : "",
    };
}

export function UpdateDebt() {
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [dividas, setDividas] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loadingList, setLoadingList] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const hasSelectedItem = useMemo(() => Boolean(selectedId), [selectedId]);

    async function loadDebts() {
        try {
            setLoadingList(true);
            setError("");

            const data = await cadastrate.getDebts();
            const normalized = Array.isArray(data) ? data.map(normalizeDebt) : [];
            setDividas(normalized);
        } catch (err) {
            const mensagem =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Erro ao carregar dívidas.";

            setError(mensagem);
        } finally {
            setLoadingList(false);
        }
    }

    useEffect(() => {
        loadDebts();
    }, []);

    function handleInputChange(event) {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function preencherFormulario(divida) {
        setSelectedId(divida.id);
        setFormData({
            id: divida.id,
            name: divida.name,
            value: divida.value,
            initDate: divida.initDate,
            receiveDate: divida.receiveDate,
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
            setError("Selecione uma dívida para editar.");
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            await cadastrate.updateDebt({
                id: formData.id,
                name: formData.name,
                value: parseFloat(formData.value),
                initialDate: formData.initDate,
                receiveDate: formData.receiveDate,
            });

            setSuccess("Dívida atualizada com sucesso!");
            await loadDebts();
            limparFormulario();
        } catch (err) {
            const mensagem =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Erro ao atualizar dívida.";

            setError(mensagem);
        } finally {
            setSaving(false);
        }
    }

    async function removerDivida(divida) {
        const confirmar = window.confirm(
            `Deseja realmente remover a dívida "${divida.name}"?`
        );
        if (!confirmar) return;

        setDeletingId(divida.id);
        setError("");
        setSuccess("");

        try {
            await cadastrate.inactivateDebt(divida.id);
            setSuccess("Dívida removida com sucesso!");
            if (selectedId === divida.id) {
                limparFormulario();
            }
            await loadDebts();
        } catch (err) {
            const mensagem =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Erro ao remover dívida.";

            setError(mensagem);
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="crud-page">
            <BackButtonHeader
                title={<>Qual <span className="highlight">dívida</span> você quer atualizar?</>}
            />

            <main className="crud-container">
                <div className="crud-split-layout">
                    {/* LISTA DE DÍVIDAS */}
                    <section className="crud-options-card">
                        <div className="options-card-header">
                            <h3 className="options-title">Itens para editar</h3>
                        </div>
                        <p className="options-subtitle">Clique no item para preencher ou no ícone para gerenciar:</p>

                        <div className="manage-items-list">
                            {loadingList ? (
                                <p className="loading-text">Carregando dívidas...</p>
                            ) : dividas.length === 0 ? (
                                <p className="empty-text">Nenhuma dívida cadastrada.</p>
                            ) : (
                                dividas.map((divida) => {
                                    const isSelected = selectedId === divida.id;
                                    return (
                                        <div
                                            key={divida.id}
                                            className={`manage-item-row ${isSelected ? "manage-item-row--active" : ""}`}
                                        >
                                            <div
                                                className="manage-item-main"
                                                onClick={() => preencherFormulario(divida)}
                                                role="button"
                                                tabIndex={0}
                                            >
                                                <strong className="manage-item-name">{divida.name}</strong>
                                                <span className="manage-item-sub">
                                                    {Number(divida.value || 0).toLocaleString("pt-BR", {
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
                                                    onClick={() => preencherFormulario(divida)}
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="action-icon-btn action-icon-btn--delete"
                                                    title="Excluir"
                                                    disabled={deletingId === divida.id}
                                                    onClick={() => removerDivida(divida)}
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
                            {hasSelectedItem ? "Editar Dívida Selecionada" : "Selecione uma dívida"}
                        </h2>
                        <p className="crud-card-subtitle">
                            {hasSelectedItem ? `Atualizando informações de: ${formData.name}` : "Selecione um item da lista ao lado para começar a editar"}
                        </p>

                        <form onSubmit={salvarEdicao} className="crud-form">
                            <div className="crud-input-group">
                                <label htmlFor="divida_edit_nome">Nome da dívida</label>
                                <input
                                    id="divida_edit_nome"
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="Nome da dívida"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    disabled={!hasSelectedItem}
                                />
                            </div>

                            <div className="crud-grid-2col">
                                <div className="crud-input-group">
                                    <label htmlFor="divida_edit_data_init">Data início:</label>
                                    <input
                                        id="divida_edit_data_init"
                                        name="initDate"
                                        type="date"
                                        required
                                        value={formData.initDate}
                                        onChange={handleInputChange}
                                        disabled={!hasSelectedItem}
                                    />
                                </div>

                                <div className="crud-input-group">
                                    <label htmlFor="divida_edit_data_fim">Data fim prevista:</label>
                                    <input
                                        id="divida_edit_data_fim"
                                        name="receiveDate"
                                        type="date"
                                        required
                                        value={formData.receiveDate}
                                        onChange={handleInputChange}
                                        disabled={!hasSelectedItem}
                                    />
                                </div>
                            </div>

                            <div className="crud-input-group">
                                <label htmlFor="divida_edit_vlr">Valor total dívida:</label>
                                <input
                                    id="divida_edit_vlr"
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

                <AdBanner slot="update-debt-slot" format="horizontal" />
            </main>
        </div>
    );
}

export default UpdateDebt;