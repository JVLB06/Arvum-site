import { useNavigate } from "react-router-dom";
import "../styles/backButtonHeader.css";

export function BackButtonHeader({ title, onBack }) {
    const navigate = useNavigate();

    function handleBack() {
        if (onBack) {
            onBack(); // permite comportamento customizado
        } else {
            navigate(-1); // volta uma página no histórico
        }
    }

    return (
        <div className="header">
            <button
                className="back-button"
                onClick={handleBack}
                type="button"
            >
                &lt;
            </button>

            <h1>
                <strong>{title}</strong>
            </h1>
        </div>
    );
}