import React, { useState, useEffect } from "react";
import think from "../services/thinking.js";
import { Navbar } from "../components/controlNavBar.jsx";
import { AdBanner } from "../components/adBanner.jsx";
import { Trash2, Sliders, CheckCircle2, ShieldCheck, ShieldAlert } from "lucide-react";
import "../styles/preferences_management.css";

export function Preferences() {
    const [loading, setLoading] = useState(true);
    const [preferencias, setPreferencias] = useState([]);
    const [deletingId, setDeletingId] = useState(null);

    const carregarDados = async () => {
        try {
            setLoading(true);
            const response = await think.getPreferences();
            const data = response?.data || response;
            if (data && Array.isArray(data)) {
                setPreferencias(data);
            } else {
                setPreferencias([]);
            }
        } catch (error) {
            console.error("Erro ao obter preferências:", error);
            setPreferencias([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);

    const excluirPreferencia = async (preferenciaId) => {
        const confirmar = window.confirm("Deseja realmente remover esta regra de preferência?");
        if (!confirmar) return;

        setDeletingId(preferenciaId);
        try {
            await think.deletePreferences(preferenciaId);
            alert("Preferência removida com sucesso!");
            await carregarDados();
        } catch (error) {
            console.error("Erro ao excluir preferência:", error);
            alert("Erro ao remover preferência.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="preferences-page">
            <Navbar />

            <main className="preferences-main-container">
                <div className="entity-header-row">
                    <div className="entity-title-group">
                        <div className="entity-icon-badge">
                            <Sliders size={22} />
                        </div>
                        <div>
                            <h1 className="entity-main-title">Gerenciar Preferências</h1>
                            <p className="entity-subtitle">Visualize e ajuste os bloqueios de sugestões do pensador para cada gasto</p>
                        </div>
                    </div>
                </div>

                <section className="preferences-card">
                    <div className="preferences-card-header">
                        <h2 className="preferences-card-title">Regras e Bloqueios Cadastrados</h2>
                        <span className="preferences-count-badge">{preferencias.length} regras ativas</span>
                    </div>

                    <div className="preferences-table-wrapper">
                        {loading ? (
                            <div className="preferences-loading">
                                <div className="spinner"></div>
                                <p>Carregando suas preferências...</p>
                            </div>
                        ) : preferencias.length === 0 ? (
                            <div className="preferences-empty">
                                <ShieldCheck size={32} className="empty-shield-icon" />
                                <strong>Nenhuma preferência ou bloqueio registrado.</strong>
                                <p>Quando você bloquear sugestões na aba Pensando, elas aparecerão aqui para gestão.</p>
                            </div>
                        ) : (
                            <table className="preferences-custom-table">
                                <thead>
                                    <tr>
                                        <th>Nome do Gasto</th>
                                        <th>Bloqueio Redução</th>
                                        <th>Bloqueio Exclusão</th>
                                        <th className="th-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {preferencias.map((item) => (
                                        <tr key={item.IdPreferencia || item.id} className="preference-table-row">
                                            <td className="td-nome">
                                                <strong>{item.GastoNome || item.nome || `Gasto #${item.IdGasto || item.id}`}</strong>
                                            </td>
                                            <td>
                                                <span className={`status-pill ${item.Reduzir ? 'status-pill--blocked' : 'status-pill--allowed'}`}>
                                                    {item.Reduzir ? <ShieldAlert size={14} /> : <CheckCircle2 size={14} />}
                                                    {item.Reduzir ? "Bloqueado" : "Liberado"}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-pill ${item.Excluir ? 'status-pill--blocked' : 'status-pill--allowed'}`}>
                                                    {item.Excluir ? <ShieldAlert size={14} /> : <CheckCircle2 size={14} />}
                                                    {item.Excluir ? "Bloqueado" : "Liberado"}
                                                </span>
                                            </td>
                                            <td className="td-center">
                                                <button
                                                    className="action-icon-btn action-icon-btn--delete"
                                                    onClick={() => excluirPreferencia(item.IdPreferencia || item.id)}
                                                    disabled={deletingId === (item.IdPreferencia || item.id)}
                                                    title="Remover regra de bloqueio"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </section>

                <AdBanner slot="preferences-footer-slot" format="horizontal" />
            </main>
        </div>
    );
}

export default Preferences;