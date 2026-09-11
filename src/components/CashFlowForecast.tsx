import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  Sparkles,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MonthlyForecastItem, Installment } from '../types';
import { formatCurrency, formatCurrencyCompact, formatDateBR } from '../utils/formatters';

interface CashFlowForecastProps {
  forecast: MonthlyForecastItem[];
  onToggleInstallmentStatus: (dealId: string, installmentId: string) => void;
  onSelectMonthFilter?: (monthKey: string | null) => void;
  selectedMonthFilter?: string | null;
}

export const CashFlowForecast: React.FC<CashFlowForecastProps> = ({
  forecast,
  onToggleInstallmentStatus,
  onSelectMonthFilter,
  selectedMonthFilter,
}) => {
  const [activeTab, setActiveTab] = useState<'grafico' | 'meses'>('grafico');

  // Chart data format
  const chartData = forecast.map((item) => ({
    name: item.label,
    monthKey: item.monthKey,
    previsto: item.projectedAmount,
    recebido: item.receivedAmount,
    bonus: item.bonusAmount,
    total: item.totalVolume,
    isCurrent: item.isCurrentMonth,
  }));

  const handleMarkAsReceived = (dealId: string, installmentId: string) => {
    // Fire celebratory confetti
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10B981', '#3B82F6', '#F59E0B'],
    });
    onToggleInstallmentStatus(dealId, installmentId);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl text-xs border border-slate-700 min-w-[180px]">
          <div className="font-bold text-sm text-slate-100 mb-2 pb-1 border-b border-slate-800 flex items-center justify-between">
            <span>{label}</span>
            {data.isCurrent && (
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">Mês Atual</span>
            )}
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-blue-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                A Receber:
              </span>
              <span className="font-semibold">{formatCurrency(data.previsto)}</span>
            </div>
            <div className="flex justify-between items-center text-emerald-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Já Recebido:
              </span>
              <span className="font-semibold">{formatCurrency(data.recebido)}</span>
            </div>
            {data.bonus > 0 && (
              <div className="flex justify-between items-center text-amber-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                  Deste mês em Bônus:
                </span>
                <span className="font-semibold">{formatCurrency(data.bonus)}</span>
              </div>
            )}
            <div className="pt-1.5 mt-1 border-t border-slate-800 flex justify-between items-center font-bold text-slate-200">
              <span>Volume Total:</span>
              <span>{formatCurrency(data.total)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Card Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
              Previsão de Fluxo de Caixa (Entradas Futuras)
            </h2>
            <span className="hidden sm:inline-flex text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-100">
              Próximos Meses
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Visualize o montante previsto a receber em cada mês conforme as vendas e parcelas acordadas
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg self-start sm:self-auto text-xs font-medium text-slate-600">
          <button
            id="tab-chart-view"
            onClick={() => setActiveTab('grafico')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeTab === 'grafico'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Gráfico Mensal
          </button>
          <button
            id="tab-breakdown-view"
            onClick={() => setActiveTab('meses')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeTab === 'meses'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Detalhamento por Mês
          </button>
        </div>
      </div>

      {/* Selected Month Filter Banner */}
      {selectedMonthFilter && (
        <div className="bg-blue-50 px-4 py-2 border-b border-blue-100 flex items-center justify-between text-xs text-blue-800">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>
              Filtrando parcelas do mês: <strong>{forecast.find(f => f.monthKey === selectedMonthFilter)?.fullLabel || selectedMonthFilter}</strong>
            </span>
          </div>
          <button
            onClick={() => onSelectMonthFilter?.(null)}
            className="text-blue-700 hover:text-blue-900 underline font-semibold cursor-pointer"
          >
            Remover filtro
          </button>
        </div>
      )}

      {/* View Content */}
      <div className="p-4 sm:p-6">
        {activeTab === 'grafico' ? (
          <div>
            <div className="h-[280px] sm:h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  onClick={(e: any) => {
                    if (e && e.activePayload && e.activePayload[0]) {
                      const clickedMonthKey = e.activePayload[0].payload.monthKey;
                      onSelectMonthFilter?.(selectedMonthFilter === clickedMonthKey ? null : clickedMonthKey);
                    }
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tickFormatter={formatCurrencyCompact}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                  <Legend 
                    verticalAlign="top" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => (
                      <span className="text-xs font-semibold text-slate-700 capitalize">
                        {value === 'previsto' ? 'A Receber (Previsão)' : value === 'recebido' ? 'Já Recebido' : 'Bônus'}
                      </span>
                    )}
                  />
                  <Bar 
                    dataKey="previsto" 
                    name="previsto" 
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]} 
                    maxBarSize={44} 
                  />
                  <Bar 
                    dataKey="recebido" 
                    name="recebido" 
                    fill="#10b981" 
                    radius={[4, 4, 0, 0]} 
                    maxBarSize={44} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>Azul: Entrada prevista para o mês</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Verde: Comissões já creditadas</span>
                </div>
              </div>
              <span className="text-slate-400 italic">
                *Clique em uma barra para filtrar as parcelas do mês
              </span>
            </div>
          </div>
        ) : (
          /* Detailed Month-by-Month List */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forecast.map((month) => {
              const isSelected = selectedMonthFilter === month.monthKey;
              return (
                <div
                  key={month.monthKey}
                  className={`rounded-xl border p-4 transition-all ${
                    isSelected
                      ? 'border-blue-500 ring-2 ring-blue-100 bg-blue-50/20'
                      : month.isCurrentMonth
                      ? 'border-blue-300 bg-slate-50/60'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 text-sm font-heading">
                        {month.fullLabel}
                      </span>
                      {month.isCurrentMonth && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                          Atual
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => onSelectMonthFilter?.(isSelected ? null : month.monthKey)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                    >
                      {isSelected ? 'Limpar' : 'Filtrar'}
                    </button>
                  </div>

                  {/* Summary of this month */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-slate-50 mb-3 border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Previsto:</span>
                      <span className="font-bold text-blue-700">
                        {formatCurrency(month.projectedAmount)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Já Recebido:</span>
                      <span className="font-bold text-emerald-700">
                        {formatCurrency(month.receivedAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Installments in this month */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Parcelas deste mês ({month.installments.length})
                    </span>

                    {month.installments.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-2 text-center">
                        Nenhuma comissão agendada
                      </p>
                    ) : (
                      month.installments.map((inst) => (
                        <div
                          key={inst.id}
                          className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2 transition-all ${
                            inst.status === 'recebido'
                              ? 'bg-emerald-50/50 border-emerald-200'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              {inst.isBonus && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                                  BÔNUS
                                </span>
                              )}
                              <span className="font-semibold text-slate-800 truncate block">
                                {inst.dealTitle}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 truncate flex items-center gap-2 mt-0.5">
                              <span>{inst.title}</span>
                              <span>•</span>
                              <span>Venc: {formatDateBR(inst.dueDate)}</span>
                            </div>
                            <div className="font-bold text-slate-900 mt-1">
                              {formatCurrency(inst.amount)}
                            </div>
                          </div>

                          {/* Quick Toggle Button */}
                          <button
                            id={`btn-toggle-${inst.id}`}
                            onClick={() => handleMarkAsReceived(inst.dealId, inst.id)}
                            title={inst.status === 'recebido' ? 'Marcar como Pendente' : 'Marcar como Recebido (Entrou na Conta)'}
                            className={`p-1.5 rounded-lg cursor-pointer transition-colors shrink-0 ${
                              inst.status === 'recebido'
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                : 'bg-slate-100 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-200'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
