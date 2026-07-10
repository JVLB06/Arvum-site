import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import cadastrate from "../services/cadastrate.js";
import "../styles/cadastrate_expenses.css";
import { BackButtonHeader } from "../components/backButtonHeader.jsx";

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
        maxValue: item?.maxValue ?? item?.vlr_max ?? "",
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
                : typeof item?.priority === "number"
                ? item.priority
                : Number(item?.priority ?? item?.priority ?? 1),
        isFixed:
            typeof item?.isFixed === "boolean"
                ? item.isFixed
                : typeof item?.isFixed === "boolean"
                ? item.isFixed
                : item?.fix_var ?? true,
    };
}

export function UpdateExpenses() {
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [gastos, setGastos] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [error, setError] = useState("");
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
    }

    function limparFormulario() {
        setSelectedId(null);
        setFormData(INITIAL_FORM);
        setError("");
    }

    async function salvarEdicao(event) {
        event.preventDefault();

        if (!formData.id) {
            setError("Selecione um gasto para editar.");
            return;
        }

        setSaving(true);
        setError("");

        try {
            await cadastrate.updateExpense({
                id: formData.id,
                description: formData.description,
                minValue: parseFloat(formData.minValue),
                maxValue: parseFloat(formData.maxValue),
                dueDate: formData.dueDate,
                priority: parseInt(formData.priority),
                isFixed: formData.isFixed,
            });

            alert("Gasto atualizado com sucesso!");
            await loadExpenses();
            limparFormulario();
        } catch (err) {
            const mensagem =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Erro ao atualizar gasto.";

            setError(mensagem);
            alert(mensagem);
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

        try {
            await cadastrate.inactivateExpense(gasto.id);

            alert("Gasto removido com sucesso!");

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
                                Gerenciar <span>gasto</span>
                            </>
                        }
                    />

                    <form onSubmit={salvarEdicao}>
                        <label htmlFor="gasto_edit_nome">Nome do gasto</label>
                        <input
                            id="gasto_edit_nome"
                            name="description"
                            type="text"
                            required
                            placeholder="Selecione um gasto para editar"
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                        <br />

                        <label htmlFor="gasto_edit_data">Data do último pagamento:</label>
                        <input
                            id="gasto_edit_data"
                            name="dueDate"
                            type="date"
                            required
                            value={formData.dueDate}
                            onChange={handleInputChange}
                        />
                        <br />

                        <label htmlFor="gasto_edit_vlr_min">Valor mínimo:</label>
                        <input
                            id="gasto_edit_vlr_min"
                            name="minValue"
                            type="number"
                            step="0.01"
                            required
                            value={formData.minValue}
                            onChange={handleInputChange}
                        />
                        <br />

                        <label htmlFor="gasto_edit_vlr_max">Valor máximo:</label>
                        <input
                            id="gasto_edit_vlr_max"
                            name="maxValue"
                            type="number"
                            step="0.01"
                            required
                            value={formData.maxValue}
                            onChange={handleInputChange}
                        />
                        <br />

                        <div className="radio-group">
                            <label>Nível de priority:</label>

                            <div className="radio-option">
                                <input
                                    type="radio"
                                    id="gasto_edit_priority_baixa"
                                    name="priority"
                                    value="0"
                                    checked={Number(formData.priority) === 0}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            priority: Number(e.target.value),
                                        }))
                                    }
                                />
                                <label htmlFor="gasto_edit_priority_baixa">Baixa</label>
                            </div>

                            <div className="radio-option">
                                <input
                                    type="radio"
                                    id="gasto_edit_priority_media"
                                    name="priority"
                                    value="1"
                                    checked={Number(formData.priority) === 1}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            priority: Number(e.target.value),
                                        }))
                                    }
                                />
                                <label htmlFor="gasto_edit_priority_media">Média</label>
                            </div>

                            <div className="radio-option">
                                <input
                                    type="radio"
                                    id="gasto_edit_priority_alta"
                                    name="priority"
                                    value="2"
                                    checked={Number(formData.priority) === 2}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            priority: Number(e.target.value),
                                        }))
                                    }
                                />
                                <label htmlFor="gasto_edit_priority_alta">Alta</label>
                            </div>

                            <div className="radio-option">
                                <input
                                    type="radio"
                                    id="gasto_edit_priority_essencial"
                                    name="priority"
                                    value="3"
                                    checked={Number(formData.priority) === 3}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            priority: Number(e.target.value),
                                        }))
                                    }
                                />
                                <label htmlFor="gasto_edit_priority_essencial">
                                    Essencial
                                </label>
                            </div>
                        </div>
                        <br />

                        <div className="radio-group">
                            <label>Gasto fixo ou variável?</label>

                            <div className="radio-option">
                                <input
                                    type="radio"
                                    id="gasto_edit_fixo"
                                    name="isFixed"
                                    checked={formData.isFixed === true}
                                    onChange={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            isFixed: true,
                                        }))
                                    }
                                />
                                <label htmlFor="gasto_edit_fixo">Fixo</label>
                            </div>

                            <div className="radio-option">
                                <input
                                    type="radio"
                                    id="gasto_edit_variavel"
                                    name="isFixed"
                                    checked={formData.isFixed === false}
                                    onChange={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            isFixed: false,
                                        }))
                                    }
                                />
                                <label htmlFor="gasto_edit_variavel">Variável</label>
                            </div>
                        </div>
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
                                <th>Gastos cadastrados</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="scroll">
                                        {loadingList ? (
                                            <p>Carregando gastos...</p>
                                        ) : gastos.length === 0 ? (
                                            <p>Nenhum gasto cadastrado.</p>
                                        ) : (
                                            gastos.map((gasto) => {
                                                const isSelected =
                                                    selectedId === gasto.id;

                                                return (
                                                    <div
                                                        key={gasto.id}
                                                        className={`fill-button item-row ${
                                                            isSelected ? "item-row-active" : ""
                                                        }`}
                                                    >
                                                        <div
                                                            className="item-row-content"
                                                            onClick={() => preencherFormulario(gasto)}
                                                            role="button"
                                                            tabIndex={0}
                                                            onKeyDown={(e) => {
                                                                if (
                                                                    e.key === "Enter" ||
                                                                    e.key === " "
                                                                ) {
                                                                    preencherFormulario(gasto);
                                                                }
                                                            }}
                                                        >
                                                            <span className="item-title">
                                                                {gasto.description}
                                                            </span>

                                                            <span className="item-subtitle">
                                                                {Number(gasto.minValue || 0).toLocaleString(
                                                                    "pt-BR",
                                                                    {
                                                                        style: "currency",
                                                                        currency: "BRL",
                                                                    }
                                                                )}
                                                                {" • "}
                                                                {gasto.isFixed ? "Fixo" : "Variável"}
                                                            </span>
                                                        </div>

                                                        <div className="item-actions">
                                                            <button
                                                                type="button"
                                                                className="icon-button"
                                                                title="Editar"
                                                                onClick={() =>
                                                                    preencherFormulario(gasto)
                                                                }
                                                            >
                                                                <Pencil size={16} />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="icon-button danger"
                                                                title="Excluir"
                                                                disabled={
                                                                    deletingId === gasto.id
                                                                }
                                                                onClick={() =>
                                                                    removerGasto(gasto)
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