import { useState, useEffect } from "react";
import think from "../services/thinking.js";
import { Navbar } from "../components/controlNavBar.jsx";
import { Link } from "react-router-dom";
import "../styles/thinking.css";

export function Thinking() {
    const [loading, setLoading] = useState(true);
    const [preferencias, setPreferencias] = useState(null);
    const [medidas, setMedidas] = useState([]);

    const showIndicators = () => {
        think.getMesures(1).then((response) => {
            setMedidas(response.data);
            setLoading(false);
        }).catch((error) => {
            console.error("Erro ao obter medidas:", error);
            setLoading(false);
        });
    };

    useEffect(() => {
        showIndicators();
    }, []);

    return (
        <div className="main">
            <Navbar>
                <Link>
                    <button className="head_button">Add Preferencia</button>
                </Link>
                <Link>
                    <button className="head_button">Update Preferencia</button>
                </Link>
            </Navbar>
            <div className="structure">
                <div className="pensador">
                    <h2>Pensador:</h2>
                </div>
                <div className="sugestoes">
                    <div className="reducao">
                        <h2>Reduzir:</h2>
                    </div>
                    <div className="exclusao">
                        <h2>Excluir:</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}