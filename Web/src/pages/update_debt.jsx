import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import cadastrate from "../services/cadastrate.js";
import "../styles/cadastrate_debt.css";
import { BackButtonHeader } from "../components/backButtonHeader.jsx";

const INITIAL_FORM = {
    id: "",
    description: "",
    value: "",
    endDate: "",
    initDate: "",
};

function normalizeDebt(item) {
    return {
        id: item?.id ?? item?.id ?? "",
        description: item?.description ?? item?.descricao ?? item?.nome ?? "",
        value: item?.value ?? item?.vlr ?? "",
        initDate: item?.initDate ? String(item.initDate).split("T")[0] : item?.data_init ? String(item.data_init).split("T")[0] : "",
        endDate:
            item?.endDate
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
            description: divida.description,
            value: divida.value,
            initDate: divida.initDate,
            endDate: divida.endDate,
        });
        setError("");
    }

    function limparFormulario() {
        setSelectedId(null);
        setFormData(INITIAL_FORM);
        setError("");
    }

    async function salvarEdicao(event) {
        event.preventDefault();

        if (!formData.id) {
            setError("Selecione uma dívida para editar.");
            return;
        }

        setSaving(true);
        setError("");

        try {
            await cadastrate.updateDebt({
                id: formData.id,
                description: formData.description,
                value: parseFloat(formData.value),
                initDate: formData.initDate,
                endDate: formData.endDate,
            });

            alert("Dívida atualizada com sucesso!");
            await loadDebts();
            limparFormulario();
        } catch (err) {
            const mensagem =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Erro ao atualizar dívida.";

            setError(mensagem);
            alert(mensagem);
        } finally {
            setSaving(false);
        }
    }

    async function removerDivida(divida) {
        const confirmar = window.confirm(
            `Deseja realmente remover a dívida "${divida.description}"?`
        );

        if (!confirmar) return;

        setDeletingId(divida.id);
        setError("");

        try {
            await cadastrate.inactivateDebt(divida.id);

            alert("Dívida removida com sucesso!");

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
            alert(mensagem);
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="main">
            <div className="grid">
                <section className="form">
                    <BackButtonHeader
                        title={
                            <>
                                Gerenciar <span>divida</span>
                            </>
                        }
                    />

                    <form onSubmit={salvarEdicao}>
                        <label htmlFor="divida_edit_nome">Nome da divida</label>
                        <br />
                        <input
                            id="divida_edit_nome"
                            name="description"
                            type="text"
                            required
                            placeholder="Selecione uma dívida para editar"
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                        <br />

                        <label htmlFor="divida_edit_data_init">Data início:</label>
                        <input
                            id="divida_edit_data_init"
                            name="initDate"
                            type="date"
                            required
                            value={formData.initDate}
                            onChange={handleInputChange}
                        />
                        <br />

                        <label htmlFor="divida_edit_data_fim">Data fim prevista</label>
                        <input
                            id="divida_edit_data_fim"
                            name="endDate"
                            type="date"
                            required
                            value={formData.endDate}
                            onChange={handleInputChange}
                        />
                        <br />

                        <label htmlFor="divida_edit_vlr">Valor total dívida:</label>
                        <input
                            id="divida_edit_vlr"
                            name="value"
                            type="number"
                            step="0.01"
                            required
                            value={formData.value}
                            onChange={handleInputChange}
                        />
                        <br />

                        {error && <p className="error-message">{error}</p>}

                        <div className="button-row">
                            <button
                                type="submit"
                                disabled={!hasSelectedItem || saving}
                            >
                                {saving ? "Salvando..." : "Salvar alteração"}
                            </button>

                            <button
                                type="button"
                                onClick={limparFormulario}
                                disabled={!hasSelectedItem || saving}
                            >
                                Remover auto fill
                            </button>
                        </div>
                    </form>
                </section>

                <aside className="sugestoes">
                    <table className="suggestion-table">
                        <thead>
                            <tr>
                                <th>Dívidas cadastradas</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="scroll">
                                        {loadingList ? (
                                            <p>Carregando dívidas...</p>
                                        ) : dividas.length === 0 ? (
                                            <p>Nenhuma dívida cadastrada.</p>
                                        ) : (
                                            dividas.map((divida) => {
                                                const isSelected =
                                                    selectedId === divida.id;

                                                return (
                                                    <div
                                                        key={divida.id}
                                                        className={`fill-button item-row ${
                                                            isSelected ? "item-row-active" : ""
                                                        }`}
                                                    >
                                                        <div
                                                            className="item-row-content"
                                                            onClick={() => preencherFormulario(divida)}
                                                            role="button"
                                                            tabIndex={0}
                                                            onKeyDown={(e) => {
                                                                if (
                                                                    e.key === "Enter" ||
                                                                    e.key === " "
                                                                ) {
                                                                    preencherFormulario(divida);
                                                                }
                                                            }}
                                                        >
                                                            <span className="item-title">
                                                                {divida.description}
                                                            </span>

                                                            <span className="item-subtitle">
                                                                {Number(divida.value || 0).toLocaleString(
                                                                    "pt-BR",
                                                                    {
                                                                        style: "currency",
                                                                        currency: "BRL",
                                                                    }
                                                                )}
                                                            </span>
                                                        </div>

                                                        <div className="item-actions">
                                                            <button
                                                                type="button"
                                                                className="icon-button"
                                                                title="Editar"
                                                                onClick={() =>
                                                                    preencherFormulario(divida)
                                                                }
                                                            >
                                                                <Pencil size={16} />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="icon-button danger"
                                                                title="Excluir"
                                                                disabled={
                                                                    deletingId === divida.id
                                                                }
                                                                onClick={() =>
                                                                    removerDivida(divida)
                                                                }
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </aside>
            </div>
        </div>
    );
}