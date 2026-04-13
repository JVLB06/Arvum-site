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
import { Investment } from "./pages/investments.jsx";
import { Goal } from "./pages/goals.jsx";
import { Debt } from "./pages/debts.jsx";
import { CreateEntry } from "./pages/create_entry.jsx";
import { UpdateDebt } from "./pages/update_debt.jsx";
import { UpdateGoal } from "./pages/update_goal.jsx";
import { UpdateInvestment } from "./pages/update_investment.jsx";
import { UpdateReceipt } from "./pages/update_receipt.jsx";
import { UpdateExpenses } from "./pages/update_expenses.jsx";

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
        <Route path="/investimentos" element={<ProtectedRoute>
          <Investment />
        </ProtectedRoute>}/>
        <Route path="/metas" element={<ProtectedRoute>
          <Goal />
        </ProtectedRoute>}/>
        <Route path="/dividas" element={<ProtectedRoute>
          <Debt />
        </ProtectedRoute>}/>
        <Route path="/novo_lcto" element={<ProtectedRoute>
          <CreateEntry />
        </ProtectedRoute>}/>
        <Route path="/atualizar_divida" element={<ProtectedRoute>
          <UpdateDebt />
        </ProtectedRoute>}/>
        <Route path="/atualizar_meta" element={<ProtectedRoute>
          <UpdateGoal />
        </ProtectedRoute>}/>
        <Route path="/atualizar_investimento" element={<ProtectedRoute>
          <UpdateInvestment />
        </ProtectedRoute>}/>
        <Route path="/atualizar_renda" element={<ProtectedRoute>
          <UpdateReceipt />
        </ProtectedRoute>}/>
        <Route path="/atualizar_gasto" element={<ProtectedRoute>
          <UpdateExpenses />
        </ProtectedRoute>}/>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}