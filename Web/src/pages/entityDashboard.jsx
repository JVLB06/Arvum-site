import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Plus, Wallet, CreditCard, TrendingUp, CircleDollarSign, Target } from 'lucide-react';
import { Navbar } from '../components/controlNavBar.jsx';
import { AdBanner } from '../components/adBanner.jsx';
import PieChart from '../components/pieGraph.jsx';
import ColumnChart from '../components/columnGraph.jsx';
import cadastrate from '../services/cadastrate.js';

const COLORS = ['#0F3B2E', '#D4A017', '#084C61', '#912824', '#B4641E', '#58508D', '#228B22', '#D2691E'];
const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const currency = value => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const dateKey = value => {
  if (!value) return '';
  const text = String(value);
  if (/^\d{4}-\d{2}/.test(text)) return text.slice(0, 7);
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};
const monthSeries = (records, dateField, valueField) => {
  const now = new Date();
  const rows = [];
  for (let offset = 11; offset >= 0; offset--) {
    const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    rows.push({ key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, label: `${MONTHS[d.getMonth()]}/${String(d.getFullYear()).slice(-2)}`, value: 0 });
  }
  const lookup = new Map(rows.map(row => [row.key, row]));
  records.forEach(item => { const row = lookup.get(dateKey(item[dateField])); if (row) row.value += Number(item[valueField] || 0); });
  return rows;
};
const configs = {
  renda: { title: 'Rendas & Entradas', subtitle: 'Acompanhe e gerencie seu dinheiro que entra', noun: 'renda', plural: 'rendas', singular: 'Renda', icon: Wallet, listTitle: 'Rendas ativas', getList: () => cadastrate.getRenda(), getView: () => cadastrate.getRendaView(), name: x => x.description || x.name || 'Renda sem nome', value: x => x.maxValue ?? x.minValue ?? 0, date: 'paymentDate', chartDate: 'paymentDate', chartValue: 'maxValue', monthlyTitle: 'Entradas por mês', empty: 'Nenhuma renda cadastrada.' },
  gasto: { title: 'Gastos & Despesas', subtitle: 'Organize e controle seus gastos do dia a dia', noun: 'gasto', plural: 'gastos', singular: 'Gasto', icon: CreditCard, listTitle: 'Gastos ativos', getList: () => cadastrate.getExpenses(), getView: () => cadastrate.getExpensesView(), name: x => x.description || 'Gasto sem descrição', value: x => x.maxValue ?? x.minValue ?? 0, date: 'dueDate', chartDate: 'month', chartValue: 'totalExpenses', monthlyTitle: 'Despesas por mês', empty: 'Nenhum gasto cadastrado.' },
  investimento: { title: 'Investimentos', subtitle: 'Veja o valor aplicado e o que já recebeu dos seus investimentos', noun: 'investimento', plural: 'investimentos', singular: 'Investimento', icon: TrendingUp, listTitle: 'Investimentos ativos', getList: () => cadastrate.getActiveInvestments(), getView: () => cadastrate.getActiveInvestmentsView(), name: x => x.name || x.description || 'Investimento sem nome', value: x => x.value ?? 0, listValue: x => x.receivedValue ?? x.value ?? 0, date: 'initialDate', chartDate: 'initialDate', chartValue: 'value', monthlyTitle: 'Valor aplicado por mês de início', empty: 'Nenhum investimento ativo.' },
  divida: { title: 'Dívidas', subtitle: 'Acompanhe suas dívidas e o que já pagou', noun: 'divida', plural: 'dívidas', singular: 'Dívida', icon: CircleDollarSign, listTitle: 'Dívidas ativas', getList: () => cadastrate.getDebts(), getView: () => cadastrate.getDebtsView(), name: x => x.name || x.description || 'Dívida sem nome', value: x => x.value ?? 0, date: 'initialDate', chartDate: 'initialDate', chartValue: 'value', monthlyTitle: 'Dívidas e pagamentos por mês', empty: 'Nenhuma dívida ativa.' },
  meta: { title: 'Metas & Conquistas', subtitle: 'Acompanhe o progresso dos seus objetivos', noun: 'meta', plural: 'metas', singular: 'Meta', icon: Target, listTitle: 'Metas ativas', getList: () => cadastrate.getGoals(), getView: () => cadastrate.getGoalsView(), name: x => x.description || 'Meta sem descrição', value: x => x.value ?? 0, date: 'goalDate', chartDate: 'goalDate', chartValue: 'value', monthlyTitle: 'Valor das metas por mês', empty: 'Nenhuma meta ativa.' },
};

