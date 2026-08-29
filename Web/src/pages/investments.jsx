import React, { useState, useEffect } from "react";
import expenses from "../services/extract.js";
import PieChart from "../components/pieGraph.jsx";
import ColumnChart from "../components/columnGraph.jsx";
import { Navbar } from "../components/controlNavBar.jsx";
import { AdBanner } from "../components/adBanner.jsx";
import { Link } from "react-router-dom";
import { Pencil, Plus, TrendingUp } from "lucide-react";
import "../styles/investments.css";

export function Investment() {
    const [investimentos, setInvestimentos] = useState([]);
    const [dadosGraficoPie, setDadosGraficoPie] = useState([]);
    const [dadosGraficoCol, setDadosGraficoCol] = useState([]);
    const [loading, setLoading] = useState(true);

    const CORES = [
        "#084C61",
        "#0F3B2E",
        "#D4A017",
        "#912824",
        "#B4641E",
        "#58508D",
        "#228B22",
        "#D2691E"
    ];

    function normalizarListaInvestimentos(response) {
        return Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response)
            ? response
            : response?.investimentos || [];
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

    function agruparInvestimentosMesAtualPorTipo(listaInvestimentos) {
        const agrupado = {};
        listaInvestimentos
            .filter((item) => ehMesAtual(item.data))
            .forEach((item) => {
                const idTipo = item.id_divida_item || item.id;
                const valor = Number(item.vlr_pagamento || item.value || item.valor || 0);

                if (!agrupado[idTipo]) {
                    agrupado[idTipo] = {
                        id: idTipo,
                        label: item.nome || item.descricao || item.description || `Investimento ${idTipo}`,
                        value: 0
                    };
                }
                agrupado[idTipo].value += valor;
            });
        return Object.values(agrupado);
    }

    function agruparInvestimentosPorMes(listaInvestimentos) {
        const mesesNomes = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
        const agrupado = {};

        mesesNomes.forEach((m) => { agrupado[m] = 0; });

        listaInvestimentos.forEach((item) => {
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
                const response = await expenses.obtainInvestmentPayments();
                const listaInvestimentos = normalizarListaInvestimentos(response);

                const investimentosAgrupados = agruparInvestimentosMesAtualPorTipo(listaInvestimentos);
                setInvestimentos(investimentosAgrupados);

                setDadosGraficoPie(
                    investimentosAgrupados.map((item, index) => ({
                        label: item.label,
                        value: item.value,
                        color: CORES[index % CORES.length]
                    }))
                );

                setDadosGraficoCol(agruparInvestimentosPorMes(listaInvestimentos));
            } catch (error) {
                console.error("Erro ao carregar investimentos:", error);
                setInvestimentos([]);
                setDadosGraficoPie([]);
                setDadosGraficoCol([]);
            } finally {
                setLoading(false);
            }
        }

        carregarTudo();
    }, []);

    const totalInvestMes = investimentos.reduce((acc, i) => acc + Number(i.value || 0), 0);

    return (
        <div className="entity-page">
            <Navbar>
                <Link to="/atualizar_investimento" className="head_button" title="Gerenciar Investimentos">
                    <Pencil size={16} />
                    <span>Gerenciar</span>
                </Link>
                <Link to="/cadastrar_investimento" className="head_button head_button--highlight" title="Novo Investimento">
                    <Plus size={18} />
                    <span>Novo Investimento</span>
                </Link>
            </Navbar>

            <main className="entity-main">
                <div className="entity-header-row">
                    <div className="entity-title-group">
                        <div className="entity-icon-badge">
                            <TrendingUp size={22} />
                        </div>
                        <div>
                            <h1 className="entity-main-title">Investimentos & Aplicações</h1>
                            <p className="entity-subtitle">Acompanhe seus aportes e o crescimento do seu patrimônio</p>
                        </div>
                    </div>
                </div>

                {/* SEÇÃO SUPERIOR: LISTA DO MÊS + GRÁFICO DE PIZZA */}
                <div className="entity-upper-grid">
                    <section className="entity-card entity-list-card">
                        <div className="card-header-bar">
                            <h2 className="card-section-title">Totais de investimentos no mês atual</h2>
                            <span className="card-badge-total">
                                {totalInvestMes.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </span>
                        </div>

                        <div className="entity-items-list">
                            {loading ? (
                                <p className="loading-text">Carregando investimentos...</p>
                            ) : investimentos.length > 0 ? (
                                investimentos.map((item, index) => (
                                    <div className="entity-data-row" key={item.id || index}>
                                        <div className="entity-data-info">
                                            <span className="entity-row-dot" style={{ backgroundColor: "#084C61" }}></span>
                                            <span className="entity-data-label">{item.label}</span>
                                        </div>
                                        <strong className="entity-data-value">
                                            {Number(item.value).toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL"
                                            })}
                                        </strong>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state-box">
                                    <p>Nenhum investimento registrado no mês atual.</p>
                                    <Link to="/cadastrar_investimento" className="empty-action-link">
                                        + Adicionar seu primeiro investimento
                                    </Link>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="entity-pie-card">
                        <PieChart dataItems={dadosGraficoPie} />
                    </section>
                </div>

                {/* SEÇÃO INFERIOR: GRÁFICO DE COLUNAS */}
                <section className="entity-column-card">
                    <ColumnChart dataItems={dadosGraficoCol} />
                </section>

                <AdBanner slot="investments-footer-slot" format="horizontal" />
            </main>
        </div>
    );
}

export default Investment;