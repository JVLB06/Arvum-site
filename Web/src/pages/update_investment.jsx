import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import cadastrate from "../services/cadastrate.js";
import "../styles/cadastrate_investment.css";
import { BackButtonHeader } from "../components/backButtonHeader.jsx";

const INITIAL_FORM = {
    id_invest: "",
    descricao: "",
    vlr: "",
    data_init: "",
    juro: "",
};

function normalizeInvestment(item) {
    return {
        id_invest: item?.id ?? item?.id_invest ?? "",
        descricao: item?.descricao ?? item?.nome ?? "",
        vlr: item?.vlr ?? "",
        data_init: item?.data_init ? String(item.data_init).split("T")[0] : "",
        juro: item?.juro ?? "",
    };
}

export function UpdateInvestment() {
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [investimentos, setInvestimentos] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [error, setError] = useState("");
    const [loadingList, setLoadingList] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const hasSelectedItem = useMemo(() => Boolean(selectedId), [selectedId]);

    async function loadInvestments() {
        try {
            setLoadingList(true);
            setError("");

            const data = await cadastrate.getActiveInvestments();
            const normalized = Array.isArray(data) ? data.map(normalizeInvestment) : [];
            setInvestimentos(normalized);
        } catch (err) {
            const mensagem =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Erro ao carregar investimentos.";

            setError(mensagem);
        } finally {
            setLoadingList(false);
        }
    }

    useEffect(() => {
        loadInvestments();
    }, []);

    function handleInputChange(event) {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function preencherFormulario(investimento) {
        setSelectedId(investimento.id_invest);
        setFormData({
            id_invest: investimento.id_invest,
            descricao: investimento.descricao,
            vlr: investimento.vlr,
            data_init: investimento.data_init,
            juro: investimento.juro,
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

        if (!formData.id_invest) {
            setError("Selecione um investimento para editar.");
            return;
        }

        setSaving(true);
        setError("");

        try {
            await cadastrate.updateInvestment({
                id: formData.id_invest,
                descricao: formData.descricao,
                vlr: formData.vlr,
                data_init: formData.data_init,
                juro: formData.juro,
            });

            alert("Investimento atualizado com sucesso!");
            await loadInvestments();
            limparFormulario();
        } catch (err) {
            const mensagem =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Erro ao atualizar investimento.";

            setError(mensagem);
            alert(mensagem);
        } finally {
            setSaving(false);
        }
    }

    async function removerInvestimento(investimento) {
        const confirmar = window.confirm(
            `Deseja realmente remover o investimento "${investimento.descricao}"?`
        );

        if (!confirmar) return;

        setDeletingId(investimento.id_invest);
        setError("");

        try {
            await cadastrate.inactivateInvestment({
                id_invest: investimento.id_invest,
            });

            alert("Investimento removido com sucesso!");

            if (selectedId === investimento.id_invest) {
                limparFormulario();
            }

            await loadInvestments();
        } catch (err) {
            const mensagem =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Erro ao remover investimento.";

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
                                Gerenciar <span>investimento</span>
                            </>
                        }
                    />

                    <form onSubmit={salvarEdicao}>
                        <label htmlFor="investimento_edit_nome">Nome da aplicação</label>
                        <br />
                        <input
                            id="investimento_edit_nome"
                            name="descricao"
                            type="text"
                            required
                            placeholder="Selecione um investimento para editar"
                            value={formData.descricao}
                            onChange={handleInputChange}
                        />
                        <br />

                        <label htmlFor="investimento_edit_data_init">Data início:</label>
                        <input
                            id="investimento_edit_data_init"
                            name="data_init"
                            type="date"
                            required
                            value={formData.data_init}
                            onChange={handleInputChange}
                        />
                        <br />

                        <label htmlFor="investimento_edit_vlr">Valor aplicado:</label>
                        <input
                            id="investimento_edit_vlr"
                            name="vlr"
                            type="number"
                            step="0.01"
                            required
                            value={formData.vlr}
                            onChange={handleInputChange}
                        />
                        <br />

                        <label htmlFor="investimento_edit_juros">Juros:</label>
                        <input
                            id="investimento_edit_juros"
                            name="juro"
                            type="number"
                            step="0.01"
                            required
                            value={formData.juro}
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
                                <th>Investimentos cadastrados</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="scroll">
                                        {loadingList ? (
                                            <p>Carregando investimentos...</p>
                                        ) : investimentos.length === 0 ? (
                                            <p>Nenhum investimento cadastrado.</p>
                                        ) : (
                                            investimentos.map((investimento) => {
                                                const isSelected =
                                                    selectedId === investimento.id_invest;

                                                return (
                                                    <div
                                                        key={investimento.id_invest}
                                                        className={`fill-button item-row ${
                                                            isSelected ? "item-row-active" : ""
                                                        }`}
                                                    >
                                                        <div
                                                            className="item-row-content"
                                                            onClick={() =>
                                                                preencherFormulario(investimento)
                                                            }
                                                            role="button"
                                                            tabIndex={0}
                                                            onKeyDown={(e) => {
                                                                if (
                                                                    e.key === "Enter" ||
                                                                    e.key === " "
                                                                ) {
                                                                    preencherFormulario(investimento);
                                                                }
                                                            }}
                                                        >
                                                            <span className="item-title">
                                                                {investimento.descricao}
                                                            </span>

                                                            <span className="item-subtitle">
                                                                {Number(
                                                                    investimento.vlr || 0
                                                                ).toLocaleString("pt-BR", {
                                                                    style: "currency",
                                                                    currency: "BRL",
                                                                })}
                                                                {" • "}
                                                                Juros: {investimento.juro}%
                                                            </span>
                                                        </div>

                                                        <div className="item-actions">
                                                            <button
                                                                type="button"
                                                                className="icon-button"
                                                                title="Editar"
                                                                onClick={() =>
                                                                    preencherFormulario(investimento)
                                                                }
                                                            >
                                                                <Pencil size={16} />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="icon-button danger"
                                                                title="Excluir"
                                                                disabled={
                                                                    deletingId ===
                                                                    investimento.id_invest
                                                                }
                                                                onClick={() =>
                                                                    removerInvestimento(investimento)
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