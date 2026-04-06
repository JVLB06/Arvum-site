import { useState, useEffect } from "react";
import expenses from "../services/extract.js";
import PieChart from "../components/pieGraph.jsx"; 
import { Navbar } from "../components/navBar.jsx";
import { Link } from 'react-router-dom';
import "../styles/dashboard.css";

export function Dashboard() {
    const [dadosGrafico, setDadosGrafico] = useState([]);
    const [loading, setLoading] = useState(true);

    const carregarDadosDashboard = async () => {
        try {
            setLoading(true);

            // Disparamos todas as consultas simultaneamente
            const [renda, investimentos, dividas, metas, gastos] = await Promise.all([
                expenses.getRenda(),
                expenses.getActiveInvestments(),
                expenses.getDebts(),
                expenses.getGoals(),
                expenses.getExpenses()
            ]);

            // Montamos o array no formato esperado pelo PieChart
            const formatadoParaGrafico = [
                { label: 'Renda', value: renda.data.valor, color: 'rgb(11, 61, 46)' },
                { label: 'Investimento', value: investimentos.data.valor, color: 'rgb(8, 76, 97)' },
                { label: 'Dívida', value: dividas.data.valor, color: 'rgb(145, 40, 36)' },
                { label: 'Metas', value: metas.data.valor, color: 'rgb(201, 162, 39)' },
                { label: 'Gasto', value: gastos.data.valor, color: 'rgb(180, 100, 30)' },
            ];

            setDadosGrafico(formatadoParaGrafico);
        } catch (error) {
            console.error("Erro ao consolidar dados do dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarDadosDashboard();
    }, []);

    return (
        <div className="main">
            <Navbar>
                
                <Link to="/extrato">
                    <button className="head_button"><strong>Extrato</strong></button>
                </Link>
                <Link to="/renda">
                    <button className="head_button"><strong>Renda</strong></button>
                </Link>
                <Link to="/gastos">
                    <button className="head_button"><strong>Gastos</strong></button>
                </Link>
                <Link to="/investimentos">
                    <button className="head_button"><strong>Investimentos</strong></button>
                </Link>
                <Link to="/metas">
                    <button className="head_button"><strong>Metas</strong></button>
                </Link>
                <Link to="/dividas">
                    <button className="head_button"><strong>Dividas</strong></button>
                </Link>
                <Link to="/perfil">
                    <button className="head_button"><strong>Perfil</strong></button>      
                </Link>   
            </Navbar>
            <div className="corpo">
                <main>
                    {loading ? (
                        <p>Carregando gráfico...</p>
                    ) : (
                        <PieChart dataItems={dadosGrafico} />
                    )}
                </main>
                <div className="funcoes">
                    <div className="opcoes">
                        <div className="option">
                            <Link to="/cadastrar_renda">
                                <button><span>Incluir nova renda</span></button>
                            </Link>
                        </div>
                        <div className="option">
                            <Link to="/cadastrar_gasto">
                                <button><span>Incluir novo gasto</span></button>
                            </Link>
                        </div>
                        <div className="option">
                            <Link to="/cadastrar_investimento">
                                <button><span>Incluir novo investimento</span></button>
                            </Link>
                        </div>
                        <div className="option">
                            <Link to="/cadastrar_meta">
                                <button><span>Incluir nova meta</span></button>
                            </Link>
                        </div>
                        <div className="option">
                            <Link to="/cadastrar_divida">
                                <button><span>Incluir nova dívida</span></button>
                            </Link>
                        </div>
                        <div className="option">
                            <Link to="/cadastrar_extrato">
                                <button><span>Incluir novo lançamento</span></button>
                            </Link>
                        </div>
                        <h2>Frase do pensador:</h2>
                    </div>
                    <div className="pensador">
                        <h3><em>Frase</em> - Autor</h3>
                    </div>
                </div>
            </div>        
            <footer>
                <div className="sugest">
                    <h3>Nos dê sugestões</h3>
                </div>
                <div className="redes_sociais">
                    <h3>Siga nossas redes sociais</h3>
                </div>
                <div className="sla">
                    <h3>E eu sei lá</h3>
                </div>
            </footer>
        </div>
    );
}