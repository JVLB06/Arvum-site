import React, { useState, useEffect } from "react";
import expenses from "../services/extract.js";
import PieChart from "../components/pieGraph.jsx";
import ColumnChart from "../components/columnGraph.jsx";
import { Navbar } from "../components/controlNavBar.jsx";
import { AdBanner } from "../components/adBanner.jsx";
import { Link } from "react-router-dom";
import { Pencil, Plus, Target } from "lucide-react";
import "../styles/goals.css";

export function Goal() {
    const [metas, setMetas] = useState([]);
    const [dadosGraficoPie, setDadosGraficoPie] = useState([]);
    const [dadosGraficoCol, setDadosGraficoCol] = useState([]);
    const [loading, setLoading] = useState(true);

    const CORES = [
        "#D4A017",
        "#0F3B2E",
        "#084C61",
        "#912824",
        "#B4641E",
        "#58508D",
        "#228B22",
        "#D2691E"
    ];

    function normalizarListaMetas(response) {
        return Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response)
            ? response
            : response?.metas || [];
    }

    function ehMesAtual(dataString) {
        if (!dataString) return false;
        const dataItem = new Date(dataString);
        const hoje = new Date();
        return (
            dataItem.getMonth() === hoje.getMonth() &&
            dataItem.getFullYear() === hoje.getFullYear()
        );
    }

    function agruparMetasMesAtualPorTipo(listaMetas) {
        const agrupado = {};
        listaMetas
            .filter((item) => ehMesAtual(item.data))
            .forEach((item) => {
                const idTipo = item.id_divida_item || item.id;
                const valor = Number(item.vlr_pagamento || item.value || item.valor || 0);

                if (!agrupado[idTipo]) {
                    agrupado[idTipo] = {
                        id: idTipo,
                        label: item.nome || item.descricao || item.description || `Meta ${idTipo}`,
                        value: 0,
                        progress: item.progress || item.progresso || 35 // fallback se não vier
                    };
                }
                agrupado[idTipo].value += valor;
            });
        return Object.values(agrupado);
    }

    function agruparMetasPorMes(listaMetas) {
        const mesesNomes = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
        const agrupado = {};

        mesesNomes.forEach((m) => { agrupado[m] = 0; });

        listaMetas.forEach((item) => {
            if (!item.data) return;
            const dataItem = new Date(item.data);
            if (!Number.isNaN(dataItem.getTime())) {
                const mesIdx = dataItem.getMonth();
                const nomeMes = mesesNomes[mesIdx];
                const valor = Number(item.vlr_pagamento || item.value || item.valor || 0);
                agrupado[nomeMes] = (agrupado[nomeMes] || 0) + valor;
            }
        });

        return mesesNomes.map((mes, index) => ({
            label: mes,
            value: agrupado[mes] || 0,
            color: CORES[index % CORES.length]
        }));
    }

    useEffect(() => {
        async function carregarTudo() {
            setLoading(true);
            try {
                const response = await expenses.obtainGoalPayments();
                const listaMetas = normalizarListaMetas(response);

                const metasAgrupadas = agruparMetasMesAtualPorTipo(listaMetas);
                setMetas(metasAgrupadas);

                setDadosGraficoPie(
                    metasAgrupadas.map((item, index) => ({
                        label: item.label,
                        value: item.value,
                        color: CORES[index % CORES.length]
                    }))
                );

                setDadosGraficoCol(agruparMetasPorMes(listaMetas));
            } catch (error) {
                console.error("Erro ao carregar metas:", error);
                setMetas([]);
                setDadosGraficoPie([]);
                setDadosGraficoCol([]);
            } finally {
                setLoading(false);
            }
        }

        carregarTudo();
    }, []);

    const totalMetasMes = metas.reduce((acc, m) => acc + Number(m.value || 0), 0);

    return (
        <div className="entity-page">
            <Navbar>
                <Link to="/atualizar_meta" className="head_button" title="Gerenciar Metas">
                    <Pencil size={16} />
                    <span>Gerenciar</span>
                </Link>
                <Link to="/cadastrar_meta" className="head_button head_button--highlight" title="Nova Meta">
                    <Plus size={18} />
                    <span>Nova Meta</span>
                </Link>
            </Navbar>

            <main className="entity-main">
                <div className="entity-header-row">
                    <div className="entity-title-group">
                        <div className="entity-icon-badge">
                            <Target size={22} />
                        </div>
                        <div>
                            <h1 className="entity-main-title">Metas & Conquistas</h1>
                            <p className="entity-subtitle">Planeje e visualize o avanço dos seus objetivos de curto e longo prazo</p>
                        </div>
                    </div>
                </div>

                {/* SEÇÃO SUPERIOR: LISTA + PIE CHART */}
                <div className="entity-upper-grid">
                    <section className="entity-card entity-list-card">
                        <div className="card-header-bar">
                            <h2 className="card-section-title">Totais de metas no mês atual</h2>
                            <span className="card-badge-total">
                                {totalMetasMes.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </span>
                        </div>

                        <div className="entity-items-list">
                            {loading ? (
                                <p className="loading-text">Carregando metas...</p>
                            ) : metas.length > 0 ? (
                                metas.map((meta, index) => (
                                    <div className="entity-data-row" key={meta.id || index}>
                                        <div className="entity-data-info">
                                            <span className="entity-row-dot" style={{ backgroundColor: "#D4A017" }}></span>
                                            <span className="entity-data-label">{meta.label}</span>
                                        </div>
                                        <strong className="entity-data-value">
                                            {Number(meta.value).toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL"
                                            })}
                                        </strong>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state-box">
                                    <p>Nenhuma meta registrada no mês atual.</p>
                                    <Link to="/cadastrar_meta" className="empty-action-link">
                                        + Cadastrar seu primeiro objetivo
                                    </Link>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="entity-pie-card">
                        <PieChart dataItems={dadosGraficoPie} />
                    </section>
                </div>

                {/* BARRAS DE PROGRESSO DAS METAS (Conforme VisualIdentity.pdf Page 11) */}
                {metas.length > 0 && (
                    <section className="entity-card goals-progress-section">
                        <div className="card-header-bar">
                            <h2 className="card-section-title">Progresso das Metas</h2>
                        </div>
                        <div className="goals-progress-list">
                            {metas.map((meta, idx) => {
                                const progresso = Math.min(100, Math.max(10, meta.progress || ((idx + 1) * 25) % 100));
                                return (
                                    <div className="goal-progress-row" key={meta.id || idx}>
                                        <span className="goal-progress-name">{meta.label}</span>
                                        <div className="goal-progress-bar-container">
                                            <div 
                                                className="goal-progress-bar-fill"
                                                style={{ width: `${progresso}%` }}
                                            ></div>
                                        </div>
                                        <span className="goal-progress-percent">{progresso}%</span>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* SEÇÃO INFERIOR: GRÁFICO DE COLUNAS */}
                <section className="entity-column-card">
                    <ColumnChart dataItems={dadosGraficoCol} />
                </section>

                <AdBanner slot="goals-footer-slot" format="horizontal" />
            </main>
        </div>
    );
}

export default Goal;