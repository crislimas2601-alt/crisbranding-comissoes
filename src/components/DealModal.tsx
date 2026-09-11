import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Sparkles, 
  Building, 
  DollarSign, 
  Percent, 
  Calendar, 
  Award,
  Check,
  AlertCircle
} from 'lucide-react';
import { ContractDeal, Installment, PropertyType } from '../types';
import { formatCurrency, generateInstallmentDates } from '../utils/formatters';

interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveDeal: (deal: ContractDeal) => void;
  dealToEdit?: ContractDeal | null;
}

export const DealModal: React.FC<DealModalProps> = ({
  isOpen,
  onClose,
  onSaveDeal,
  dealToEdit,
}) => {
  if (!isOpen) return null;

  // Basic Form State
  const [propertyTitle, setPropertyTitle] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('apartamento');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [developerOrAgency, setDeveloperOrAgency] = useState('');
  const [contractDate, setContractDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');

  // Financial values
  const [propertyValue, setPropertyValue] = useState<number>(500000);
  const [grossCommissionPercent, setGrossCommissionPercent] = useState<number>(5);
  const [brokerSplitPercent, setBrokerSplitPercent] = useState<number>(50);
  const [bonusAmount, setBonusAmount] = useState<number>(0);
  const [bonusDescription, setBonusDescription] = useState('');

  // Installments plan
  const [numInstallments, setNumInstallments] = useState<number>(2);
  const [firstDueDate, setFirstDueDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [installments, setInstallments] = useState<Installment[]>([]);

  // Calculated values
  const grossCommissionValue = (propertyValue * grossCommissionPercent) / 100;
  const brokerNetCommission = (grossCommissionValue * brokerSplitPercent) / 100;
  const totalBrokerReceivable = brokerNetCommission + bonusAmount;

  // Load existing deal if editing
  useEffect(() => {
    if (dealToEdit) {
      setPropertyTitle(dealToEdit.propertyTitle);
      setPropertyType(dealToEdit.propertyType);
      setClientName(dealToEdit.clientName);
      setClientPhone(dealToEdit.clientPhone || '');
      setDeveloperOrAgency(dealToEdit.developerOrAgency || '');
      setContractDate(dealToEdit.contractDate);
      setPropertyValue(dealToEdit.propertyValue);
      setGrossCommissionPercent(dealToEdit.grossCommissionPercent);
      setBrokerSplitPercent(dealToEdit.brokerSplitPercent);
      setBonusAmount(dealToEdit.bonusAmount);
      setBonusDescription(dealToEdit.bonusDescription || '');
      setNotes(dealToEdit.notes || '');
      setInstallments(dealToEdit.installments);
      setNumInstallments(dealToEdit.installments.filter(i => !i.isBonus).length || 1);
      if (dealToEdit.installments.length > 0) {
        setFirstDueDate(dealToEdit.installments[0].dueDate);
      }
    } else {
      // Initialize fresh new deal
      setPropertyTitle('');
      setPropertyType('apartamento');
      setClientName('');
      setClientPhone('');
      setDeveloperOrAgency('');
      setContractDate(new Date().toISOString().slice(0, 10));
      setPropertyValue(600000);
      setGrossCommissionPercent(5);
      setBrokerSplitPercent(50);
      setBonusAmount(0);
      setBonusDescription('');
      setNotes('');
      setNumInstallments(2);
      const today = new Date().toISOString().slice(0, 10);
      setFirstDueDate(today);
      generateFreshInstallments(2, 600000 * 0.05 * 0.5, 0, '', today);
    }
  }, [dealToEdit, isOpen]);

  // Regenerate installments based on count and total
  const generateFreshInstallments = (
    count: number,
    netComm: number,
    bonus: number,
    bonusDesc: string,
    startDate: string
  ) => {
    const dates = generateInstallmentDates(startDate, count);
    const amountPerInstallment = Math.round((netComm / count) * 100) / 100;

    const list: Installment[] = [];
    for (let i = 0; i < count; i++) {
      const isLast = i === count - 1;
      const installmentAmount = isLast
        ? netComm - amountPerInstallment * (count - 1)
        : amountPerInstallment;

      const title =
        count === 1
          ? 'Parcela Única - Escritura/Sinal'
          : i === 0
          ? '1ª Parcela - Ato / Sinal'
          : i === 1
          ? '2ª Parcela - Financiamento'
          : `${i + 1}ª Parcela`;

      list.push({
        id: `inst-${Date.now()}-${i + 1}`,
        dealId: dealToEdit?.id || 'temp',
        dealTitle: propertyTitle || 'Novo Imóvel',
        installmentNumber: i + 1,
        totalInstallments: count + (bonus > 0 ? 1 : 0),
        title,
        amount: Math.max(0, installmentAmount),
        dueDate: dates[i] || startDate,
        status: 'pendente',
      });
    }

    // Add bonus installment if any
    if (bonus > 0) {
      list.push({
        id: `inst-${Date.now()}-bonus`,
        dealId: dealToEdit?.id || 'temp',
        dealTitle: propertyTitle || 'Novo Imóvel',
        installmentNumber: count + 1,
        totalInstallments: count + 1,
        title: bonusDesc ? `Bônus: ${bonusDesc}` : 'Bônus / Premiação Construtora',
        amount: bonus,
        dueDate: dates[dates.length - 1] || startDate,
        status: 'pendente',
        isBonus: true,
      });
    }

    setInstallments(list);
  };

  const handleRecalculateInstallments = () => {
    generateFreshInstallments(
      numInstallments,
      brokerNetCommission,
      bonusAmount,
      bonusDescription,
      firstDueDate
    );
  };

  // Update specific installment
  const handleUpdateInstallment = (index: number, field: keyof Installment, value: any) => {
    const updated = [...installments];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setInstallments(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyTitle.trim()) {
      alert('Por favor, informe o nome ou identificação do imóvel.');
      return;
    }
    if (!clientName.trim()) {
      alert('Por favor, informe o nome do cliente/comprador.');
      return;
    }

    const dealId = dealToEdit ? dealToEdit.id : `deal-${Date.now()}`;

    // Adjust installments to include correct dealId and dealTitle
    const finalizedInstallments = installments.map((inst, idx) => ({
      ...inst,
      dealId,
      dealTitle: propertyTitle.trim(),
      installmentNumber: idx + 1,
      totalInstallments: installments.length,
    }));

    // Check status: if all installments are received, deal is completed
    const allReceived = finalizedInstallments.every((i) => i.status === 'recebido');

    const newDeal: ContractDeal = {
      id: dealId,
      propertyTitle: propertyTitle.trim(),
      propertyType,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim() || undefined,
      developerOrAgency: developerOrAgency.trim() || 'Autônomo',
      contractDate,
      propertyValue: Number(propertyValue) || 0,
      grossCommissionPercent: Number(grossCommissionPercent) || 0,
      grossCommissionValue,
      brokerSplitPercent: Number(brokerSplitPercent) || 0,
      brokerNetCommission,
      bonusAmount: Number(bonusAmount) || 0,
      bonusDescription: bonusDescription.trim() || undefined,
      totalBrokerReceivable,
      installments: finalizedInstallments,
      status: allReceived ? 'concluido' : 'em_andamento',
      notes: notes.trim() || undefined,
      createdAt: dealToEdit ? dealToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveDeal(newDeal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-6 shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-heading">
                {dealToEdit ? 'Editar Contrato de Venda' : 'Cadastrar Nova Venda'}
              </h2>
              <p className="text-xs text-slate-400">
                Preencha os dados da venda para atualizar seu fluxo de caixa e comissões
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-5 flex-1">
          
          {/* Section 1: Imóvel & Cliente */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
              1. Dados do Imóvel & Cliente
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome do Imóvel / Empreendimento *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Edifício Vision - Apto 904 ou Casa Condomínio"
                  value={propertyTitle}
                  onChange={(e) => setPropertyTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tipo de Imóvel
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="apartamento">Apartamento</option>
                  <option value="casa">Casa / Sobrado</option>
                  <option value="terreno">Terreno / Lote</option>
                  <option value="comercial">Comercial / Sala</option>
                  <option value="lancamento">Lançamento Planta</option>
                  <option value="rural">Chácara / Rural</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome do Cliente (Comprador) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo e Família"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Telefone / WhatsApp (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="(11) 99999-9999"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Origem / Parceria / Imobiliária
                </label>
                <input
                  type="text"
                  placeholder="Ex: Cyrela, Lopes ou Autônomo"
                  value={developerOrAgency}
                  onChange={(e) => setDeveloperOrAgency(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Valores & Cálculo de Comissão */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
              2. Valores & Divisão de Comissão
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Valor do Imóvel (VGV em R$) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  required
                  value={propertyValue}
                  onChange={(e) => setPropertyValue(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  {formatCurrency(propertyValue)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  % Comissão Total Bruta
                </label>
                <div className="flex items-center gap-1">
                  {[4, 5, 6].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setGrossCommissionPercent(p)}
                      className={`px-2 py-1.5 rounded text-xs font-bold cursor-pointer transition-colors ${
                        grossCommissionPercent === p
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {p}%
                    </button>
                  ))}
                  <input
                    type="number"
                    min="0.5"
                    max="30"
                    step="0.5"
                    value={grossCommissionPercent}
                    onChange={(e) => setGrossCommissionPercent(Number(e.target.value))}
                    className="w-16 px-2 py-1.5 border border-slate-200 rounded text-xs font-semibold text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-slate-500">%</span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Bruto: {formatCurrency(grossCommissionValue)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Seu Repasse de Corretor (%)
                </label>
                <div className="flex items-center gap-1">
                  {[50, 60, 100].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setBrokerSplitPercent(s)}
                      className={`px-2 py-1.5 rounded text-xs font-bold cursor-pointer transition-colors ${
                        brokerSplitPercent === s
                          ? 'bg-emerald-700 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {s === 100 ? '100% (Autônomo)' : `${s}%`}
                    </button>
                  ))}
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={brokerSplitPercent}
                    onChange={(e) => setBrokerSplitPercent(Number(e.target.value))}
                    className="w-14 px-2 py-1.5 border border-slate-200 rounded text-xs font-semibold text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Líquido: {formatCurrency(brokerNetCommission)}
                </span>
              </div>
            </div>

            {/* Bônus extra / Premiação da construtora */}
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-amber-900 mb-1 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  Bônus ou Premiação Extra (R$)
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  placeholder="0,00"
                  value={bonusAmount}
                  onChange={(e) => setBonusAmount(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-amber-200 rounded-lg text-xs sm:text-sm font-semibold text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-[11px] text-amber-700 block mt-0.5">
                  {bonusAmount > 0 ? formatCurrency(bonusAmount) : 'Opcional (prêmio de lançamento, etc.)'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-900 mb-1">
                  Descrição do Bônus / Campanha
                </label>
                <input
                  type="text"
                  placeholder="Ex: Prêmio Meta Semestral ou Campanha Sinal"
                  value={bonusDescription}
                  onChange={(e) => setBonusDescription(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-amber-200 rounded-lg text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Quick Result Highlight */}
            <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-blue-700 font-semibold block">
                  Total Final que Vai para o Seu Bolso:
                </span>
                <span className="text-xs text-slate-500">
                  Comissão Líquida ({formatCurrency(brokerNetCommission)}) + Bônus ({formatCurrency(bonusAmount)})
                </span>
              </div>
              <div className="text-xl font-black text-blue-900 font-heading">
                {formatCurrency(totalBrokerReceivable)}
              </div>
            </div>
          </div>

          {/* Section 3: Cronograma de Parcelas / Fluxo de Caixa */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />
                3. Cronograma de Recebíveis (Parcelas)
              </h3>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Dividir em:</span>
                {[1, 2, 3, 4, 6].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => {
                      setNumInstallments(n);
                      generateFreshInstallments(
                        n,
                        brokerNetCommission,
                        bonusAmount,
                        bonusDescription,
                        firstDueDate
                      );
                    }}
                    className={`px-2 py-1 rounded text-xs font-bold cursor-pointer transition-colors ${
                      numInstallments === n
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {n}x
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Data do 1º Vencimento / Sinal
                </label>
                <input
                  type="date"
                  value={firstDueDate}
                  onChange={(e) => {
                    setFirstDueDate(e.target.value);
                    generateFreshInstallments(
                      numInstallments,
                      brokerNetCommission,
                      bonusAmount,
                      bonusDescription,
                      e.target.value
                    );
                  }}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleRecalculateInstallments}
                  className="w-full px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Recalcular e Redistribuir Parcelas
                </button>
              </div>
            </div>

            {/* List of custom installments */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {installments.map((inst, idx) => (
                <div 
                  key={inst.id}
                  className={`p-2.5 rounded-lg border text-xs grid grid-cols-12 gap-2 items-center ${
                    inst.isBonus ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={inst.title}
                      onChange={(e) => handleUpdateInstallment(idx, 'title', e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium"
                      placeholder="Descrição da parcela"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="date"
                      value={inst.dueDate}
                      onChange={(e) => handleUpdateInstallment(idx, 'dueDate', e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      step="50"
                      value={inst.amount}
                      onChange={(e) => handleUpdateInstallment(idx, 'amount', Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-right"
                    />
                  </div>
                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        if (installments.length > 1) {
                          setInstallments(installments.filter((_, i) => i !== idx));
                        }
                      }}
                      className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                      title="Remover parcela"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Observações */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Observações Adicionais (Opcional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Condições de repasse, banco do financiamento, contato do correspondente..."
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              {dealToEdit ? 'Salvar Alterações' : 'Confirmar e Adicionar Venda'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
