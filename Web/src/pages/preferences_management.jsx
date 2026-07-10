import { useState, useEffect } from "react";
import think from "../services/thinking.js";
import { Navbar } from "../components/controlNavBar.jsx";
import { Link } from "react-router-dom";
import "../styles/preferences_management.css";

export function Preferences() {
    const [loading, setLoading] = useState(true);
    // Ajustado de true para [] para evitar que o .map quebre no primeiro render
    const [preferencias, setPreferencias] = useState([]); 

    // 1. Função isolada corretamente
    const getPreferencias = (data) => {
        if (data && Array.isArray(data)) {
            setPreferencias(data);
        } else {
            setPreferencias([]);
        }
    };

    // 2. useEffect corrigido com uma função async interna
    useEffect(() => {
        const carregarDados = async () => {
            try {
                const response = await think.getPreferences();
                const data = response.data;
                getPreferencias(data);
            } catch (error) {
                console.error("Erro ao obter preferências:", error);
            } finally {
                setLoading(false);
            }
        };

        carregarDados();
    }, []);

    const excluirPreferencia = async (preferenciaId) => {
        try {
            await think.deletePreferences(preferenciaId);
            alert("Item excluído com sucesso");
            // Dica: Seria bom chamar carregarDados() aqui para atualizar a tela após excluir!
        } catch (error) {
            console.error("Erro ao bloquear item:", error);
            alert("Erro ao bloquear item");
        }
    };

    // Renderização condicional para o estado de loading (boa prática)
    if (loading) {
        return <div className="main"><Navbar /><h2>Carregando preferências...</h2></div>;
    }

    return (
        <div className="main">
            <Navbar></Navbar>

            <div className="structure">
                <div className="preference-container">
                    <table className="preference-table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Bloqueado p/ Redução</th>
                                <th>Bloqueado p/ Exclusão</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {preferencias.map((item) => (
                                <tr className="preferencia_item" key={item.IdPreferencia}>
                                    <td className="nome">
                                        {item.GastoNome}
                                    </td>
                                    
                                    <td className="reducao">
                                        {item.Reduzir ? "❌ Bloqueado" : "✅ Liberado"}
                                    </td>
                                    
                                    <td className="exclusao">
                                        {item.Excluir ? "❌ Bloqueado" : "✅ Liberado"}
                                    </td>
                                    
                                    <td className="acoes">
                                        <button 
                                            className="btn-deletar"
                                            onClick={() => excluirPreferencia(item.IdPreferencia)}
                                            title="Cancelar tudo (Excluir)"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}