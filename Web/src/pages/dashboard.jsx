import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import expenses from "../services/extract.js";
import PieChart from "../components/pieGraph.jsx"; 
import { getTranslatedQuote } from '../services/phrase.js';
import accounts from "../services/auth.js";
import { Navbar } from "../components/navBar.jsx";
import { AdBanner } from "../components/adBanner.jsx";
import { 
  PlusCircle, 
  FileText, 
  Wallet, 
  CreditCard, 
  TrendingUp, 
  Target, 
  Sparkles, 
  LogOut,
  UserCheck,
  CircleDollarSign
} from "lucide-react";
import "../styles/dashboard.css";

export function Dashboard() {
    const [dados, setDados] = useState({ content: "Carregando pensamento...", author: "" });
    const [dadosGrafico, setDadosGrafico] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const carregarDadosDashboard = async () => {
        try {
            setLoading(true);

            const [renda, investimentos, dividas, metas, gastos] = await Promise.all([
                expenses.getRenda(),
                expenses.getActiveInvestments(),
                expenses.getDebts(),
                expenses.getGoals(),
                expenses.getExpenses()
            ]);

            const listaRenda = Array.isArray(renda) ? renda : [];
            const listaInvest = Array.isArray(investimentos) ? investimentos : [];
            const listaDividas = Array.isArray(dividas) ? dividas : [];
            const listaMetas = Array.isArray(metas) ? metas : [];
            const listaGastos = Array.isArray(gastos) ? gastos : [];

            const totalRenda = listaRenda.reduce((acc, item) => acc + Number(item.valor || item.minValue || item.vlr_min || 0), 0);
            const totalInvest = listaInvest.reduce((acc, item) => acc + Number(item.valor || item.value || item.vlr || 0), 0);
            const totalDividas = listaDividas.reduce((acc, item) => acc + Number(item.valor || item.value || item.vlr || 0), 0);
            const totalMetas = listaMetas.reduce((acc, item) => acc + Number(item.valor || item.value || item.vlr || 0), 0);
            const totalGastos = listaGastos.reduce((acc, item) => acc + Number(item.valor || item.minValue || item.vlr_min || 0), 0);

            const formatadoParaGrafico = [
                { label: 'Renda', value: totalRenda, color: '#0F3B2E' },
                { label: 'Investimento', value: totalInvest, color: '#084C61' },
                { label: 'Dívida', value: totalDividas, color: '#912824' },
                { label: 'Metas', value: totalMetas, color: '#D4A017' },
                { label: 'Gasto', value: totalGastos, color: '#B4641E' },
            ];

            setDadosGrafico(formatadoParaGrafico);
        } catch (error) {
            console.error("Erro ao consolidar dados do dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    const signOut = () => {
        accounts.logout();
        navigate("/login");
    };

    useEffect(() => {
        carregarDadosDashboard();
        const buscarDados = async () => {
            const resultado = await getTranslatedQuote();
            setDados(resultado);
        };
        buscarDados();
    }, []);

    return (
        <div className="dashboard-page">
            <Navbar>
                <Link to="/extrato" className="head_button">
                    <FileText size={16} />
                    <span>Extrato</span>
                </Link>
                <Link to="/renda" className="head_button">
                    <Wallet size={16} />
                    <span>Renda</span>
                </Link>
                <Link to="/gastos" className="head_button">
                    <CreditCard size={16} />
                    <span>Gastos</span>
                </Link>
                <Link to="/investimentos" className="head_button">
                    <TrendingUp size={16} />
                    <span>Investimentos</span>
                </Link>
                <Link to="/metas" className="head_button">
                    <Target size={16} />
                    <span>Metas</span>
                </Link>
                <Link to="/dividas" className="head_button">
                    <CircleDollarSign size={16} />
                    <span>Dívidas</span>
                </Link>
                <Link to="/pensando" className="head_button">
                    <UserCheck size={16} />
                    <span>Pensando</span>      
                </Link>
                <button className="head_button head_button--danger" onClick={signOut}>
                    <LogOut size={16} />
                    <span>Sair</span>
                </button>
            </Navbar>

            <main className="dashboard-content">
                <div className="dashboard-grid">
                    {/* COLUNA ESQUERDA: Gráfico Geral */}
                    <section className="dashboard-chart-section">
                        <div className="dashboard-section-header">
                            <h2 className="dashboard-section-title">Um pensamento pro dia</h2>
                            <p className="dashboard-section-subtitle">Visão consolidada de todas as suas categorias financeiras</p>
                        </div>

                        {loading ? (
                            <div className="dashboard-loading-card">
                                <div className="spinner"></div>
                                <p>Consolidando suas informações financeiras...</p>
                            </div>
                        ) : (
                            <PieChart dataItems={dadosGrafico} />
                        )}

                        {/* Anúncio AdSense Integrado */}
                        <AdBanner slot="dashboard-primary-slot" format="horizontal" />
                    </section>

                    {/* COLUNA DIREITA: Ações Rápidas + Pensador */}
                    <aside className="dashboard-actions-panel">
                        <h3 className="actions-panel-title">Ações Rápidas</h3>
                        <p className="actions-panel-subtitle">Inclua novos registros no seu plano financeiro</p>

                        <div className="quick-actions-list">
                            <Link to="/cadastrar_renda" className="quick-action-btn">
                                <PlusCircle size={20} />
                                <span>Incluir nova renda</span>
                            </Link>
                            
                            <Link to="/cadastrar_gasto" className="quick-action-btn">
                                <PlusCircle size={20} />
                                <span>Incluir novo gasto</span>
                            </Link>
                            
                            <Link to="/cadastrar_investimento" className="quick-action-btn">
                                <PlusCircle size={20} />
                                <span>Incluir novo investimento</span>
                            </Link>
                            
                            <Link to="/cadastrar_meta" className="quick-action-btn">
                                <PlusCircle size={20} />
                                <span>Incluir nova meta</span>
                            </Link>

                            <Link to="/cadastrar_divida" className="quick-action-btn">
                                <PlusCircle size={20} />
                                <span>Incluir nova dívida</span>
                            </Link>
                            
                            <Link to="/novo_lcto" className="quick-action-btn quick-action-btn--highlight">
                                <PlusCircle size={20} />
                                <span>Incluir novo lançamento</span>
                            </Link>
                        </div>

                        {/* BLOCO DO PENSADOR */}
                        <div className="thinker-quote-box">
                            <div className="thinker-quote-header">
                                <Sparkles size={16} />
                                <span>Opinião do pensador:</span>
                            </div>
                            <blockquote className="thinker-quote-text">
                                "{dados.content}"
                            </blockquote>
                            {dados.author && (
                                <span className="thinker-quote-author">— {dados.author}</span>
                            )}
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;