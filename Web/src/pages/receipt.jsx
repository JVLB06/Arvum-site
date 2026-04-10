import { useState, useEffect } from "react";
import expenses from "../services/extract.js";
import PieChart from "../components/pieGraph.jsx";
import ColumnChart from "../components/columnGraph.jsx";
import { Navbar } from "../components/controlNavBar.jsx";
import { Link } from "react-router-dom";
import "../styles/receipt.css";

export function Receipt() {
    const [rendas, setRendas] = useState([]);
    const [dadosGraficoPie, setDadosGraficoPie] = useState([]);
    const [dadosGraficoCol, setDadosGraficoCol] = useState([]);
    const [loading, setLoading] = useState(true);

    const CORES = [
        "rgb(11, 61, 46)",
        "rgb(8, 76, 97)",
        "rgb(145, 40, 36)",
        "rgb(201, 162, 39)",
        "rgb(180, 100, 30)",
        "rgb(88, 80, 141)",
        "rgb(34, 139, 34)",
        "rgb(210, 105, 30)"
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
        const agrupado = {};

        listaRendas.forEach((item) => {
            if (!item.data) return;

            const dataItem = new Date(item.data);
            const chaveMes = `${dataItem.getFullYear()}-${String(dataItem.getMonth() + 1).padStart(2, "0")}`;
            const valor = item.valorPagamento;

            if (!agrupado[chaveMes]) {
                agrupado[chaveMes] = 0;
            }

            agrupado[chaveMes] += valor;
        });

        return Object.entries(agrupado)
            .sort(([mesA], [mesB]) => mesA.localeCompare(mesB))
            .map(([mes, total], index) => ({
                label: mes,
                value: total,
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

    return (
        <div className="main">
            <Navbar>
                <Link to="/extrato">
                    <button className="head_button">
                        <strong>Edit Renda</strong>
                    </button>
                </Link>
                <Link to="/renda_add">
                    <button className="head_button">
                        <strong>Add Renda</strong>
                    </button>
                </Link>
            </Navbar>

            <div className="structure">
                <div className="corpo">
                    <div className="rendas">
                        <h1>Totais de rendas no mês atual</h1>
                        <h2>
                            <span>Nome</span> Valor
                        </h2>

                        {loading ? (
                            <p>Carregando rendas...</p>
                        ) : rendas.length > 0 ? (
                            rendas.map((renda, index) => (
                                <div className="renda-item" key={renda.id || index}>
                                    <span>{renda.label}</span>
                                    <strong>
                                        {Number(renda.value).toLocaleString("pt-BR", {
                                            style: "currency",
                                            currency: "BRL"
                                        })}
                                    </strong>
                                </div>
                            ))
                        ) : (
                            <p>Nenhuma renda encontrada no mês atual.</p>
                        )}
                    </div>

                    <div className="grafico-container">
                        <PieChart dataItems={dadosGraficoPie} />
                    </div>
                </div>

                <div className="colum-graphic">
                    <ColumnChart dataItems={dadosGraficoCol} />
                </div>
            </div>
        </div>
    );
}