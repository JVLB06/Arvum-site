import React, { useState, useEffect } from "react";
import expenses from "../services/extract.js";
import PieChart from "../components/pieGraph.jsx";
import ColumnChart from "../components/columnGraph.jsx";
import { Navbar } from "../components/controlNavBar.jsx";
import { AdBanner } from "../components/adBanner.jsx";
import { Link } from "react-router-dom";
import { Pencil, Plus, CreditCard } from "lucide-react";
import "../styles/expenses.css";

export function Expenses() {
    const [gastos, setGastos] = useState([]);
    const [dadosGraficoPie, setDadosGraficoPie] = useState([]);
    const [dadosGraficoCol, setDadosGraficoCol] = useState([]);
    const [loading, setLoading] = useState(true);

    const CORES = [
        "#0F3B2E",
        "#D4A017",
        "#084C61",
        "#912824",
        "#B4641E",
        "#58508D",
        "#228B22",
        "#D2691E"
    ];

    function ehMesAtual(dataString) {
        if (!dataString) return false;
        const dataItem = new Date(dataString);
        const hoje = new Date();
        return (
            dataItem.getMonth() === hoje.getMonth() &&
            dataItem.getFullYear() === hoje.getFullYear()
        );
    }

    function agruparGastosMesAtualPorTipo(listaGastos) {
        const agrupado = {};
        listaGastos
            .filter((item) => ehMesAtual(item.data))
            .forEach((item) => {
                const idTipo = item.id_divida_item || item.id || item.gastoId;
                const valor = Number(item.vlr_pagamento || item.valor || item.minValue || 0);

                if (!agrupado[idTipo]) {
                    agrupado[idTipo] = {
                        id: idTipo,
                        label: item.nome || item.descricao || item.description || `Gasto ${idTipo}`,
                        value: 0
                    };
                }
                agrupado[idTipo].value += valor;
            });
        return Object.values(agrupado);
    }

    function agruparGastosPorMes(listaGastos) {
        const mesesNomes = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
        const agrupado = {};

        mesesNomes.forEach((m) => { agrupado[m] = 0; });

        listaGastos.forEach((item) => {
            if (!item.data) return;
            const dataItem = new Date(item.data);
            if (!Number.isNaN(dataItem.getTime())) {
                const mesIdx = dataItem.getMonth();
                const nomeMes = mesesNomes[mesIdx];
                const valor = Number(item.vlr_pagamento || item.valor || item.minValue || 0);
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
                const response = await expenses.obtainExpensePayments();
                const listaGastos = Array.isArray(response) 
                    ? response 
                    : Array.isArray(response?.data) 
                    ? response.data 
                    : response?.gastos || [];

                const gastosAgrupados = agruparGastosMesAtualPorTipo(listaGastos);
                setGastos(gastosAgrupados);

                setDadosGraficoPie(
                    gastosAgrupados.map((item, index) => ({
                        label: item.label,
                        value: item.value,
                        color: CORES[index % CORES.length]
                    }))
                );

                setDadosGraficoCol(agruparGastosPorMes(listaGastos));
            } catch (error) {
                console.error("Erro ao consolidar dados de gastos:", error);
                setGastos([]);
                setDadosGraficoPie([]);
                setDadosGraficoCol([]);
            } finally {
                setLoading(false);
            }
        }

        carregarTudo();
    }, []);

    const totalGastosMes = gastos.reduce((acc, g) => acc + Number(g.value || 0), 0);

    return (
        <div className="entity-page">
            <Navbar>
                <Link to="/atualizar_gasto" className="head_button" title="Gerenciar Gastos">
                    <Pencil size={16} />
                    <span>Gerenciar</span>
                </Link>
                <Link to="/cadastrar_gasto" className="head_button head_button--highlight" title="Novo Gasto">
                    <Plus size={18} />
                    <span>Novo Gasto</span>
                </Link>
            </Navbar>

            <main className="entity-main">
                <div className="entity-header-row">
                    <div className="entity-title-group">
                        <div className="entity-icon-badge">
                            <CreditCard size={22} />
                        </div>
                        <div>
                            <h1 className="entity-main-title">Gastos & Despesas</h1>
                            <p className="entity-subtitle">Controle suas saídas financeiras e identifique onde economizar</p>
                        </div>
                    </div>
                </div>

                {/* SEÇÃO SUPERIOR: LISTA DO MÊS + GRÁFICO DE PIZZA */}
                <div className="entity-upper-grid">
                    <section className="entity-card entity-list-card">
                        <div className="card-header-bar">
                            <h2 className="card-section-title">Totais de gastos no mês atual</h2>
                            <span className="card-badge-total">
                                {totalGastosMes.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </span>
                        </div>

                        <div className="entity-items-list">
                            {loading ? (
                                <p className="loading-text">Carregando gastos...</p>
                            ) : gastos.length > 0 ? (
                                gastos.map((gasto, index) => (
                                    <div className="entity-data-row" key={gasto.id || index}>
                                        <div className="entity-data-info">
                                            <span className="entity-row-dot" style={{ backgroundColor: "#B4641E" }}></span>
                                            <span className="entity-data-label">{gasto.label}</span>
                                        </div>
                                        <strong className="entity-data-value">
                                            {Number(gasto.value).toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL"
                                            })}
                                        </strong>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state-box">
                                    <p>Nenhum gasto registrado no mês atual.</p>
                                    <Link to="/cadastrar_gasto" className="empty-action-link">
                                        + Adicionar seu primeiro gasto
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

                <AdBanner slot="expenses-footer-slot" format="horizontal" />
            </main>
        </div>
    );
}

export default Expenses;