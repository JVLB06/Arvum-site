import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import "../styles/backButtonHeader.css";

export function BackButtonHeader({ title, onBack }) {
    const navigate = useNavigate();

    function handleBack() {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    }

    return (
        <header className="back-header-container">
            <button
                className="back-header-btn"
                onClick={handleBack}
                type="button"
                aria-label="Voltar"
                title="Voltar à página anterior"
            >
                <ChevronLeft size={24} />
            </button>

            <h1 className="back-header-title">
                {title}
            </h1>
        </header>
    );
}

export default BackButtonHeader;