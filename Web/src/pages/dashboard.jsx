import { useState } from "react";
import { PieChart } from "../components/pieGraph.jsx"; 
import accounts from "../services/auth.js";
import { Navbar } from "../components/navBar.jsx";
import { Link } from 'react-router-dom';
import "../styles/dashboard.css";

export function Cadastrate() {

    const dadosGrafico = [
        { label: 'Renda', value: 5000, color: 'rgb(11, 61, 46)' },
        { label: 'Gasto', value: 2500, color: 'rgb(201, 162, 39)' },
        { label: 'Investimento', value: 1000, color: 'rgb(8, 76, 97)' },
        { label: 'Dívida', value: 500, color: 'rgb(145, 40, 36)' },
        ];

    return (
        <div className="main">
            <Navbar>
                
                <Link to="extrato">
                    <button class="head_button"><strong>Extrato</strong></button>
                </Link>
                <Link to="renda">
                    <button class="head_button"><strong>Renda</strong></button>
                </Link>
                <Link to="gastos">
                    <button class="head_button"><strong>Gastos</strong></button>
                </Link>
                <Link to="investimentos">
                    <button class="head_button"><strong>Investimentos</strong></button>
                </Link>
                <Link to="metas">
                    <button class="head_button"><strong>Metas</strong></button>
                </Link>
                <Link to="perfil">
                    <button class="head_button"><strong>Perfil</strong></button>      
                </Link>   
            </Navbar>
            <div class="corpo">
                <main>
                    <PieChart dataitems={dadosGrafico} />
                </main>
                <div class="funcoes">
                    <div class="opcoes">
                        <div class="option">
                            <Link to="cadastrar_renda">
                                <button><span>Incluir nova renda</span></button>
                            </Link>
                        </div>
                        <div class="option">
                            <Link to="cadastrar_gasto">
                                <button><span>Incluir novo gasto</span></button>
                            </Link>
                        </div>
                        <div class="option">
                            <Link to="cadastrar_investimento">
                                <button><span>Incluir novo investimento</span></button>
                            </Link>
                        </div>
                        <div class="option">
                            <Link to="cadastrar_meta">
                                <button><span>Incluir nova meta</span></button>
                            </Link>
                        </div>
                        <div class="option">
                            <Link to="cadastrar_extrato">
                                <button><span>Incluir novo lançamento</span></button>
                            </Link>
                        </div>
                        <h2>Frase do pensador:</h2>
                    </div>
                    <div class="pensador">
                        <h3><em>Frase</em> - Autor</h3>
                    </div>
                </div>
            </div>        
            <footer>
                <div class="sugest">
                    <h3>Nos dê sugestões</h3>
                </div>
                <div class="redes_sociais">
                    <h3>Siga nossas redes sociais</h3>
                </div>
                <div class="sla">
                    <h3>E eu sei lá</h3>
                </div>
            </footer>
        </div>
    );
}