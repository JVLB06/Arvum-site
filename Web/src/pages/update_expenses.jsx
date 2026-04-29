import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import cadastrate from "../services/cadastrate.js";
import "../styles/cadastrate_expenses.css";
import { BackButtonHeader } from "../components/backButtonHeader.jsx";

const INITIAL_FORM = {
    id_gasto: "",
    descricao: "",
    vlr_min: "",
    vlr_max: "",
    data_venc: "",
    prioridade: 1,
    fixvar: true,
};

function normalizeExpense(item) {
    return {
        id_gasto: item?.id ?? item?.id_gasto ?? "",
        descricao: item?.descricao ?? item?.nome ?? "",
        vlr_min: item?.vlr_min ?? "",
        vlr_max: item?.vlr_max ?? "",
        data_venc:
            item?.data_venc
                ? String(item.data_venc).split("T")[0]
                : item?.data_init
                ? String(item.data_init).split("T")[0]
                : "",
        prioridade:
            typeof item?.prioridade === "number"
                ? item.prioridade
                : Number(item?.prioridade ?? 1),
        fixvar:
            typeof item?.fixvar === "boolean"
                ? item.fixvar
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
        setSelectedId(gasto.id_gasto);
        setFormData({
            id_gasto: gasto.id_gasto,
            descricao: gasto.descricao,
            vlr_min: gasto.vlr_min,
            vlr_max: gasto.vlr_max,
            data_venc: gasto.data_venc,
            prioridade: gasto.prioridade,
            fixvar: gasto.fixvar,
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

        if (!formData.id_gasto) {
            setError("Selecione um gasto para editar.");
            return;
        }

        setSaving(true);
        setError("");

        try {
            await cadastrate.updateExpense({
                id: formData.id_gasto,
                descricao: formData.descricao,
                vlr_min: formData.vlr_min,
                vlr_max: formData.vlr_max,
                data: formData.data_venc,
                prioridade: Number(formData.prioridade),
                fixvar: formData.fixvar,
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
            `Deseja realmente remover o gasto "${gasto.descricao}"?`
        );

        if (!confirmar) return;

        setDeletingId(gasto.id_gasto);
        setError("");

        try {
            await cadastrate.inactivateExpense(gasto.id_gasto);

            alert("Gasto removido com sucesso!");

            if (selectedId === gasto.id_gasto) {
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
                            name="descricao"
                            type="text"
                            required
                            placeholder="Selecione um gasto para editar"
                            value={formData.descricao}
                            onChange={handleInputChange}
                        />
                        <br />

                        <label htmlFor="gasto_edit_data">Data do último pagamento:</label>
                        <input
                            id="gasto_edit_data"
                            name="data_venc"
                            type="date"
                            required
                            value={formData.data_venc}
                            onChange={handleInputChange}
                        />
                        <br />

                        <label htmlFor="gasto_edit_vlr_min">Valor mínimo:</label>
                        <input
                            id="gasto_edit_vlr_min"
                            name="vlr_min"
                            type="number"
                            step="0.01"
                            required
                            value={formData.vlr_min}
                            onChange={handleInputChange}
                        />
                        <br />

                        <label htmlFor="gasto_edit_vlr_max">Valor máximo:</label>
                        <input
                            id="gasto_edit_vlr_max"
                            name="vlr_max"
                            type="number"
                            step="0.01"
                            required
                            value={formData.vlr_max}
                            onChange={handleInputChange}
                        />
                        <br />

                        <div className="radio-group">
                            <label>Nível de prioridade:</label>

                            <div className="radio-option">
                                <input
                                    type="radio"
                                    id="gasto_edit_prioridade_baixa"
                                    name="prioridade"
                                    value="0"
                                    checked={Number(formData.prioridade) === 0}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            prioridade: Number(e.target.value),
                                        }))
                                    }
                                />
                                <label htmlFor="gasto_edit_prioridade_baixa">Baixa</label>
                            </div>

                            <div className="radio-option">
                                <input
                                    type="radio"
                                    id="gasto_edit_prioridade_media"
                                    name="prioridade"
                                    value="1"
                                    checked={Number(formData.prioridade) === 1}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            prioridade: Number(e.target.value),
                                        }))
                                    }
                                />
                                <label htmlFor="gasto_edit_prioridade_media">Média</label>
                            </div>

                            <div className="radio-option">
                                <input
                                    type="radio"
                                    id="gasto_edit_prioridade_alta"
                                    name="prioridade"
                                    value="2"
                                    checked={Number(formData.prioridade) === 2}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            prioridade: Number(e.target.value),
                                        }))
                                    }
                                />
                                <label htmlFor="gasto_edit_prioridade_alta">Alta</label>
                            </div>

                            <div className="radio-option">
                                <input
                                    type="radio"
                                    id="gasto_edit_prioridade_essencial"
                                    name="prioridade"
                                    value="3"
                                    checked={Number(formData.prioridade) === 3}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            prioridade: Number(e.target.value),
                                        }))
                                    }
                                />
                                <label htmlFor="gasto_edit_prioridade_essencial">
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
                                    name="fixvar"
                                    checked={formData.fixvar === true}
                                    onChange={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            fixvar: true,
                                        }))
                                    }
                                />
                                <label htmlFor="gasto_edit_fixo">Fixo</label>
                            </div>

                            <div className="radio-option">
                                <input
                                    type="radio"
                                    id="gasto_edit_variavel"
                                    name="fixvar"
                                    checked={formData.fixvar === false}
                                    onChange={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            fixvar: false,
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
                                                    selectedId === gasto.id_gasto;

                                                return (
                                                    <div
                                                        key={gasto.id_gasto}
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
                                                                {gasto.descricao}
                                                            </span>

                                                            <span className="item-subtitle">
                                                                {Number(gasto.vlr_min || 0).toLocaleString(
                                                                    "pt-BR",
                                                                    {
                                                                        style: "currency",
                                                                        currency: "BRL",
                                                                    }
                                                                )}
                                                                {" • "}
                                                                {gasto.fixvar ? "Fixo" : "Variável"}
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
                                                                    deletingId === gasto.id_gasto
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