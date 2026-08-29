import React, { useState, useEffect } from "react";
import think from "../services/thinking.js";
import { Navbar } from "../components/controlNavBar.jsx";
import { AdBanner } from "../components/adBanner.jsx";
import { Link } from "react-router-dom";
import { 
  Sliders, 
  Sparkles, 
  TrendingDown, 
  XCircle, 
  ShieldAlert, 
  BrainCircuit, 
  MoreVertical,
  ArrowRight
} from "lucide-react";
import "../styles/thinking.css";

export function Thinking() {
    const [loading, setLoading] = useState(true);
    const [pensamentos, setPensamentos] = useState([]);
    const [reducoes, setReducoes] = useState([]);
    const [exclusoes, setExclusoes] = useState([]);
    const [menuAberto, setMenuAberto] = useState(null);

    const getPensamentos = (data) => {
        if (data?.pensamentos && Array.isArray(data.pensamentos)) {
            setPensamentos(data.pensamentos);
        } else {
            setPensamentos([
                "Considere cortar despesas supérfluas no início de cada mês.",
                "Pequenos gastos diários acumulam grandes valores ao longo de um ano.",
                "Automatize seus investimentos assim que sua renda cair na conta."
            ]);
        }
    };

    const getReducoes = (data) => {
        if (data?.reducoes && Array.isArray(data.reducoes)) {
            setReducoes(data.reducoes);
        } else {
            setReducoes([]);
        }
    };

    const getExclusoes = (data) => {
        if (data?.exclusoes && Array.isArray(data.exclusoes)) {
            setExclusoes(data.exclusoes);
        } else {
            setExclusoes([]);
        }
    };

    const bloquearItem = async (gastoId, excluir) => {
        try {
            await think.createPreferences({
                externalId: gastoId,
                exclude: excluir,
                reduce: !excluir,
                block: false
            });
            alert("Preferencia cadastrada com sucesso!");
            setMenuAberto(null);
            showIndicators();
        } catch (error) {
            console.error("Erro ao bloquear item:", error);
            alert("Erro ao salvar preferência.");
        }
    };

    const showIndicators = async () => {
        try {
            const response = await think.getMeasures();
            const data = response?.data || response;
            getPensamentos(data);
            getReducoes(data);
            getExclusoes(data);
        } catch (error) {
            console.error("Erro ao obter indicadores:", error);
            getPensamentos({});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        showIndicators();
    }, []);

    return (
        <div className="thinking-page">
            <Navbar>
                <Link to="/gerenciar_preferencias" className="head_button head_button--highlight">
                    <Sliders size={16} />
                    <span>Gerenciar Preferências</span>
                </Link>
            </Navbar>

            <main className="thinking-main-container">
                <div className="entity-header-row">
                    <div className="entity-title-group">
                        <div className="entity-icon-badge">
                            <BrainCircuit size={22} />
                        </div>
                        <div>
                            <h1 className="entity-main-title">Pensando & Sugestões</h1>
                            <p className="entity-subtitle">Insights inteligentes e otimizações personalizadas para suas finanças</p>
                        </div>
                    </div>
                </div>

                <div className="thinking-split-grid">
                    {/* COLUNA ESQUERDA: PENSADOR (VisualIdentity Page 14) */}
                    <aside className="thinking-thinker-card">
                        <div className="thinker-header">
                            <Sparkles size={20} className="thinker-sparkle" />
                            <h2 className="thinker-title">Pensador</h2>
                        </div>
                        <p className="thinker-subtitle">Reflexões e orientações para sua disciplina financeira:</p>

                        <div className="thinker-quotes-list">
                            {loading ? (
                                <div className="thinker-loading">
                                    <div className="spinner"></div>
                                    <p>Consultando o pensador...</p>
                                </div>
                            ) : pensamentos.length === 0 ? (
                                <p className="thinker-empty">Nenhum pensamento registrado hoje.</p>
                            ) : (
                                pensamentos.map((pensamento, index) => (
                                    <div className="thinker-quote-bubble" key={index}>
                                        <span className="quote-number">#{index + 1}</span>
                                        <p className="quote-text">"{pensamento}"</p>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="thinker-card-footer">
                            <span className="footer-label">Pensamento do dia ativo</span>
                        </div>
                    </aside>

                    {/* COLUNA DIREITA: SUGESTÕES DE REDUÇÃO E EXCLUSÃO (VisualIdentity Page 14) */}
                    <section className="thinking-suggestions-panel">
                        {/* BLOCO REDUZIR */}
                        <div className="suggestion-category-box">
                            <div className="category-box-header">
                                <div className="category-title-row">
                                    <TrendingDown size={20} className="icon-reduce" />
                                    <h3 className="category-box-title">Oportunidades de Redução</h3>
                                </div>
                                <span className="category-count-badge">{reducoes.length} sugestões</span>
                            </div>

                            <div className="suggestions-cards-list">
                                {reducoes.length === 0 ? (
                                    <p className="no-suggestions-text">Nenhuma sugestão de redução no momento.</p>
                                ) : (
                                    reducoes.map((item) => (
                                        <article className="suggestion-item-row" key={item.gastoId}>
                                            <div className="suggestion-item-info">
                                                <strong className="suggestion-item-name">{item.nome}</strong>
                                                <div className="suggestion-values-flow">
                                                    <span className="val-current">
                                                        R$ {item.valorAtual?.toFixed(2)}
                                                    </span>
                                                    <ArrowRight size={14} className="val-arrow" />
                                                    <strong className="val-suggested val-suggested--reduce">
                                                        R$ {item.valorSugerido?.toFixed(2)}
                                                    </strong>
                                                </div>
                                            </div>

                                            <div className="suggestion-action-anchor">
                                                <button
                                                    type="button"
                                                    className="suggestion-menu-btn"
                                                    onClick={() => setMenuAberto(menuAberto === item.gastoId ? null : item.gastoId)}
                                                    aria-label="Opções"
                                                >
                                                    <MoreVertical size={18} />
                                                </button>

                                                {menuAberto === item.gastoId && (
                                                    <div className="suggestion-dropdown-menu">
                                                        <button
                                                            type="button"
                                                            className="dropdown-action-btn"
                                                            onClick={() => bloquearItem(item.gastoId, false)}
                                                        >
                                                            <ShieldAlert size={15} />
                                                            <span>Bloquear Sugestão</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </article>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* BLOCO EXCLUIR */}
                        <div className="suggestion-category-box">
                            <div className="category-box-header">
                                <div className="category-title-row">
                                    <XCircle size={20} className="icon-exclude" />
                                    <h3 className="category-box-title">Sugestões de Extinção / Corte</h3>
                                </div>
                                <span className="category-count-badge">{exclusoes.length} sugestões</span>
                            </div>

                            <div className="suggestions-cards-list">
                                {exclusoes.length === 0 ? (
                                    <p className="no-suggestions-text">Nenhuma sugestão de extinção no momento.</p>
                                ) : (
                                    exclusoes.map((item) => (
                                        <article className="suggestion-item-row" key={item.gastoId}>
                                            <div className="suggestion-item-info">
                                                <strong className="suggestion-item-name">{item.nome}</strong>
                                                <div className="suggestion-values-flow">
                                                    <span className="val-current">
                                                        R$ {item.valorAtual?.toFixed(2)}
                                                    </span>
                                                    <ArrowRight size={14} className="val-arrow" />
                                                    <strong className="val-suggested val-suggested--exclude">
                                                        R$ 0,00
                                                    </strong>
                                                </div>
                                            </div>

                                            <div className="suggestion-action-anchor">
                                                <button
                                                    type="button"
                                                    className="suggestion-menu-btn"
                                                    onClick={() => setMenuAberto(menuAberto === item.gastoId ? null : item.gastoId)}
                                                    aria-label="Opções"
                                                >
                                                    <MoreVertical size={18} />
                                                </button>

                                                {menuAberto === item.gastoId && (
                                                    <div className="suggestion-dropdown-menu">
                                                        <button
                                                            type="button"
                                                            className="dropdown-action-btn"
                                                            onClick={() => bloquearItem(item.gastoId, true)}
                                                        >
                                                            <ShieldAlert size={15} />
                                                            <span>Bloquear Sugestão</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </article>
                                    ))
                                )}
                            </div>
                        </div>
                    </section>
                </div>

                <AdBanner slot="thinking-footer-slot" format="horizontal" />
            </main>
        </div>
    );
}

export default Thinking;