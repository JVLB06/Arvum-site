import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import cadastrate from "../services/cadastrate.js";
import "../styles/cadastrate_goal.css";
import { BackButtonHeader } from "../components/backButtonHeader.jsx";

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
    }

    function limparFormulario() {
        setSelectedId(null);
        setFormData(INITIAL_FORM);
        setError("");
    }

    async function salvarEdicao(event) {
        event.preventDefault();

        if (!formData.id) {
            setError("Selecione uma meta para editar.");
            return;
        }

        setSaving(true);
        setError("");

        try {
            await cadastrate.updateGoal({
                id: formData.id,
                description: formData.description,
                value: parseFloat(formData.value),
                goalDate: formData.goalDate,
                progress: formData.progress,
            });

            alert("Meta atualizada com sucesso!");
            await loadGoals();
            limparFormulario();
        } catch (err) {
            const mensagem =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Erro ao atualizar meta.";

            setError(mensagem);
            alert(mensagem);
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

        try {
            await cadastrate.inactivateGoal(meta.id);

            alert("Meta removida com sucesso!");

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
                                Gerenciar <span>meta</span>
                            </>
                        }
                    />

                    <form onSubmit={salvarEdicao}>
                        <label htmlFor="meta_edit_nome">Nome da meta</label>
                        <br />
                        <input
                            id="meta_edit_nome"
                            name="description"
                            type="text"
                            required
                            placeholder="Selecione uma meta para editar"
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                        <br />

                        <label htmlFor="meta_edit_data">
                            Data que deseja alcançar a meta
                        </label>
                        <input
                            id="meta_edit_data"
                            name="goalDate"
                            type="date"
                            required
                            value={formData.goalDate}
                            onChange={handleInputChange}
                        />
                        <br />

                        <label htmlFor="meta_edit_vlr">Valor desejado:</label>
                        <input
                            id="meta_edit_vlr"
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
                                <th>Metas cadastradas</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="scroll">
                                        {loadingList ? (
                                            <p>Carregando metas...</p>
                                        ) : metas.length === 0 ? (
                                            <p>Nenhuma meta cadastrada.</p>
                                        ) : (
                                            metas.map((meta) => {
                                                const isSelected =
                                                    selectedId === meta.id;

                                                return (
                                                    <div
                                                        key={meta.id}
                                                        className={`fill-button item-row ${
                                                            isSelected ? "item-row-active" : ""
                                                        }`}
                                                    >
                                                        <div
                                                            className="item-row-content"
                                                            onClick={() => preencherFormulario(meta)}
                                                            role="button"
                                                            tabIndex={0}
                                                            onKeyDown={(e) => {
                                                                if (
                                                                    e.key === "Enter" ||
                                                                    e.key === " "
                                                                ) {
                                                                    preencherFormulario(meta);
                                                                }
                                                            }}
                                                        >
                                                            <span className="item-title">
                                                                {meta.description}
                                                            </span>

                                                            <span className="item-subtitle">
                                                                {Number(meta.value || 0).toLocaleString(
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
                                                                    preencherFormulario(meta)
                                                                }
                                                            >
                                                                <Pencil size={16} />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="icon-button danger"
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
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </aside>
            </div>
        </div>
    );
}