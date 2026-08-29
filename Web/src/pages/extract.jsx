import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Ellipsis, Pencil, Trash2, X, Filter, Plus, Calendar, RotateCcw } from "lucide-react";
import expenses from "../services/extract.js";
import { Navbar } from "../components/controlNavBar.jsx";
import { AdBanner } from "../components/adBanner.jsx";
import "../styles/extract.css";

const INITIAL_FILTERS = {
    startDate: "",
    endDate: "",
};

const INITIAL_EDIT_FORM = {
    id: "",
    kind: "",
    extractDate: "",
    value: "",
    name: "",
    balance: 0,
};

function formatCurrency(value) {
    const numberValue = Number(value || 0);
    return numberValue.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function formatDate(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("pt-BR");
}

function normalizeExtractItem(item) {
    return {
        id: item?.id ?? item?.extrato_id ?? "",
        name: item?.name ?? item?.historico ?? "",
        kind: item?.kind ?? item?.tipo ?? "",
        extractDate: item?.extractDate ?? item?.data ?? "",
        value: item?.value ?? item?.valor ?? 0,
        balance: item?.balance ?? item?.saldo ?? 0,
    };
}

export function Extract() {
    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState("");

    const [openMenuId, setOpenMenuId] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState(INITIAL_EDIT_FORM);
    const [savingEdit, setSavingEdit] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const hasActiveFilters = useMemo(() => {
        return Boolean(filters.startDate || filters.endDate);
    }, [filters]);

    async function loadExtract({ startDate = "", endDate = "", reset = true } = {}) {
        try {
            if (reset) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            setError("");
            setOpenMenuId(null);

            const response = await expenses.getExtract(startDate || null, endDate || null);

            const extractItems = Array.isArray(response)
                ? response
                : Array.isArray(response?.extrato)
                ? response.extrato
                : Array.isArray(response?.items)
                ? response.items
                : Array.isArray(response?.lancamentos)
                ? response.lancamentos
                : [];

            setItems(extractItems.map(normalizeExtractItem));
            setHasMore(false);
            setPage(1);
        } catch (err) {
            const mensagem =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Erro ao carregar extrato.";

            setError(mensagem);
            setItems([]);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }

    useEffect(() => {
        loadExtract({
            startDate: filters.startDate,
            endDate: filters.endDate,
            reset: true,
        });
    }, []);

    function handleFilterInputChange(event) {
        const { name, value } = event.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function applyFilters(event) {
        event.preventDefault();
        loadExtract({
            startDate: filters.startDate,
            endDate: filters.endDate,
            reset: true,
        });
    }

    function clearFilters() {
        const clearedFilters = {
            startDate: "",
            endDate: "",
        };
        setFilters(clearedFilters);
        setOpenMenuId(null);
        loadExtract({
            startDate: "",
            endDate: "",
            reset: true,
        });
    }

    function toggleItemMenu(itemId) {
        setOpenMenuId((prev) => (prev === itemId ? null : itemId));
    }

    function openEditModal(item) {
        setEditForm({
            id: item.id,
            kind: item.kind,
            name: item.name,
            extractDate: item.extractDate ? String(item.extractDate).split("T")[0] : "",
            value: item.value ?? "",
        });
        setIsEditModalOpen(true);
        setOpenMenuId(null);
    }

    function closeEditModal() {
        setIsEditModalOpen(false);
        setEditForm(INITIAL_EDIT_FORM);
    }

    function handleEditInputChange(event) {
        const { name, value } = event.target;
        setEditForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function submitEdit(event) {
        event.preventDefault();
        setSavingEdit(true);
        setError("");

        try {
            await expenses.updateExpense({
                id: editForm.id,
                name: editForm.name,
                value: parseFloat(editForm.value),
                kind: editForm.kind,
                extractDate: editForm.extractDate,
                balance: 0,
            });

            setItems((prev) =>
                prev.map((item) =>
                    item.id === editForm.id
                        ? {
                              ...item,
                              extractDate: editForm.extractDate,
                              value: Number(editForm.value),
                              name: editForm.name,
                          }
                        : item
                )
            );

            closeEditModal();
        } catch (err) {
            const mensagem =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Erro ao atualizar lançamento.";

            setError(mensagem);
        } finally {
            setSavingEdit(false);
        }
    }

    async function handleDelete(item) {
        const confirmed = window.confirm(
            `Deseja realmente excluir o lançamento "${item.name}"?`
        );
        if (!confirmed) return;

        setDeletingId(item.id);
        setOpenMenuId(null);
        setError("");

        try {
            await expenses.deleteExpense({
                id: item.id,
                kind: item.kind,
            });

            setItems((prev) => prev.filter((extractItem) => extractItem.id !== item.id));
        } catch (err) {
            const mensagem =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Erro ao excluir lançamento.";

            setError(mensagem);
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="extract-page-container">
            <Navbar>
                <Link to="/novo_lcto" className="head_button head_button--highlight">
                    <Plus size={18} />
                    <span>Novo Lançamento</span>
                </Link>
            </Navbar>

            <main className="extract-main-content">
                {/* BARRA DE FILTROS (VisualIdentity Page 5) */}
                <section className="extract-filters-card">
                    <form onSubmit={applyFilters} className="extract-filter-bar">
                        <div className="filter-badge">
                            <Filter size={16} />
                            <span>Filtros</span>
                        </div>

                        <div className="filter-period-container">
                            <span className="period-label">Período:</span>
                            <div className="period-inputs-row">
                                <input
                                    id="extract_start_date"
                                    name="startDate"
                                    type="date"
                                    value={filters.startDate}
                                    onChange={handleFilterInputChange}
                                />
                                <span className="period-separator">a</span>
                                <input
                                    id="extract_end_date"
                                    name="endDate"
                                    type="date"
                                    value={filters.endDate}
                                    onChange={handleFilterInputChange}
                                />
                            </div>
                        </div>

                        <div className="filter-actions-group">
                            <button type="submit" className="btn-filter-apply">
                                Filtrar
                            </button>
                            {hasActiveFilters && (
                                <button type="button" className="btn-filter-clear" onClick={clearFilters}>
                                    <RotateCcw size={14} />
                                    <span>Limpar</span>
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                {/* LISTAGEM DE LANÇAMENTOS (VisualIdentity Page 5) */}
                <section className="extract-list-card">
                    {error && <div className="extract-alert-box extract-alert--error">{error}</div>}

                    {loading ? (
                        <div className="extract-loading-box">
                            <div className="spinner"></div>
                            <p>Carregando movimentações do extrato...</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="extract-empty-state">
                            <p>Nenhum lançamento encontrado para o período informado.</p>
                            <Link to="/novo_lcto" className="extract-empty-action">
                                + Incluir novo lançamento
                            </Link>
                        </div>
                    ) : (
                        <div className="extract-items-wrapper">
                            {items.map((item) => {
                                const isNegative = Number(item.value) < 0;
                                const isMenuOpen = openMenuId === item.id;
                                const isDeleting = deletingId === item.id;

                                return (
                                    <article key={item.id} className="extract-row-item">
                                        {/* BADGE DE DATA (Verde Escuro) */}
                                        <div className="extract-row-date">
                                            <Calendar size={14} />
                                            <span>{formatDate(item.extractDate)}</span>
                                        </div>

                                        {/* DESCRIÇÃO E TIPO */}
                                        <div className="extract-row-desc">
                                            <strong className="extract-row-title">{item.name}</strong>
                                            {item.kind && (
                                                <span className="extract-row-kind-badge">{item.kind}</span>
                                            )}
                                        </div>

                                        {/* VALORES E SALDO */}
                                        <div className="extract-row-numbers">
                                            <strong className={`extract-row-val ${isNegative ? 'val--negative' : 'val--positive'}`}>
                                                {formatCurrency(item.value)}
                                            </strong>
                                            {item.balance !== undefined && item.balance !== 0 && (
                                                <span className="extract-row-balance">
                                                    Saldo: {formatCurrency(item.balance)}
                                                </span>
                                            )}
                                        </div>

                                        {/* AÇÕES (3 Pontos) */}
                                        <div className="extract-row-menu-anchor">
                                            <button
                                                type="button"
                                                className="extract-menu-btn"
                                                onClick={() => toggleItemMenu(item.id)}
                                                aria-label="Opções"
                                            >
                                                <Ellipsis size={18} />
                                            </button>

                                            {isMenuOpen && (
                                                <div className="extract-dropdown-menu">
                                                    <button
                                                        type="button"
                                                        className="dropdown-item"
                                                        onClick={() => openEditModal(item)}
                                                    >
                                                        <Pencil size={15} />
                                                        <span>Editar</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="dropdown-item dropdown-item--danger"
                                                        disabled={isDeleting}
                                                        onClick={() => handleDelete(item)}
                                                    >
                                                        <Trash2 size={15} />
                                                        <span>{isDeleting ? "Excluindo..." : "Excluir"}</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* MODAL DE EDIÇÃO */}
                {isEditModalOpen && (
                    <div className="extract-modal-backdrop" onClick={closeEditModal}>
                        <div className="extract-modal-panel" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header-bar">
                                <h3 className="modal-title">Editar Lançamento</h3>
                                <button type="button" className="modal-close-btn" onClick={closeEditModal}>
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={submitEdit} className="crud-form modal-form">
                                <div className="crud-input-group">
                                    <label htmlFor="extract_edit_name">Descrição</label>
                                    <input
                                        id="extract_edit_name"
                                        name="name"
                                        type="text"
                                        required
                                        value={editForm.name}
                                        onChange={handleEditInputChange}
                                    />
                                </div>

                                <div className="crud-grid-2col">
                                    <div className="crud-input-group">
                                        <label htmlFor="extract_edit_date">Data</label>
                                        <input
                                            id="extract_edit_date"
                                            name="extractDate"
                                            type="date"
                                            required
                                            value={editForm.extractDate}
                                            onChange={handleEditInputChange}
                                        />
                                    </div>

                                    <div className="crud-input-group">
                                        <label htmlFor="extract_edit_value">Valor</label>
                                        <input
                                            id="extract_edit_value"
                                            name="value"
                                            type="number"
                                            step="0.01"
                                            required
                                            value={editForm.value}
                                            onChange={handleEditInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="modal-actions-row">
                                    <button type="button" className="btn-modal-cancel" onClick={closeEditModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="crud-submit-btn" disabled={savingEdit}>
                                        <span>{savingEdit ? "Salvando..." : "Salvar Alterações"}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <AdBanner slot="extract-footer-slot" format="horizontal" />
            </main>
        </div>
    );
}

export default Extract;