export default function EntityDashboard({ type }) {
  const config = configs[type];
  const Icon = config.icon;
  const [records, setRecords] = useState([]);
  const [view, setView] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    Promise.all([config.getList(), config.getView()]).then(([list, viewRows]) => {
      if (!alive) return;
      setRecords(Array.isArray(list) ? list : []);
      setView(Array.isArray(viewRows) ? viewRows : []);
    }).catch(error => {
      console.error(`Erro ao carregar ${config.plural}:`, error);
      if (alive) { setRecords([]); setView([]); }
    }).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [type]);

  const list = records.map((item, index) => ({ ...item, _name: config.name(item), _value: Number(config.value(item) || 0), _listValue: Number(config.listValue ? config.listValue(item) : config.value(item) || 0), _id: item.id ?? item.receiptId ?? index }));
  const pieData = list.map((item, index) => ({ label: item._name, value: item._value, color: COLORS[index % COLORS.length] }));
  const visibleList = list;
  const total = visibleList.reduce((sum, item) => sum + (type === 'meta' ? Number(item.goalPaid ?? item._value) : item._listValue), 0);

  let monthly;
  let chartSeries = [];
  if (type === 'gasto') {
    const rows = monthSeries(view, 'month', 'totalExpenses');
    const byKey = new Map(view.map(item => [dateKey(item.month), item]));
    monthly = rows.map(row => ({ ...row, value: Number(byKey.get(row.key)?.totalExpenses || 0), limit: Number(byKey.get(row.key)?.expensesLimit || 0), income: Number(byKey.get(row.key)?.totalIncomes || 0) }));
    chartSeries = [{ key: 'value', label: 'Despesas', type: 'bar', color: '#0F3B2E' }, { key: 'limit', label: 'Limite mensal', type: 'line', color: '#D4A017' }, { key: 'income', label: 'Rendas', type: 'line', color: '#084C61' }];
  } else if (type === 'renda') {
    monthly = monthSeries(view, 'paymentDate', 'maxValue');
  } else if (type === 'investimento') {
    monthly = monthSeries(view, 'initialDate', 'receivedValue');
  } else if (type === 'divida') {
    const paidById = new Map(view.map(item => [String(item.id), Number(item.debtPaid || 0)]));
    const rows = list.map(item => ({ ...item, debtPaid: paidById.get(String(item.id)) || 0 }));
    monthly = monthSeries(rows, 'initialDate', 'value');
    const paidRows = monthSeries(rows, 'initialDate', 'debtPaid');
    monthly = monthly.map((row, i) => ({ ...row, paid: paidRows[i].value }));
    chartSeries = [{ key: 'value', label: 'Valor das dívidas', type: 'bar', color: '#0F3B2E' }, { key: 'paid', label: 'Total pago por mês', type: 'line', color: '#D4A017' }];
  } else {
    monthly = monthSeries(records, 'goalDate', 'value');
  }

  return <div className="entity-page">
    <Navbar>
      <Link to={`/atualizar_${config.noun}`} className="head_button" title={`Gerenciar ${config.plural}`}><Pencil size={16} /><span>Gerenciar</span></Link>
      <Link to={`/cadastrar_${config.noun}`} className="head_button head_button--highlight" title={`Nova ${config.singular}`}><Plus size={18} /><span>Nova {config.singular}</span></Link>
    </Navbar>
    <main className="entity-main">
      <div className="entity-header-row"><div className="entity-title-group"><div className="entity-icon-badge"><Icon size={22} /></div><div><h1 className="entity-main-title">{config.title}</h1><p className="entity-subtitle">{config.subtitle}</p></div></div></div>
      <div className="entity-upper-grid">
        <section className="entity-card entity-list-card">
          <div className="card-header-bar"><h2 className="card-section-title">{config.listTitle}</h2><span className="card-badge-total">{currency(total)}</span></div>
          <div className="entity-items-list">
            {loading ? <p className="loading-text">Carregando {config.plural}...</p> : visibleList.length ? visibleList.map(item => <div className="entity-data-row" key={item._id}>
              <div className="entity-data-info"><span className="entity-row-dot"></span><span className="entity-data-label">{item._name}{type === 'meta' ? ` · ${Math.max(0, Math.min(100, Number(item.progress || 0)))}%` : ''}{type === 'investimento' && Number(item.interest || 0) ? ` · Juros: ${Number(item.interest)}%` : ''}</span></div>
              <strong className="entity-data-value">{currency(type === 'meta' ? item.goalPaid ?? item._value : item._listValue)}</strong>
            </div>) : <div className="empty-state-box"><p>{config.empty}</p><Link to={`/cadastrar_${config.noun}`} className="empty-action-link">+ Cadastrar {config.singular.toLowerCase()}</Link></div>}
          </div>
        </section>
        <section className="entity-pie-card"><PieChart dataItems={pieData} /></section>
      </div>
      {type === 'meta' && list.length > 0 && <section className="entity-card goals-progress-section"><div className="card-header-bar"><h2 className="card-section-title">Progresso das metas ativas</h2></div><div className="goals-progress-list">{list.map(item => { const progress = Math.max(0, Math.min(100, Number(item.progress || 0))); return <div className="goal-progress-row" key={item._id}><span className="goal-progress-name">{item._name}</span><div className="goal-progress-bar-container"><div className="goal-progress-bar-fill" style={{ width: `${progress}%` }} /></div><span className="goal-progress-percent">{progress}%</span></div>; })}</div></section>}
      <section className="entity-column-card">
        {type === 'investimento' && <p className="entity-subtitle">Valores agrupados por mês de início do investimento. Não é um histórico de saldo.</p>}
        {type === 'divida' && <p className="entity-subtitle">Valores agrupados por mês de início; o total pago vem dos seus pagamentos.</p>}
        <ColumnChart dataItems={monthly} title={config.monthlyTitle} legendLabel="Valor mensal" series={chartSeries} />
      </section>
      <AdBanner slot={`${type}-footer-slot`} format="horizontal" />
    </main>
  </div>;
}
