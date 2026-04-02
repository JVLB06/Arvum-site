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

    const carregaRendas = async () => {
        try {
            setLoading(true);

            const response = await expenses.getRenda();

            const listaRendas = Array.isArray(response.data)
                ? response.data
                : response.data?.rendas || [];

            setRendas(listaRendas);
        } catch (error) {
            console.error("Erro ao carregar rendas:", error);
        } finally {
            setLoading(false);
        }
    };

    const carregarDadosPie = async () => {
        try {
            const [renda, investimentos, dividas, metas, gastos] = await Promise.all([
                expenses.getRenda(),
                expenses.getActiveInvestments(),
                expenses.getDebts(),
                expenses.getGoals(),
                expenses.getExpenses()
            ]);

            const formatadoParaGrafico = [
                { label: "Renda", value: renda.data.valor, color: "rgb(11, 61, 46)" },
                { label: "Investimento", value: investimentos.data.valor, color: "rgb(8, 76, 97)" },
                { label: "Dívida", value: dividas.data.valor, color: "rgb(145, 40, 36)" },
                { label: "Metas", value: metas.data.valor, color: "rgb(201, 162, 39)" },
                { label: "Gasto", value: gastos.data.valor, color: "rgb(180, 100, 30)" },
            ];

            setDadosGraficoPie(formatadoParaGrafico);
        } catch (error) {
            console.error("Erro ao consolidar dados do gráfico de pizza:", error);
        }
    };

    const carregarDadosCol = async () => {
        try {
            const response = await expenses.getRenda();

            // ajuste conforme a estrutura real da API
            const listaRendas = Array.isArray(response.data)
                ? response.data
                : response.data?.rendas || [];

            const formatadoParaGrafico = listaRendas.map((item, index) => ({
                label: item.descricao || item.nome || `Renda ${index + 1}`,
                value: Number(item.valor || item.vlr_min || 0),
                color: "rgb(11, 61, 46)"
            }));

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
                    carregaRendas(),
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
                <Link to="/extrato">
                    <button className="head_button">
                        <strong>Edit Renda</strong>
                    </button>
                </Link>
                <Link to="/renda">
                    <button className="head_button">
                        <strong>Add Renda</strong>
                    </button>
                </Link>
            </Navbar>

            <div className="structure">
                <div className="corpo">
                    <div className="rendas">
                        <h1>Apresenta total de cada renda</h1>
                        <h2>
                            <span>Nome</span> Valor
                        </h2>

                        {loading ? (
                            <p>Carregando rendas...</p>
                        ) : rendas.length > 0 ? (
                            rendas.map((renda, index) => (
                                <div className="renda-item" key={renda.id || index}>
                                    <span>{renda.descricao || renda.nome}</span>
                                    <strong>
                                        {Number(renda.valor || renda.vlr_min || 0).toLocaleString("pt-BR", {
                                            style: "currency",
                                            currency: "BRL"
                                        })}
                                    </strong>
                                </div>
                            ))
                        ) : (
                            <p>Nenhuma renda cadastrada.</p>
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