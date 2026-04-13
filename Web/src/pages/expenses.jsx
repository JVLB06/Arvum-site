import { useState, useEffect } from "react";
import expenses from "../services/extract.js";
import PieChart from "../components/pieGraph.jsx";
import ColumnChart from "../components/columnGraph.jsx";
import { Navbar } from "../components/controlNavBar.jsx";
import { Link } from "react-router-dom";
import "../styles/expenses.css";

export function Expenses() {
    const [gastos, setGastos] = useState([]);
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

    function normalizarListaGastos(response) {
        return Array.isArray(response.data)
            ? response.data
            : response.data?.gastos || [];
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

    function agruparGastosMesAtualPorTipo(listaGastos) {
        const agrupado = {};

        listaGastos
            .filter((item) => ehMesAtual(item.data))
            .forEach((item) => {
                const idTipo = item.id_divida_item;
                const valor = Number(item.vlr_pagamento || 0);

                if (!agrupado[idTipo]) {
                    agrupado[idTipo] = {
                        id: idTipo,
                        label: item.nome || `Renda ${idTipo}`,
                        value: 0
                    };
                }

                agrupado[idTipo].value += valor;
            });

        return Object.values(agrupado);
    }

    function agruparGastosPorMes(listaGastos) {
        const agrupado = {};

        listaGastos.forEach((item) => {
            if (!item.data) return;

            const dataItem = new Date(item.data);
            const chaveMes = `${dataItem.getFullYear()}-${String(dataItem.getMonth() + 1).padStart(2, "0")}`;
            const valor = Number(item.vlr_pagamento || 0);

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

    const carregaGastos = async () => {
        try {
            setLoading(true);

            const response = await expenses.getGastos();
            const listaGastos = normalizarListaGastos(response);

            const gastosAgrupadas = agruparGastosMesAtualPorTipo(listaGastos);

            setGastos(gastosAgrupadas);
        } catch (error) {
            console.error("Erro ao carregar gastos:", error);
        } finally {
            setLoading(false);
        }
    };

    const carregarDadosPie = async () => {
        try {
            const response = await expenses.getGastos();
            const listaGastos = normalizarListaGastos(response);

            const gastosAgrupadas = agruparGastosMesAtualPorTipo(listaGastos);

            const formatadoParaGrafico = gastosAgrupadas.map((item, index) => ({
                label: item.label,
                value: item.value,
                color: CORES[index % CORES.length]
            }));

            setDadosGraficoPie(formatadoParaGrafico);
        } catch (error) {
            console.error("Erro ao consolidar dados do gráfico de pizza:", error);
        }
    };

    const carregarDadosCol = async () => {
        try {
            const response = await expenses.getGastos();
            const listaGastos = normalizarListaGastos(response);

            const formatadoParaGrafico = agruparGastosPorMes(listaGastos);

            setDadosGraficoCol(formatadoParaGrafico);
        } catch (error) {
            console.error("Erro ao consolidar dados do gráfico de colunas:", error);
        }
    };

    useEffect(() => {
        async function carregarTudo() {
            setLoading(true);
            try {
                await Promise.all([
                    carregaGastos(),
                    carregarDadosPie(),
                    carregarDadosCol()
                ]);
            } finally {
                setLoading(false);
            }
        }

        carregarTudo();
    }, []);

    return (
        <div className="main">
            <Navbar>
                <Link to="/atualizar_gasto">
                    <button className="head_button">
                        <strong>Edit Gasto</strong>
                    </button>
                </Link>
                <Link to="/cadastrar_gasto">
                    <button className="head_button">
                        <strong>+</strong>
                    </button>
                </Link>
            </Navbar>

            <div className="structure">
                <div className="corpo">
                    <div className="gastos">
                        <h1>Totais de gastos no mês atual</h1>
                        <h2>
                            <span>Nome</span> Valor
                        </h2>

                        {loading ? (
                            <p>Carregando gastos...</p>
                        ) : gastos.length > 0 ? (
                            gastos.map((renda, index) => (
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
                            <p>Nenhum gasto encontrado no mês atual.</p>
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