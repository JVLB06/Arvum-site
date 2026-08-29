import React, { useEffect, useMemo, useState } from 'react';
import { BackButtonHeader } from "../components/backButtonHeader.jsx";
import { AdBanner } from "../components/adBanner.jsx";
import {
  BadgeDollarSign,
  CalendarDays,
  PiggyBank,
  Save,
  Wallet,
  CreditCard,
  TrendingUp,
  Target,
  CircleDollarSign,
  CheckCircle2
} from 'lucide-react';
import expenses from "../services/extract.js";
import cadastrate from "../services/cadastrate.js";
import "../styles/create_entry.css";

const MODEL_MAPPERS = {
  renda: (item) => ({
    id: item.id || item.receiptId,
    nome: item.name || item.descricao || item.nome,
    valor: item.minValue || item.vlr_min || 0,
    data: item.paymentDate ? item.paymentDate.split('T')[0] : item.data ? item.data.split('T')[0] : '',
  }),
  gasto: (item) => ({
    id: item.id,
    nome: item.description || item.descricao || item.nome,
    valor: item.minValue || item.vlr_min || 0,
    data: item.dueDate ? item.dueDate.split('T')[0] : item.data_init ? item.data_init.split('T')[0] : '',
  }),
  investimento: (item) => ({
    id: item.id,
    nome: item.description || item.descricao || item.nome,
    valor: item.value || item.vlr || 0,
    data: item.initialDate ? item.initialDate.split('T')[0] : item.data_init ? item.data_init.split('T')[0] : '',
  }),
  divida: (item) => ({
    id: item.id,
    nome: item.name || item.description || item.descricao || item.nome,
    valor: item.value || item.vlr || 0,
    data: item.initialDate ? item.initialDate.split('T')[0] : item.initDate ? item.initDate.split('T')[0] : item.data_init ? item.data_init.split('T')[0] : '',
  }),
  meta: (item) => ({
    id: item.id,
    nome: item.description || item.descricao || item.nome,
    valor: item.value || item.vlr || 0,
    data: item.goalDate ? item.goalDate.split('T')[0] : item.data_init ? item.data_init.split('T')[0] : '',
  }),
};

const TIPOS = [
  { value: 'renda', label: 'Renda', icon: Wallet },
  { value: 'gasto', label: 'Gasto', icon: CreditCard },
  { value: 'investimento', label: 'Investimento', icon: TrendingUp },
  { value: 'divida', label: 'Dívida', icon: CircleDollarSign },
  { value: 'meta', label: 'Meta', icon: Target },
];

const INITIAL_FORM = {
  id: '',
  valor: '',
  data: '',
  descricao: '',
};

function formatCurrencyInput(value) {
  if (value === null || value === undefined) return '';
  return String(value);
}

