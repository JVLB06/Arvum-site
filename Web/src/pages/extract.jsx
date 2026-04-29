import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Ellipsis, Pencil, Trash2, X } from "lucide-react";
import expenses from "../services/extract.js";
import { Navbar } from "../components/controlNavBar.jsx";
import "../styles/extract.css";

const PAGE_SIZE = 20;

const INITIAL_FILTERS = {
    startDate: "",
    endDate: "",
};

const INITIAL_EDIT_FORM = {
    id: "",
    tipo: "",
    data: "",
    valor: "",
    historico: "",
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
        id: item?.extrato_id ?? item?.id ?? "",
        historico: item?.historico ?? "",
        tipo: item?.tipo ?? "",
        data: item?.data ?? "",
        valor: item?.valor ?? 0,
        saldo: item?.saldo ?? 0,
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

    const observerRef = useRef(null);

    const hasActiveFilters = useMemo(() => {
        return Boolean(filters.startDate || filters.endDate);
    }, [filters]);

    const fetchExtractPage = useCallback(
        async ({ pageToLoad = 1, reset = false } = {}) => {
            try {
                if (reset) {
                    setLoading(true);
                } else {
                    setLoadingMore(true);
                }

                setError("");

                /**
                 * PLACEHOLDER DE SERVICE
                 * Ajuste esse método no seu extract.js para retornar algo assim:
                 *
                 * {
                 *   items: [...],
                 *   hasMore: true/false
                 * }
                 *
                 * Exemplo esperado por item:
                 * {
                 *   id: 1,
                 *   tipo: "gasto",
                 *   data: "2025-01-01",
                 *   historico: "Comprinha na shopee",
                 *   valor: -50.00,
                 *   saldo: 1250.30
                 * }
                 */
                const response = await expenses.loadExtract({
                    page: pageToLoad,
                    pageSize: PAGE_SIZE,
                    startDate: filters.startDate || null,
                    endDate: filters.endDate || null,
                });

                const newItems = Array.isArray(response?.items) ? response.items : [];
                const nextHasMore = Boolean(response?.hasMore);

                setItems((prev) => (reset ? newItems : [...prev, ...newItems]));
                setHasMore(nextHasMore);
                setPage(pageToLoad);
            } catch (err) {
                const mensagem =
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    err?.message ||
                    "Erro ao carregar extrato.";

                setError(mensagem);
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        [filters.startDate, filters.endDate]
    );

    useEffect(() => {
        loadExtract({
            startDate: filters.startDate,
            endDate: filters.endDate,
            reset: true,
        });
    }, []);

    const lastItemRef = useCallback(
        (node) => {
            if (loadingMore || loading) return;

            if (observerRef.current) {
                observerRef.current.disconnect();
            }

            observerRef.current = new IntersectionObserver((entries) => {
                if (
                    entries[0]?.isIntersecting &&
                    hasMore &&
                    !loadingMore &&
                    !loading
                ) {
                    fetchExtractPage({ pageToLoad: page + 1, reset: false });
                }
            });

            if (node) {
                observerRef.current.observe(node);
            }
        },
        [fetchExtractPage, hasMore, loading, loadingMore, page]
    );

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

            /**
             * Ajuste aqui conforme o retorno real do backend.
             * Exemplos comuns:
             * response.extrato
             * response.items
             * response.lancamentos
             * ou até o próprio response já sendo array
             */
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

            /**
             * Como esse endpoint atual não veio paginado,
             * por enquanto deixamos sem scroll infinito real.
             * A tela continua funcionando normalmente.
             */
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
            tipo: item.tipo,
            historico: item.historico,
            data: item.data ? String(item.data).split("T")[0] : "",
            valor: item.valor ?? "",
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
                tipo: editForm.tipo,
                historico: editForm.historico,
                data: editForm.data,
                valor: editForm.valor,
            });

            setItems((prev) =>
                prev.map((item) =>
                    item.id === editForm.id
                        ? {
                              ...item,
                              data: editForm.data,
                              valor: Number(editForm.valor),
                              historico: editForm.historico,
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
            `Deseja realmente excluir o lançamento "${item.historico}"?`
        );

        if (!confirmed) return;

        setDeletingId(item.id);
        setOpenMenuId(null);
        setError("");

        try {
            await expenses.deleteExpense({
                id: item.id,
                tipo: item.tipo,
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
        <div className="extract-page">
            <Navbar>
                <Link to="/novo_lcto">
                    <button className="extract-nav-button" type="button">
                        Incluir lançamento
                    </button>
                </Link>
            </Navbar>

            <section className="extract-filters-section">
                <form className="extract-filters-form" onSubmit={applyFilters}>
                    <div className="extract-filters-header">
                        <h2 className="extract-filters-title">Filtros</h2>
                    </div>

                    <div className="extract-filters-fields">
                        <div className="extract-filter-period">
                            <label className="extract-filter-label" htmlFor="extract_start_date">
                                Período
                            </label>

                            <div className="extract-filter-period-inputs">
                                <input
                                    id="extract_start_date"
                                    name="startDate"
                                    type="date"
                                    value={filters.startDate}
                                    onChange={handleFilterInputChange}
                                />

                                <span className="extract-filter-separator">a</span>

                                <input
                                    id="extract_end_date"
                                    name="endDate"
                                    type="date"
                                    value={filters.endDate}
                                    onChange={handleFilterInputChange}
                                />
                            </div>
                        </div>

                        <div className="extract-filter-actions">
                            <button type="submit" className="extract-filter-button">
                                Filtrar
                            </button>

                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    className="extract-filter-button extract-filter-button--ghost"
                                    onClick={clearFilters}
                                >
                                    Limpar
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </section>

            <section className="extract-list-section">
                {error && <p className="extract-feedback extract-feedback--error">{error}</p>}

                {loading ? (
                    <div className="extract-feedback">Carregando extrato...</div>
                ) : items.length === 0 ? (
                    <div className="extract-feedback">
                        Nenhum lançamento encontrado para o período informado.
                    </div>
                ) : (
                    <div className="extract-table">
                        {items.map((item, index) => {
                            const isLastItem = index === items.length - 1;
                            const isNegative = Number(item.valor) < 0;
                            const isMenuOpen = openMenuId === item.id;
                            const isDeleting = deletingId === item.id;

                            return (
                                <article
                                    key={item.id}
                                    className="extract-item"
                                    ref={isLastItem ? lastItemRef : null}
                                >
                                    <div className="extract-item-date">
                                        {formatDate(item.data)}
                                    </div>

                                    <div className="extract-item-main">
                                        <div className="extract-item-texts">
                                            <strong className="extract-item-title">
                                                {item.historico}
                                            </strong>

                                            <span className="extract-item-type">
                                                {item.tipo}
                                            </span>
                                        </div>

                                        <div className="extract-item-values">
                                            <strong
                                                className={`extract-item-value ${
                                                    isNegative
                                                        ? "extract-item-value--negative"
                                                        : "extract-item-value--positive"
                                                }`}
                                            >
                                                {formatCurrency(item.valor)}
                                            </strong>

                                            <span className="extract-item-balance">
                                                Saldo: {formatCurrency(item.saldo)}
                                            </span>
                                        </div>

                                        <div className="extract-item-actions">
                                            <button
                                                type="button"
                                                className="extract-menu-trigger"
                                                onClick={() => toggleItemMenu(item.id)}
                                                aria-label="Abrir ações"
                                            >
                                                <Ellipsis size={18} />
                                            </button>

                                            {isMenuOpen && (
                                                <div className="extract-menu">
                                                    <button
                                                        type="button"
                                                        className="extract-menu-option"
                                                        onClick={() => openEditModal(item)}
                                                    >
                                                        <Pencil size={16} />
                                                        Editar
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="extract-menu-option extract-menu-option--danger"
                                                        disabled={isDeleting}
                                                        onClick={() => handleDelete(item)}
                                                    >
                                                        <Trash2 size={16} />
                                                        {isDeleting ? "Excluindo..." : "Excluir"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            );
                        })}

                        {loadingMore && (
                            <div className="extract-feedback">Carregando mais lançamentos...</div>
                        )}

                        {!hasMore && items.length > 0 && (
                            <div className="extract-feedback">
                                Você chegou ao fim do extrato.
                            </div>
                        )}
                    </div>
                )}
            </section>

            {isEditModalOpen && (
                <div className="extract-modal-overlay" onClick={closeEditModal}>
                    <div
                        className="extract-modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="extract-modal-header">
                            <h3 className="extract-modal-title">Editar lançamento</h3>

                            <button
                                type="button"
                                className="extract-modal-close"
                                onClick={closeEditModal}
                                aria-label="Fechar"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form className="extract-modal-form" onSubmit={submitEdit}>
                            <label htmlFor="extract_edit_date">Data</label>
                            <input
                                id="extract_edit_date"
                                name="data"
                                type="date"
                                value={editForm.data}
                                onChange={handleEditInputChange}
                                required
                            />

                            <label htmlFor="extract_edit_value">Valor</label>
                            <input
                                id="extract_edit_value"
                                name="valor"
                                type="number"
                                step="0.01"
                                value={editForm.valor}
                                onChange={handleEditInputChange}
                                required
                            />

                            <div className="extract-modal-actions">
                                <button
                                    type="button"
                                    className="extract-modal-button extract-modal-button--ghost"
                                    onClick={closeEditModal}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="extract-modal-button"
                                    disabled={savingEdit}
                                >
                                    {savingEdit ? "Salvando..." : "Salvar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}