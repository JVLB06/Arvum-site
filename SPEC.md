# Especificação Frontend - Arvum Site

## Visão Geral

Frontend desenvolvido em React (Vite) que consome a API REST do backend ERP Pessoal hospedado em um servidor Linux. A aplicação gerencia finanças pessoais com funcionalidades de CRUD para rendas, gastos, investimentos, dívidas, metas e lançamentos de extrato.

## Arquitetura

### Estrutura de Diretórios

```
Web/
├── src/
│   ├── pages/          # Componentes de página (rotas)
│   ├── components/     # Componentes reutilizáveis
│   ├── services/       # Camada de API (axios)
│   ├── styles/         # Estilos CSS
│   ├── main.jsx        # Ponto de entrada
│   └── App.jsx         # Roteamento
├── public/            # Assets estáticos
├── vite.config.js     # Configuração do Vite
└── package.json       # Dependências
```

### Camada de Serviços (Services)

#### **main.js** - Cliente HTTP
- Cria instância axios com base URL configurada (`https://adaptive-telephony-bikes-pressed.trycloudflare.com`)
- Injetar token JWT no header `Authorization: Bearer <token>`
- Intercepta resposta 401 e redireciona para login
- Suporta credenciais entre domínios (CORS)

#### **auth.js** - Autenticação
```javascript
// Endpoints
- login({ username, password })              // POST /contas/login
- cadastrate({ userName, password, birthDate, email })  // POST /contas/cadastro
- logout()                                    // Remove token e redireciona
- validate()                                  // GET /contas/verificar-conexao
```

**Mudanças recentes:** Confirmadas funcionalidades, endpoint de login está alinhado com backend.

#### **cadastrate.js** - Operações de Cadastro
Gerencia CRUD de: Rendas, Investimentos, Dívidas, Metas, Gastos

**Endpoints principais:**
```javascript
// Rendas
- getRenda()                                  // GET /user_plan/ler_renda
- createRenda(rendaData)                     // POST /user_plan/criar_renda
- updateRenda(rendaData)                     // PUT /user_plan/atualizar_renda
- deleteRenda(receiptId)                     // DELETE /user_plan/inativar_renda/{id}

// Investimentos
- getActiveInvestments()                     // GET /user_plan/ler_investimentos_ativos
- getInactiveInvestments()                   // GET /user_plan/ler_investimentos_encerrados
- createInvestment(investmentData)           // POST /user_plan/criar_investimento
- updateInvestment(investmentData)           // PUT /user_plan/atualizar_investimento
- deleteInvestment(investmentId)             // DELETE /user_plan/inativar_investimento/{id}
- concludeInvestment(investmentData)         // PUT /user_plan/concluir_investimento

// Dívidas
- getDebts()                                 // GET /user_plan/ler_dividas
- createDebt(debtData)                       // POST /user_plan/criar_divida
- updateDebt(debtData)                       // PUT /user_plan/atualizar_divida
- deleteDebt(debtId)                         // DELETE /user_plan/inativar_divida/{id}
- payDebt(debtId)                            // PUT /user_plan/pagar_divida/{id} [MUDANÇA]
- getFinishedDebts()                         // GET /user_plan/ler_dividas_quitadas

// Metas
- getGoals()                                 // GET /user_plan/ler_metas
- createGoal(goalData)                       // POST /user_plan/criar_meta
- updateGoal(goalData)                       // PUT /user_plan/atualizar_meta
- deleteGoal(goalId)                         // DELETE /user_plan/inativar_meta/{id}
- concludeGoal(goalId)                       // PUT /user_plan/concluir_meta/{id} [MUDANÇA]
- getFinishedGoals()                         // GET /user_plan/ler_metas_concluidas

// Gastos
- getExpenses()                              // GET /user_plan/ler_gastos
- createExpense(expenseData)                 // POST /user_plan/criar_gasto
- updateExpense(expenseData)                 // PUT /user_plan/atualizar_gasto
- deleteExpense(expenseId)                   // DELETE /user_plan/inativar_gasto/{id}
```