export function CreateEntry() {
  const [tipoSelecionado, setTipoSelecionado] = useState('gasto');
  const [itemVinculo, setItemVinculo] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [modelos, setModelos] = useState([]);
  const [loadingModelos, setLoadingModelos] = useState(false);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const tipoAtivoConfig = useMemo(
    () => TIPOS.find((tipo) => tipo.value === tipoSelecionado) || null,
    [tipoSelecionado]
  );

  const resetSelectionAndForm = () => {
    setItemVinculo(null);
    setFormData(INITIAL_FORM);
    setErro('');
  };

  const handleTipoChange = (novoTipo) => {
    setTipoSelecionado(novoTipo);
    resetSelectionAndForm();
  };

  useEffect(() => {
    if (!tipoSelecionado) {
      setModelos([]);
      return;
    }

    let isMounted = true;

    async function loadModelos() {
      try {
        setLoadingModelos(true);
        setErro('');

        const fetchMethods = {
          renda: cadastrate.getRenda,
          gasto: cadastrate.getExpenses,
          investimento: cadastrate.getActiveInvestments,
          divida: cadastrate.getDebts,
          meta: cadastrate.getGoals,
        };

        const fetchData = fetchMethods[tipoSelecionado];
        if (!fetchData) return;

        const data = await fetchData();

        if (isMounted) {
          const list = Array.isArray(data) ? data : data?.items || [];
          const normalized = list.map(item => MODEL_MAPPERS[tipoSelecionado](item));
          setModelos(normalized);
        }
      } catch (error) {
        console.error("Erro ao carregar modelos:", error);
        if (isMounted) {
          setModelos([]);
          setErro('Não foi possível carregar os modelos desta categoria.');
        }
      } finally {
        if (isMounted) {
          setLoadingModelos(false);
        }
      }
    }

    loadModelos();

    return () => {
      isMounted = false;
    };
  }, [tipoSelecionado]);

  const handleSelectModelo = (modelo) => {
    setItemVinculo(modelo);
    setFormData({
      id: modelo.id || '',
      valor: formatCurrencyInput(modelo.valor),
      data: modelo.data || new Date().toISOString().split('T')[0],
      descricao: modelo.nome || '',
    });
    setErro('');
    setSucesso('');
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!itemVinculo || !tipoSelecionado) return;

    try {
      setSaving(true);
      setErro('');
      setSucesso('');

      const payload = {
        id: formData.id ? parseInt(formData.id) : undefined,
        name: formData.descricao,
        value: parseFloat(formData.valor),
        kind: tipoSelecionado,
        extractDate: formData.data,
        balance: 0,
        externalId: formData.id,
      };

      await expenses.createExpense(payload);
      setSucesso('Lançamento registrado com sucesso no extrato!');
      resetSelectionAndForm();
    } catch (error) {
      setErro('Não foi possível salvar o lançamento.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="entry-page">
      <BackButtonHeader title={<>Novo <span className="highlight">lançamento</span> no extrato</>} />

      <main className="entry-main-container">
        {/* SELEÇÃO DE CATEGORIAS */}
        <section className="entry-categories-card">
          <h2 className="entry-card-section-label">Selecione a Categoria</h2>

          <div className="category-pills-row">
            {TIPOS.map((tipo) => {
              const isActive = tipoSelecionado === tipo.value;
              const Icon = tipo.icon;

              return (
                <button
                  key={tipo.value}
                  type="button"
                  onClick={() => handleTipoChange(tipo.value)}
                  className={`category-pill-btn ${isActive ? 'category-pill-btn--active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{tipo.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* LAYOUT SPLIT: MODELOS À ESQUERDA, FORMULÁRIO À DIREITA */}
        <div className="entry-split-grid">
          {/* MODELOS DISPONÍVEIS */}
          <aside className="entry-card entry-models-card">
            <div className="models-header">
              <div>
                <h3 className="models-title">Modelos Cadastrados</h3>
                <p className="models-sub">Clique em um item para propagar ao formulário</p>
              </div>
              {tipoAtivoConfig && (
                <span className="models-category-tag">{tipoAtivoConfig.label}</span>
              )}
            </div>

            <div className="models-list-scroll">
              {loadingModelos ? (
                <div className="models-loading-state">
                  <div className="spinner"></div>
                  <p>Buscando modelos de {tipoAtivoConfig?.label}...</p>
                </div>
              ) : modelos.length === 0 ? (
                <div className="models-empty-state">
                  <p>Nenhum registro encontrado nesta categoria.</p>
                </div>
              ) : (
                modelos.map((modelo) => {
                  const ativo = itemVinculo?.id === modelo.id;
                  return (
                    <button
                      type="button"
                      key={modelo.id}
                      onClick={() => handleSelectModelo(modelo)}
                      className={`model-item-card ${ativo ? 'model-item-card--active' : ''}`}
                    >
                      <div className="model-item-top">
                        <strong className="model-item-name">{modelo.nome}</strong>
                        <span className="model-item-id">ID: #{modelo.id}</span>
                      </div>
                      <div className="model-item-meta">
                        <span className="model-item-meta-label">
                          <BadgeDollarSign size={15} />
                          Valor base
                        </span>
                        <strong className="model-item-val">
                          {Number(modelo.valor || 0).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </strong>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* FORMULÁRIO DE LANÇAMENTO */}
          <section className="entry-card entry-form-card">
            <div className="entry-form-header">
              <div>
                <h3 className="entry-form-title">O que aconteceu nesse dia?</h3>
                <p className="entry-form-sub">Confirme ou altere os valores para incluir na movimentação</p>
              </div>

              {itemVinculo ? (
                <span className="entry-selected-pill">
                  Vínculo: <strong>{itemVinculo.nome}</strong>
                </span>
              ) : (
                <span className="entry-unselected-pill">Selecione um modelo ao lado</span>
              )}
            </div>

            <form onSubmit={handleSubmit} className="crud-form">
              <div className="crud-grid-2col">
                <div className="crud-input-group">
                  <label htmlFor="entry_id">ID do vínculo</label>
                  <input
                    id="entry_id"
                    name="id"
                    value={formData.id}
                    readOnly
                    placeholder="Selecione um modelo"
                    disabled
                  />
                </div>

                <div className="crud-input-group">
                  <label htmlFor="entry_valor">Valor do lançamento:</label>
                  <div className="input-with-icon-right">
                    <input
                      id="entry_valor"
                      name="valor"
                      type="number"
                      step="0.01"
                      required
                      value={formData.valor}
                      onChange={handleInputChange}
                      placeholder="0,00"
                      disabled={!itemVinculo}
                    />
                    <PiggyBank size={18} className="icon-right" />
                  </div>
                </div>
              </div>

              <div className="crud-grid-2col">
                <div className="crud-input-group">
                  <label htmlFor="entry_data">Data da ocorrência:</label>
                  <div className="input-with-icon-right">
                    <input
                      id="entry_data"
                      name="data"
                      type="date"
                      required
                      value={formData.data}
                      onChange={handleInputChange}
                      disabled={!itemVinculo}
                    />
                    <CalendarDays size={18} className="icon-right" />
                  </div>
                </div>

                <div className="crud-input-group">
                  <label htmlFor="entry_descricao">Descrição / Histórico:</label>
                  <input
                    id="entry_descricao"
                    name="descricao"
                    type="text"
                    required
                    value={formData.descricao}
                    onChange={handleInputChange}
                    placeholder="Detalhes do lançamento"
                    disabled={!itemVinculo}
                  />
                </div>
              </div>

              {erro && <div className="crud-msg-box crud-msg--error">{erro}</div>}
              {sucesso && <div className="crud-msg-box crud-msg--success"><CheckCircle2 size={16} /> {sucesso}</div>}

              <button
                type="submit"
                disabled={!itemVinculo || saving}
                className="crud-submit-btn"
              >
                <Save size={18} />
                <span>{saving ? 'Salvando...' : 'Incluir Lançamento'}</span>
              </button>
            </form>
          </section>
        </div>

        <AdBanner slot="create-entry-footer-slot" format="horizontal" />
      </main>
    </div>
  );
}

export default CreateEntry;
