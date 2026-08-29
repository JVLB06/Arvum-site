import React, { useState, useEffect } from "react";
import expenses from "../services/extract.js";
import PieChart from "../components/pieGraph.jsx";
import ColumnChart from "../components/columnGraph.jsx";
import { Navbar } from "../components/controlNavBar.jsx";
import { AdBanner } from "../components/adBanner.jsx";
import { Link } from "react-router-dom";
import { Pencil, Plus, Wallet, ArrowLeft } from "lucide-react";
import "../styles/receipt.css";

export function Receipt() {
    const [rendas, setRendas] = useState([]);
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

    function normalizarListaRendas(response) {
        return Array.isArray(response?.rendas) ? response.rendas : [];
    }

    function mapearRendaPagamento(item) {
        return {
            idPagamento: item.id_divida,
            data: item.data,
            historico: item.historico,
            valorPagamento: Number(item.vlr_pagamento || 0),
            rendaId: item.divida_item?.id_divida_item,
            rendaNome: item.divida_item?.nome || "Sem nome",
            rendaValorBase: Number(item.divida_item?.valor || 0),
            dataReferencia: item.divida_item?.data_init || null,
            saldoExtrato: Number(item.saldo_extrato || 0),
        };
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

    function agruparRendasMesAtualPorTipo(listaRendas) {
        const agrupado = {};
        listaRendas
            .filter((item) => ehMesAtual(item.data))
            .forEach((item) => {
                const idTipo = item.rendaId;
                const valor = item.valorPagamento;
                if (!agrupado[idTipo]) {
                    agrupado[idTipo] = {
                        id: idTipo,
                        label: item.rendaNome || `Renda ${idTipo}`,
                        value: 0
                    };
                }
                agrupado[idTipo].value += valor;
            });
        return Object.values(agrupado);
    }

    function agruparRendasTotalPorTipo(listaRendas) {
        const agrupado = {};
        listaRendas.forEach((item) => {
            const idTipo = item.rendaId;
            const valor = item.valorPagamento;
            if (!agrupado[idTipo]) {
                agrupado[idTipo] = {
                    id: idTipo,
                    label: item.rendaNome || `Renda ${idTipo}`,
                    value: 0
                };
            }
            agrupado[idTipo].value += valor;
        });
        return Object.values(agrupado);
    }

    function agruparRendasPorMes(listaRendas) {
        const mesesNomes = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
        const agrupado = {};

        mesesNomes.forEach((m) => { agrupado[m] = 0; });

        listaRendas.forEach((item) => {
            if (!item.data) return;
            const dataItem = new Date(item.data);
            if (!Number.isNaN(dataItem.getTime())) {
                const mesIdx = dataItem.getMonth();
                const nomeMes = mesesNomes[mesIdx];
                agrupado[nomeMes] = (agrupado[nomeMes] || 0) + Number(item.valorPagamento || 0);
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
            try {
                setLoading(true);
                const response = await expenses.obtainReceiptPayments();
                const listaBruta = normalizarListaRendas(response);
                const listaNormalizada = listaBruta.map(mapearRendaPagamento);

                const rendasMesAtual = agruparRendasMesAtualPorTipo(listaNormalizada);
                const rendasTotais = agruparRendasTotalPorTipo(listaNormalizada);
                const rendasPorMes = agruparRendasPorMes(listaNormalizada);

                setRendas(rendasMesAtual);
                setDadosGraficoPie(
                    rendasTotais.map((item, index) => ({
                        label: item.label,
                        value: item.value,
                        color: CORES[index % CORES.length]
                    }))
                );
                setDadosGraficoCol(rendasPorMes);
            } catch (error) {
                console.error("Erro ao carregar dashboard de rendas:", error);
                setRendas([]);
                setDadosGraficoPie([]);
                setDadosGraficoCol([]);
            } finally {
                setLoading(false);
            }
        }
        carregarTudo();
    }, []);

    const totalRendasMes = rendas.reduce((acc, r) => acc + Number(r.value || 0), 0);

    return (
        <div className="entity-page">
            <Navbar>
                <Link to="/atualizar_renda" className="head_button" title="Gerenciar e Editar Rendas">
                    <Pencil size={16} />
                    <span>Gerenciar</span>
                </Link>
                <Link to="/cadastrar_renda" className="head_button head_button--highlight" title="Cadastrar Nova Renda">
                    <Plus size={18} />
                    <span>Nova Renda</span>
                </Link>
            </Navbar>

            <main className="entity-main">
                <div className="entity-header-row">
                    <div className="entity-title-group">
                        <div className="entity-icon-badge">
                            <Wallet size={22} />
                        </div>
                        <div>
                            <h1 className="entity-main-title">Rendas & Entradas</h1>
                            <p className="entity-subtitle">Acompanhe e gerencie todas as suas fontes de receita</p>
                        </div>
                    </div>
                </div>

                {/* SEÇÃO SUPERIOR: LISTAGEM DO MÊS + GRÁFICO DE PIZZA */}
                <div className="entity-upper-grid">
                    <section className="entity-card entity-list-card">
                        <div className="card-header-bar">
                            <h2 className="card-section-title">Totais de rendas no mês atual</h2>
                            <span className="card-badge-total">
                                {totalRendasMes.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </span>
                        </div>

                        <div className="entity-items-list">
                            {loading ? (
                                <p className="loading-text">Carregando rendas...</p>
                            ) : rendas.length > 0 ? (
                                rendas.map((renda, index) => (
                                    <div className="entity-data-row" key={renda.id || index}>
                                        <div className="entity-data-info">
                                            <span className="entity-row-dot"></span>
                                            <span className="entity-data-label">{renda.label}</span>
                                        </div>
                                        <strong className="entity-data-value">
                                            {Number(renda.value).toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL"
                                            })}
                                        </strong>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state-box">
                                    <p>Nenhuma renda registrada no mês atual.</p>
                                    <Link to="/cadastrar_renda" className="empty-action-link">
                                        + Adicionar sua primeira renda
                                    </Link>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="entity-pie-card">
                        <PieChart dataItems={dadosGraficoPie} />
                    </section>
                </div>

                {/* SEÇÃO INFERIOR: GRÁFICO DE COLUNAS EVOLUÇÃO */}
                <section className="entity-column-card">
                    <ColumnChart dataItems={dadosGraficoCol} />
                </section>

                {/* ANÚNCIO ADSENSE */}
                <AdBanner slot="receipt-footer-slot" format="horizontal" />
            </main>
        </div>
    );
}

export default Receipt;