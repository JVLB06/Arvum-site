import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import cadastrate from "../services/cadastrate.js";
import "../styles/cadastrate_receipt.css";
import { BackButtonHeader } from "../components/backButtonHeader.jsx";

const INITIAL_FORM = {
    id_renda: "",
    descricao: "",
    vlr_min: "",
    vlr_max: "",
    data: "",
};

function normalizeRenda(item) {
    return {
        id_renda: item?.id ?? item?.id_renda ?? "",
        descricao: item?.descricao ?? item?.nome ?? "",
        vlr_min: item?.vlr_min ?? "",
        vlr_max: item?.vlr_max ?? item?.vlr_min ?? "",
        data: item?.data ? String(item.data).split("T")[0] : "",
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
        setSelectedId(renda.id_renda);
        setFormData({
            id_renda: renda.id_renda,
            descricao: renda.descricao,
            vlr_min: renda.vlr_min,
            vlr_max: renda.vlr_max,
            data: renda.data,
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

        if (!formData.id_renda) {
            setError("Selecione uma renda para editar.");
            return;
        }

        setSaving(true);
        setError("");

        try {
            await cadastrate.updateRenda({
                id_renda: formData.id_renda,
                descricao: formData.descricao,
                vlr_min: formData.vlr_min,
                vlr_max: formData.vlr_max,
                data: formData.data,
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
            `Deseja realmente remover a renda "${renda.descricao}"?`
        );

        if (!confirmar) return;

        setDeletingId(renda.id_renda);
        setError("");

        try {
            await cadastrate.deleteRenda(renda.id_renda);

            alert("Renda removida com sucesso!");

            if (selectedId === renda.id_renda) {
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
                            name="descricao"
                            type="text"
                            required
                            placeholder="Selecione uma renda para editar"
                            value={formData.descricao}
                            onChange={handleInputChange}
                        />
                        <br />

                        <label htmlFor="renda_edit_data">
                            Data do último recebimento:
                        </label>
                        <input
                            id="renda_edit_data"
                            name="data"
                            type="date"
                            required
                            value={formData.data}
                            onChange={handleInputChange}
                        />
                        <br />

                        <label htmlFor="renda_edit_vlr_min">Valor mínimo:</label>
                        <input
                            id="renda_edit_vlr_min"
                            name="vlr_min"
                            type="number"
                            step="0.01"
                            required
                            value={formData.vlr_min}
                            onChange={handleInputChange}
                        />
                        <br />

                        <label htmlFor="renda_edit_vlr_max">Valor máximo:</label>
                        <input
                            id="renda_edit_vlr_max"
                            name="vlr_max"
                            type="number"
                            step="0.01"
                            required
                            value={formData.vlr_max}
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
                                                    selectedId === renda.id_renda;

                                                return (
                                                    <div
                                                        key={renda.id_renda}
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
                                                                {renda.descricao}
                                                            </span>

                                                            <span className="item-subtitle">
                                                                {Number(
                                                                    renda.vlr_min || 0
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
                                                                    deletingId === renda.id_renda
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