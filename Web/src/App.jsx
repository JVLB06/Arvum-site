import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/home.jsx";
import { Login } from "./pages/login.jsx";
import { Cadastrate } from "./pages/cadastrate.jsx";
import { Dashboard } from "./pages/dashboard.jsx";
import { CadastrateReceipt } from "./pages/cadastrate_receipt.jsx";
import { CadastrateInvestmento } from "./pages/cadastrate_investment.jsx";
import { CadastrateGoal } from "./pages/cadastrate_goal.jsx";
import { CadastrateDebt } from "./pages/cadastrate_debt.jsx";
import { CadastrateExpenses } from "./pages/cadastrate_expenses.jsx";
import { Receipt } from "./pages/receipt.jsx";
import { Expenses } from "./pages/expenses.jsx";

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
          <Dashboard />
        </ProtectedRoute>}/>
        <Route path="/cadastrar_renda" element={<ProtectedRoute>
          <CadastrateReceipt />
        </ProtectedRoute>}/>
        <Route path="/cadastrar_investimento" element={<ProtectedRoute>
          <CadastrateInvestmento />
        </ProtectedRoute>}/>
        <Route path="/cadastrar_meta" element={<ProtectedRoute>
          <CadastrateGoal />
        </ProtectedRoute>}/>
        <Route path="/cadastrar_divida" element={<ProtectedRoute>
          <CadastrateDebt />
        </ProtectedRoute>}/>
        <Route path="/cadastrar_gasto" element={<ProtectedRoute>
          <CadastrateExpenses />
        </ProtectedRoute>}/>
        <Route path="/renda" element={<ProtectedRoute>
          <Receipt />
        </ProtectedRoute>}/>
        <Route path="/gastos" element={<ProtectedRoute>
          <Expenses />
        </ProtectedRoute>}/>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}