**Mudanças principais:**
- `payDebt()`: Agora recebe apenas `debtId` (passou de objeto para parâmetro de rota)
- `concludeGoal()`: Agora recebe apenas `goalId` (passou de objeto para parâmetro de rota)

#### **extract.js** - Lançamentos e Extrato
```javascript
// Extrato
- getExtract(dateIni, dateEnd)              // GET /extrato/ler_extrato (query params)

// Lançamentos
- createExpense(expenseData)                // POST /extrato/incluir_lancamento
- updateExpense(expenseData)                // PUT /extrato/atualizar_lancamento
- deleteExpense({ id, kind })               // DELETE /extrato/remover_lancamento

// Pagamentos por tipo
- obtainGoalPayments()                      // GET /extrato/obter_meta_pgto
- obtainExpensePayments()                   // GET /extrato/obter_gastos_pgto
- obtainDebtPayments()                      // GET /extrato/obter_divida_pgto
- obtainReceiptPayments()                   // GET /extrato/obter_renda_pgto
- obtainInvestmentPayments()                // GET /extrato/obter_investimento_pgto
```

**Mudanças principais:**
- `deleteExpense()`: Campo `tipo` renomeado para `kind` para corresponder a `ExtractDeleteModel`
- `createExpense()` e `updateExpense()`: Agora enviam campo `balance` (requerido pela API)

#### **thinking.js** - Preferências e Indicadores
```javascript
// Serviço "thinking"
- getMeasures()                             // GET /thinking/indicadores
- createPreferences(data)                   // POST /thinking/criar_preferencias
- getPreferences()                          // GET /thinking/ler_preferencias
- deletePreferences(preferenciaId)          // DELETE /thinking/deletar_preferencia/{id}
```

**Mudanças:** Sem alterações necessárias, endpoints estão alinhados.

### Estrutura de Dados (DTOs)

#### Renda (Receipt)
```javascript
{
  receiptId?: number,
  name: string,
  minValue: decimal,
  maxValue: decimal,
  paymentDate: DateTime
}
```

#### Investimento (Investment)
```javascript
{
  id: number,
  description: string,
  value: decimal,
  interest: decimal,
  initialDate: DateTime
}
```

#### Investimento Concluído (FinishInvestment)
```javascript
{
  id: number,
  receiveDate: DateTime,
  receivedValue: decimal
}
```

#### Dívida (Debt)
```javascript
{
  id?: number,
  description: string,
  value: decimal,
  endDate: DateTime,
  initDate: DateTime
}
```

#### Meta (Goal)
```javascript
{
  userId?: number,
  id?: number,
  description: string,
  value: decimal,
  goalDate: DateTime,
  progress: decimal
}
```

#### Gasto (Expense)
```javascript
{
  userId?: number,
  id?: number,
  description: string,
  minValue: decimal,
  maxValue: decimal,
  priority: number,
  dueDate: DateTime,
  isFixed: boolean
}
```

#### Lançamento (Extract)
```javascript
{
  id?: number,
  name: string,
  value: decimal,
  extractDate: DateTime,
  kind: string,        // 'renda', 'gasto', 'investimento', 'divida', 'meta'
  balance: decimal,
  externalId?: number
}
```

### Componentes de Página

#### Autenticação
- **login.jsx** - Login do usuário
- **cadastrate.jsx** - Cadastro de novo usuário

#### Gerenciamento de Recursos
- **cadastrate_receipt.jsx** - Criar renda
- **update_receipt.jsx** - Editar renda
- **cadastrate_expenses.jsx** - Criar gasto
- **update_expenses.jsx** - Editar gasto
- **cadastrate_investment.jsx** - Criar investimento
- **update_investment.jsx** - Editar investimento
- **cadastrate_debt.jsx** - Criar dívida
- **update_debt.jsx** - Editar dívida
- **cadastrate_goal.jsx** - Criar meta
- **update_goal.jsx** - Editar meta

