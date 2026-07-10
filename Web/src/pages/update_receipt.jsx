import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import cadastrate from "../services/cadastrate.js";
import "../styles/cadastrate_receipt.css";
import { BackButtonHeader } from "../components/backButtonHeader.jsx";

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
    }

    function limparFormulario() {
        setSelectedId(null);
        setFormData(INITIAL_FORM);
        setError("");
    }

    async function salvarEdicao(event) {
        event.preventDefault();

        if (!formData.receiptId) {
            setError("Selecione uma renda para editar.");
            return;
        }

        setSaving(true);
        setError("");

        try {
            await cadastrate.updateRenda({
                receiptId: formData.receiptId,
                name: formData.name,
                minValue: parseFloat(formData.minValue),
                maxValue: parseFloat(formData.maxValue),
                paymentDate: formData.paymentDate,
            });

            alert("Renda atualizada com sucesso!");
            await loadRendas();
            limparFormulario();
        } catch (err) {
            const mensagem =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Erro ao atualizar renda.";

            setError(mensagem);
            alert(mensagem);
        } finally {
            setSaving(false);
        }
    }

    async function removerRenda(renda) {
        const confirmar = window.confirm(
            `Deseja realmente remover a renda "${renda.name}"?`
        );

        if (!confirmar) return;

        setDeletingId(renda.receiptId);
        setError("");

        try {
            await cadastrate.deleteRenda(renda.receiptId);

            alert("Renda removida com sucesso!");

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
                                Gerenciar <span>rendas</span>
                            </>
                        }
                    />

                    <form onSubmit={salvarEdicao}>
                        <label htmlFor="renda_edit_nome">Nome da renda</label>
                        <br />
                        <input
                            id="renda_edit_nome"
                            name="name"
                            type="text"
                            required
                            placeholder="Selecione uma renda para editar"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                        <br />

                        <label htmlFor="renda_edit_data">
                            Data do último recebimento:
                        </label>
                        <input
                            id="renda_edit_data"
                            name="paymentDate"
                            type="date"
                            required
                            value={formData.paymentDate}
                            onChange={handleInputChange}
                        />
                        <br />

                        <label htmlFor="renda_edit_vlr_min">Valor mínimo:</label>
                        <input
                            id="renda_edit_vlr_min"
                            name="minValue"
                            type="number"
                            step="0.01"
                            required
                            value={formData.minValue}
                            onChange={handleInputChange}
                        />
                        <br />

                        <label htmlFor="renda_edit_vlr_max">Valor máximo:</label>
                        <input
                            id="renda_edit_vlr_max"
                            name="maxValue"
                            type="number"
                            step="0.01"
                            required
                            value={formData.maxValue}
                            onChange={handleInputChange}
                        />
                        <br />

                        {error && <p className="error-message">{error}</p>}

                        <div className="button-row">
                            <button
                                type="submit"
                                name="submit"
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
                                <th>Rendas cadastradas</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="scroll">
                                        {loadingList ? (
                                            <p>Carregando rendas...</p>
                                        ) : rendas.length === 0 ? (
                                            <p>Nenhuma renda cadastrada.</p>
                                        ) : (
                                            rendas.map((renda) => {
                                                const isSelected =
                                                    selectedId === renda.receiptId;

                                                return (
                                                    <div
                                                        key={renda.receiptId}
                                                        className={`fill-button item-row ${
                                                            isSelected ? "item-row-active" : ""
                                                        }`}
                                                    >
                                                        <div
                                                            className="item-row-content"
                                                            onClick={() => preencherFormulario(renda)}
                                                            role="button"
                                                            tabIndex={0}
                                                            onKeyDown={(e) => {
                                                                if (
                                                                    e.key === "Enter" ||
                                                                    e.key === " "
                                                                ) {
                                                                    preencherFormulario(renda);
                                                                }
                                                            }}
                                                        >
                                                            <span className="item-title">
                                                                {renda.name}
                                                            </span>

                                                            <span className="item-subtitle">
                                                                {Number(
                                                                    renda.minValue || 0
                                                                ).toLocaleString("pt-BR", {
                                                                    style: "currency",
                                                                    currency: "BRL",
                                                                })}
                                                            </span>
                                                        </div>

                                                        <div className="item-actions">
                                                            <button
                                                                type="button"
                                                                className="icon-button"
                                                                title="Editar"
                                                                onClick={() =>
                                                                    preencherFormulario(renda)
                                                                }
                                                            >
                                                                <Pencil size={16} />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="icon-button danger"
                                                                title="Excluir"
                                                                disabled={
                                                                    deletingId === renda.receiptId
                                                                }
                                                                onClick={() =>
                                                                    removerRenda(renda)
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