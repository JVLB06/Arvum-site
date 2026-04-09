import React, { useEffect, useMemo, useState } from 'react';
import { BackButtonHeader } from "../components/backButtonHeader.jsx";
import "../styles/create_entry.css";
import {
  BadgeDollarSign,
  CalendarDays,
  PiggyBank,
  Save,} from 'lucide-react';

import expenses from "../services/extract.js";
import cadastrate from "../services/cadastrate.js";

const TIPOS = [
  {
    value: 'renda',
    label: 'Renda',
  },
  {
    value: 'gasto',
    label: 'Gasto',
  },
  {
    value: 'investimento',
    label: 'Investimento',
  },
  {
    value: 'divida',
    label: 'Dívida',
  },
  {
    value: 'meta',
    label: 'Meta',
  },
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
  const [tipoSelecionado, setTipoSelecionado] = useState(null);
  const [itemVinculo, setItemVinculo] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [modelos, setModelos] = useState([]);
  const [loadingModelos, setLoadingModelos] = useState(false);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState('');

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
        const data = await cadastrate.getRenda(tipoSelecionado);
        if (isMounted) {
          setModelos(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (isMounted) {
          setModelos([]);
          setErro('Não foi possível carregar os modelos dessa categoria.');
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

  /**
   * Propagação do modelo para o formulário.
   * ------------------------------------------------------------
   * Ao clicar em um item da lista da esquerda, o formulário da direita é
   * preenchido automaticamente com os dados base do modelo.
   *
   * O campo "id" não é digitado pelo usuário: ele é herdado do item
   * selecionado, como você pediu.
   */
  const handleSelectModelo = (modelo) => {
    setItemVinculo(modelo);
    setFormData({
      id: modelo.id || '',
      valor: formatCurrencyInput(modelo.vlr_min), // Use vlr_min ou vlr_max vindo do C#
      data: modelo.data ? modelo.data.split('T')[0] : '', // Formata a data ISO para YYYY-MM-DD
      descricao: modelo.descricao || '',
    });
    setErro('');
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

      const payload = {
        historico: formData.descricao,
        valor: formData.valor,
        tipo: tipoSelecionado,
        data: formData.data,
        id_ref: formData.id,
      };

      await expenses.createExpense(payload);

      // Após salvar, a tela volta para o estado inicial da categoria atual.
      resetSelectionAndForm();
    } catch (error) {
      setErro('Não foi possível salvar o lançamento.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">

        <BackButtonHeader title={<>Novo lançamento</>} />

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Categorias
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {TIPOS.map((tipo) => {
              const isActive = tipoSelecionado === tipo.value;

              return (
                <label
                  key={tipo.value}
                  className={[
                    'category-card flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-4 transition-all',
                    isActive ? 'category-card--active' : '',
                  ].join(' ')}
                >
                  <input
                    type="radio"
                    name="tipoSelecionado"
                    value={tipo.value}
                    checked={isActive}
                    onChange={() => handleTipoChange(tipo.value)}
                    className="sr-only"
                  />

                  <div>
                    <p className="text-sm font-semibold text-slate-900">{tipo.label}</p>
                    <p className="text-xs text-slate-500">Selecionar modelos</p>
                  </div>
                </label>
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Modelos</h2>
                <p className="text-sm text-slate-500">
                  {tipoSelecionado
                    ? 'Selecione um vínculo para preencher o formulário.'
                    : 'Escolha uma categoria para listar os modelos.'}
                </p>
              </div>

              {tipoAtivoConfig && (
                <div className="type-badge rounded-xl px-3 py-1 text-xs font-medium">
                  {tipoAtivoConfig.label}
                </div>
              )}
            </div>

            <div className="h-[460px] overflow-y-auto pr-1">
              {!tipoSelecionado && (
                <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                  Selecione uma categoria acima para carregar os modelos disponíveis.
                </div>
              )}

              {tipoSelecionado && loadingModelos && (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-24 animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
                    />
                  ))}
                </div>
              )}

              {tipoSelecionado && !loadingModelos && modelos.length === 0 && (
                <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                  Nenhum modelo encontrado para essa categoria.
                </div>
              )}

              {tipoSelecionado && !loadingModelos && modelos.length > 0 && (
                <div className="space-y-3">
                  {modelos.map((modelo) => {
                    const ativo = itemVinculo?.id === modelo.id;

                    return (
                      <button
                        type="button"
                        key={modelo.id}
                        onClick={() => handleSelectModelo(modelo)}
                        className={[
                          'template-card w-full rounded-2xl border p-4 text-left transition-all',
                          ativo ? 'template-card--active' : '',
                        ].join(' ')}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold">{modelo.descricao}</p>
                            <p className="template-card__description mt-1 text-sm">
                              {modelo.descricao || 'Sem descrição'}
                            </p>
                          </div>

                          <div className="template-card__id rounded-xl px-2 py-1 text-xs font-medium">
                            {modelo.id}
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="template-card__meta inline-flex items-center gap-2 text-sm">
                            <BadgeDollarSign size={16} />
                            Valor sugerido
                          </div>

                          <span className="template-card__value text-sm font-semibold">
                            {Number(modelo.vlr_min || 0).toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Formulário do lançamento</h2>
                <p className="text-sm text-slate-500">
                  Os dados do modelo selecionado são propagados automaticamente e podem ser editados.
                </p>
              </div>

              {itemVinculo ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  Modelo selecionado: <span className="font-semibold text-slate-900">{itemVinculo.nome}</span>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-sm text-slate-500">
                  Nenhum modelo selecionado
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="id" className="text-sm font-medium text-slate-700">
                    ID do vínculo
                  </label>
                  <input
                    id="id"
                    name="id"
                    value={formData.id}
                    readOnly
                    placeholder="Preenchido automaticamente"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-600 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="valor" className="text-sm font-medium text-slate-700">
                    Valor
                  </label>
                  <div className="relative">
                    <input
                      id="valor"
                      name="valor"
                      type="number"
                      step="0.01"
                      value={formData.valor}
                      onChange={handleInputChange}
                      placeholder="0,00"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 pr-12 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                    />
                    <PiggyBank size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="data" className="text-sm font-medium text-slate-700">
                    Data
                  </label>
                  <div className="relative">
                    <input
                      id="data"
                      name="data"
                      type="date"
                      value={formData.data}
                      onChange={handleInputChange}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 pr-12 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                    />
                    <CalendarDays size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="descricao" className="text-sm font-medium text-slate-700">
                    Descrição
                  </label>
                  <input
                    id="descricao"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    placeholder="Detalhes do lançamento"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                  />
                </div>
              </div>

              {erro && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {erro}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-500">
                  O botão salvar só é liberado após a seleção de um vínculo.
                </div>

                <button
                  type="submit"
                  disabled={!itemVinculo || saving}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <Save size={18} />
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