#### Visualização de Dados
- **extract.jsx** - Extrato de lançamentos com filtro por data
- **debts.jsx** - Painel de dívidas
- **expenses.jsx** - Painel de gastos
- **investments.jsx** - Painel de investimentos
- **goals.jsx** - Painel de metas
- **receipt.jsx** - Painel de rendas
- **dashboard.jsx** - Dashboard principal
- **thinking.jsx** - Página de recomendações

#### Outros
- **preferences_management.jsx** - Gerenciar preferências
- **delete_preferences.jsx** - Deletar preferências
- **create_entry.jsx** - Criar lançamento manual

## Mudanças Implementadas (Sprint de Refatoração)

### 1. **cadastrate.js** - Correção de Rotas com Parâmetros

**Antes:**
```javascript
payDebt: async (payData) => {
  const response = await api.put('/user_plan/pagar_divida', payData);
  return response.data;
}
```

**Depois:**
```javascript
payDebt: async (debtId) => {
  const response = await api.put(`/user_plan/pagar_divida/${debtId}`);
  return response.data;
}
```

**Razão:** Backend espera ID como parâmetro de rota, não no corpo.

---

**Antes:**
```javascript
concludeGoal: async (concludeData) => {
  const response = await api.put('/user_plan/concluir_meta', concludeData);
  return response.data;
}
```

**Depois:**
```javascript
concludeGoal: async (goalId) => {
  const response = await api.put(`/user_plan/concluir_meta/${goalId}`);
  return response.data;
}
```

**Razão:** Backend espera ID como parâmetro de rota, não no corpo.

### 2. **extract.jsx** - Correção de Chamadas de API

**Problema 1:** Método não-existente
```javascript
// Antes
const response = await expenses.loadExtract({...})

// Depois
const response = await expenses.getExtract(startDate, endDate)
```

**Problema 2:** Nomes de campos errados (português → inglês)
```javascript
// Antes
openEditModal(item) {
  setEditForm({
    tipo: item.kind,
    historico: item.name,
    data: item.extractDate,
    valor: item.value,
  })
}

// Depois
openEditModal(item) {
  setEditForm({
    kind: item.kind,
    name: item.name,
    extractDate: item.extractDate,
    value: item.value,
  })
}
```

**Problema 3:** Campo `kind` vs `tipo`
```javascript
// Antes
await expenses.deleteExpense({
  id: item.id,
  tipo: item.kind,
})

// Depois
await expenses.deleteExpense({
  id: item.id,
  kind: item.kind,
})
```

**Problema 4:** Adição de campos obrigatórios
```javascript
// Antes
await expenses.updateExpense({
  id, tipo, historico, data, valor
})

// Depois
await expenses.updateExpense({
  id, name, value, kind, extractDate, balance
})
```

### 3. **create_entry.jsx** - Adição de Campos Requeridos

```javascript
// Antes
const payload = {
  name: formData.descricao,
  value: parseFloat(formData.valor),
  kind: tipoSelecionado,
  extractDate: formData.data,
  externalId: formData.id,
}

// Depois
const payload = {
  id: formData.id ? parseInt(formData.id) : undefined,
  name: formData.descricao,
  value: parseFloat(formData.valor),
  kind: tipoSelecionado,
  extractDate: formData.data,
  balance: 0,
  externalId: formData.id,
}
```

**Razão:** Backend requer campos `id` e `balance` no modelo `NewExtractModel`.

## Padrões de Código

### Normalização de Dados
Cada página de visualização/atualização normaliza dados da API para um formato consistente:
```javascript
function normalize[Tipo](item) {
  return {
    id: item?.id ?? "",
    nome/description: item?.name ?? item?.descricao ?? "",
    valor/value: item?.value ?? item?.vlr ?? 0,
    data_xxx: item?.dateField ?? item?.data_alternativa ?? "",
    // ... outros campos
  };
}
```

**Por quê:** API pode retornar diferentes nomes de campo dependendo da tabela; normalização garante consistência.

