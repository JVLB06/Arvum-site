import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/home.jsx";
import { Login } from "./pages/login.jsx";
import { Cadastrate } from "./pages/cadastrate.jsx";

// O "Segurança" da rota
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Se não tem token, manda pro login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="cadastrate" element={<Cadastrate />} />
        <Route path="logged" element={<ProtectedRoute>

        </ProtectedRoute>}/>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}