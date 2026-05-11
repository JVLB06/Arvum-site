import { useState, useEffect } from "react";
import think from "../services/thinking.js";
import { Navbar } from "../components/controlNavBar.jsx";
import { Link } from "react-router-dom";
import "../styles/thinking.css";

export function Thinking() {

    const [loading, setLoading] = useState(true);

    const [pensamentos, setPensamentos] = useState([]);
    const [reducoes, setReducoes] = useState([]);
    const [exclusoes, setExclusoes] = useState([]);

    /*
    =========================================
    FRASES
    =========================================
    */

    const getPensamentos = (data) => {

        if (data.pensamentos && Array.isArray(data.pensamentos)) {

            setPensamentos(data.pensamentos);

        } else {

            setPensamentos([]);
        }
    };

    /*
    =========================================
    REDUÇÕES
    =========================================
    */

    const getReducoes = (data) => {

        if (data.reducoes && Array.isArray(data.reducoes)) {
            setReducoes(data.reducoes);
        } else {
            setReducoes([]);
        }
    };

    /*
    =========================================
    EXCLUSÕES
    =========================================
    */

    const getExclusoes = (data) => {

        if (data.exclusoes && Array.isArray(data.exclusoes)) {
            setExclusoes(data.exclusoes);
        } else {
            setExclusoes([]);
        }
    };

    /*
    =========================================
    CARREGAR INDICADORES
    =========================================
    */

    const showIndicators = async () => {

        try {

            const response = await think.getMeasures();

            const data = response.data;

            getPensamentos(data);
            getReducoes(data);
            getExclusoes(data);

        } catch (error) {

            console.error("Erro ao obter indicadores:", error);

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        showIndicators();

    }, []);

    if (loading) {
        return <h1>Carregando...</h1>;
    }

    return (

        <div className="main">

            <Navbar>

                <Link>
                    <button className="head_button">
                        Add Preferencia
                    </button>
                </Link>

                <Link>
                    <button className="head_button">
                        Update Preferencia
                    </button>
                </Link>

            </Navbar>

            <div className="structure">

                {/* ========================================= */}
                {/* PENSADOR */}
                {/* ========================================= */}

                <div className="pensador">

                    <h2>Pensador:</h2>

                    <div className="pensamentos">

                        {
                            pensamentos.map((pensamento, index) => (
                                <div
                                    className="pensamento_item"
                                    key={index}
                                >
                                    {pensamento}
                                </div>
                            ))
                        }

                    </div>

                </div>

                {/* ========================================= */}
                {/* SUGESTÕES */}
                {/* ========================================= */}

                <div className="sugestoes">

                    {/* ========================================= */}
                    {/* REDUÇÕES */}
                    {/* ========================================= */}

                    <div className="reducao">

                        <h2>Reduzir:</h2>

                        <div className="lista_reducao">

                            {
                                reducoes.map((item) => (

                                    <div
                                        className="sugestao_item"
                                        key={item.gastoId}
                                    >

                                        <div className="nome">
                                            {item.nome}
                                        </div>

                                        <div className="valor">

                                            R$ {item.valorAtual?.toFixed(2)}
                                            {" -> "}
                                            R$ {item.valorSugerido?.toFixed(2)}

                                        </div>

                                    </div>
                                ))
                            }

                        </div>

                    </div>

                    {/* ========================================= */}
                    {/* EXCLUSÕES */}
                    {/* ========================================= */}

                    <div className="exclusao">

                        <h2>Excluir:</h2>

                        <div className="lista_exclusao">

                            {
                                exclusoes.map((item) => (

                                    <div
                                        className="sugestao_item"
                                        key={item.gastoId}
                                    >

                                        <div className="nome">
                                            {item.nome}
                                        </div>

                                        <div className="valor">

                                            R$ {item.valorAtual?.toFixed(2)}
                                            {" -> "}
                                            R$ 0,00

                                        </div>

                                    </div>
                                ))
                            }

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}