### Unwrapping de Payload
```javascript
function unwrapPayload(data, key) {
  return Array.isArray(data?.[key]) ? data[key] : [];
}
```

**Por quê:** API envolve arrays em chave (ex: `{ rendas: [...] }`) ou retorna array direto.

### Mapeamento de Tipos de Lançamento
```javascript
const MODEL_MAPPERS = {
  renda: (item) => ({ /* ... */ }),
  gasto: (item) => ({ /* ... */ }),
  investimento: (item) => ({ /* ... */ }),
  divida: (item) => ({ /* ... */ }),
  meta: (item) => ({ /* ... */ }),
}
```

**Por quê:** Diferentes tipos têm estruturas de dados levemente diferentes; mappers normalizam.

## Fluxo de Autenticação

1. Usuário faz login em `/login` com `username` e `password`
2. Backend retorna `{ token, ... }` no endpoint `/contas/login`
3. Frontend armazena token em `localStorage.setItem('token', response.data.token)`
4. Interceptor axios injeta token em todas requisições subsequentes
5. Se resposta for 401, token é removido e usuário é redirecionado para login

## Endpoints Críticos

### ✅ Endpoints Confirmados e Funcionando
- POST `/contas/login` - Login (endpoint de referência)
- POST `/contas/cadastro` - Registro
- GET `/contas/verificar-conexao` - Validação
- Todos endpoints de leitura (`GET /user_plan/ler_*`)
- Todos endpoints de criação (`POST /user_plan/criar_*`)
- Todos endpoints de atualização (`PUT /user_plan/atualizar_*`)
- Todos endpoints de delete (`DELETE /user_plan/inativar_*`)
- GET `/extrato/ler_extrato` - Extrato com filtro de data
- POST `/extrato/incluir_lancamento` - Criar lançamento
- PUT `/extrato/atualizar_lancamento` - Atualizar lançamento
- DELETE `/extrato/remover_lancamento` - Remover lançamento

### ⚠️ Endpoints Não Verificados em Backend
- GET `/user_plan/ler_investimentos_encerrados` - Investimentos inativos
- GET `/user_plan/ler_dividas_quitadas` - Dívidas pagas
- GET `/user_plan/ler_metas_concluidas` - Metas concluídas

**Nota:** Esses endpoints podem não existir no backend. Se a página tenta acessá-los, adicionar verificação de erro ou removê-los.

## Considerações de Segurança

1. **Token Storage:** Token armazenado em `localStorage` (vulnerável a XSS). Considerar usar HttpOnly cookies em produção.
2. **CORS:** Proxy reverso necessário (`https://adaptive-telephony-bikes-pressed.trycloudflare.com`) para evitar problemas de CORS.
3. **Credenciais:** Usadas em requisições de desenvolvimento; nunca adicionar credenciais hardcoded em produção.

## Troubleshooting

### "Erro ao realizar login"
- Verificar se username/password estão corretos
- Confirmar se endpoint `/contas/login` está acessível
- Checar se proxy reverso está ativo

### "404 ao carregar recursos"
- Endpoint não existe no backend
- Verificar spelling do endpoint em `services/cadastrate.js`
- Confirmar se rota está registrada no controller

### "Token expirado"
- Interceptor 401 redireciona automaticamente para login
- Verificar tempo de expiração do token no backend (`AuthHelper.cs`)

## Próximos Passos

1. **Testes:** Implementar testes unitários para services e normalizers
2. **Refatoração:** Consolidar lógica de normalização em hook customizado
3. **Performance:** Implementar cache para dados de cadastro (RTK Query, React Query)
4. **UI/UX:** Adicionar loading skeletons, error boundaries, retry logic
5. **Validação:** Adicionar validação de formulários no frontend antes de enviar
6. **Documentation:** Manter atualizado conforme novas mudanças na API

---

**Última atualização:** 2026-08-28  
**Status:** ✅ Alinhado com backend (após refatoração)
