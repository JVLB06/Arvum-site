import React, { useState, useEffect } from "react";
import expenses from "../services/extract.js";
import PieChart from "../components/pieGraph.jsx";
import ColumnChart from "../components/columnGraph.jsx";
import { Navbar } from "../components/controlNavBar.jsx";
import { AdBanner } from "../components/adBanner.jsx";
import { Link } from "react-router-dom";
import { Pencil, Plus, CircleDollarSign } from "lucide-react";
import "../styles/debts.css";

export function Debt() {
    const [dividas, setDividas] = useState([]);
    const [dadosGraficoPie, setDadosGraficoPie] = useState([]);
    const [dadosGraficoCol, setDadosGraficoCol] = useState([]);
    const [loading, setLoading] = useState(true);

    const CORES = [
        "#912824",
        "#0F3B2E",
        "#D4A017",
        "#084C61",
        "#B4641E",
        "#58508D",
        "#228B22",
        "#D2691E"
    ];

    function normalizarListaDividas(response) {
        return Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response)
            ? response
            : response?.dividas || [];
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

    function agruparDividasMesAtualPorTipo(listaDividas) {
        const agrupado = {};
        listaDividas
            .filter((item) => ehMesAtual(item.data))
            .forEach((item) => {
                const idTipo = item.id_divida_item || item.id;
                const valor = Number(item.vlr_pagamento || item.value || item.valor || 0);

                if (!agrupado[idTipo]) {
                    agrupado[idTipo] = {
                        id: idTipo,
                        label: item.nome || item.descricao || item.description || `Dívida ${idTipo}`,
                        value: 0
                    };
                }
                agrupado[idTipo].value += valor;
            });
        return Object.values(agrupado);
    }

    function agruparDividasPorMes(listaDividas) {
        const mesesNomes = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
        const agrupado = {};

        mesesNomes.forEach((m) => { agrupado[m] = 0; });

        listaDividas.forEach((item) => {
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
                const response = await expenses.obtainDebtPayments();
                const listaDividas = normalizarListaDividas(response);

                const dividasAgrupadas = agruparDividasMesAtualPorTipo(listaDividas);
                setDividas(dividasAgrupadas);

                setDadosGraficoPie(
                    dividasAgrupadas.map((item, index) => ({
                        label: item.label,
                        value: item.value,
                        color: CORES[index % CORES.length]
                    }))
                );

                setDadosGraficoCol(agruparDividasPorMes(listaDividas));
            } catch (error) {
                console.error("Erro ao carregar dividas:", error);
                setDividas([]);
                setDadosGraficoPie([]);
                setDadosGraficoCol([]);
            } finally {
                setLoading(false);
            }
        }

        carregarTudo();
    }, []);

    const totalDividasMes = dividas.reduce((acc, d) => acc + Number(d.value || 0), 0);

    return (
        <div className="entity-page">
            <Navbar>
                <Link to="/atualizar_divida" className="head_button" title="Gerenciar Dívidas">
                    <Pencil size={16} />
                    <span>Gerenciar</span>
                </Link>
                <Link to="/cadastrar_divida" className="head_button head_button--highlight" title="Nova Dívida">
                    <Plus size={18} />
                    <span>Nova Dívida</span>
                </Link>
            </Navbar>

            <main className="entity-main">
                <div className="entity-header-row">
                    <div className="entity-title-group">
                        <div className="entity-icon-badge">
                            <CircleDollarSign size={22} />
                        </div>
                        <div>
                            <h1 className="entity-main-title">Dívidas & Financiamentos</h1>
                            <p className="entity-subtitle">Acompanhe seus passivos e planeje a quitação estratégica de débitos</p>
                        </div>
                    </div>
                </div>

                {/* SEÇÃO SUPERIOR: LISTA + PIE CHART */}
                <div className="entity-upper-grid">
                    <section className="entity-card entity-list-card">
                        <div className="card-header-bar">
                            <h2 className="card-section-title">Totais de dívidas no mês atual</h2>
                            <span className="card-badge-total">
                                {totalDividasMes.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </span>
                        </div>

                        <div className="entity-items-list">
                            {loading ? (
                                <p className="loading-text">Carregando dívidas...</p>
                            ) : dividas.length > 0 ? (
                                dividas.map((divida, index) => (
                                    <div className="entity-data-row" key={divida.id || index}>
                                        <div className="entity-data-info">
                                            <span className="entity-row-dot" style={{ backgroundColor: "#912824" }}></span>
                                            <span className="entity-data-label">{divida.label}</span>
                                        </div>
                                        <strong className="entity-data-value">
                                            {Number(divida.value).toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL"
                                            })}
                                        </strong>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state-box">
                                    <p>Nenhuma dívida registrada no mês atual.</p>
                                    <Link to="/cadastrar_divida" className="empty-action-link">
                                        + Cadastrar um financiamento ou dívida
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

                <AdBanner slot="debts-footer-slot" format="horizontal" />
            </main>
        </div>
    );
}

export default Debt;