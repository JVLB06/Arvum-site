import { useState, useEffect } from "react";
import think from "../services/thinking.js";
import { Navbar } from "../components/controlNavBar.jsx";
import { Link } from "react-router-dom";
import "../styles/preferences_management.css";

export function Preferences() {
    const [loading, setLoading] = useState(true);
    const [preferencias, setPreferencias] = useState(true);

    const getPreferencias = (data) => {

        if (data && Array.isArray(data)) {

            setPreferencias(data);

        } else {

            setPreferencias([]);
        }

    useEffect(() => {

        try {

            const response = await think.getPreferences();

            const data = response.data;

            getPreferencias(data);
        
        } catch (error) {

            console.error("Erro ao obter preferências:", error);

        } finally {

            setLoading(false);
        }

    }, []);
    
    };

    const excluirPreferencia = async (preferenciaId) => {

        try {

            await think.deletePreferences({
                id: preferenciaId
            });

            alert("Item excluído com sucesso");

        } catch (error) {

            console.error("Erro ao bloquear item:", error);

            alert("Erro ao bloquear item");
        }
    };

    return (
        <div className="main">
            <Navbar></Navbar>

            <div className="structure">
                <div className="preference-container">
                    <table className="preference-table">
                        {/* Cabeçalho Geral da Tabela */}
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Bloqueado p/ Redução</th>
                                <th>Bloqueado p/ Exclusão</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        
                        {/* Corpo da Tabela com a Lista */}
                        <tbody>
                            {preferencias.map((item) => (
                                <tr className="preferencia_item" key={item.IdPreferencia}>
                                    <td className="nome">
                                        {item.GastoNome}
                                    </td>
                                    
                                    {/* Validação Booleana usando Ternário */}
                                    <td className="reducao">
                                        {item.Reduzir ? "❌ Bloqueado" : "✅ Liberado"}
                                    </td>
                                    
                                    <td className="exclusao">
                                        {item.Excluir ? "❌ Bloqueado" : "✅ Liberado"}
                                    </td>
                                    
                                    {/* Botão de Excluir com onClick */}
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