import React from 'react';
import { 
  TrendingUp, 
  CalendarClock, 
  Wallet, 
  Award, 
  Building,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { FinancialStats } from '../types';
import { formatCurrency } from '../utils/formatters';

interface MetricCardsProps {
  stats: FinancialStats;
  onFilterPending?: () => void;
  onFilterReceived?: () => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ 
  stats,
  onFilterPending,
  onFilterReceived 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      
      {/* 1. A Receber nos Próximos Meses (Destaque Principal) */}
      <div 
        id="card-metric-pending"
        onClick={onFilterPending}
        className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/70 rounded-full -mr-8 -mt-8 pointer-events-none transition-transform group-hover:scale-110" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            A Receber (Previsto)
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <CalendarClock className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-blue-700 tracking-tight font-heading">
          {formatCurrency(stats.totalPendingFuture)}
        </div>
        <div className="mt-2 flex items-center text-xs text-slate-500">
          <span className="font-medium text-blue-700 mr-1">Próximos meses</span>
          <span>• fluxo em aberto</span>
        </div>
      </div>

      {/* 2. Média Mensal Prevista */}
      <div 
        id="card-metric-avg"
        className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Média Mensal Prevista
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-indigo-700 tracking-tight font-heading">
          {formatCurrency(stats.avgMonthlyNextMonths)}
        </div>
        <div className="mt-2 flex items-center text-xs text-slate-500">
          <span>Estimativa média por mês futuro</span>
        </div>
      </div>

      {/* 3. Já Recebido (Histórico) */}
      <div 
        id="card-metric-received"
        onClick={onFilterReceived}
        className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Histórico Já Recebido
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-emerald-700 tracking-tight font-heading">
          {formatCurrency(stats.totalReceivedAllTime)}
        </div>
        <div className="mt-2 flex items-center text-xs text-slate-500">
          <span className="text-emerald-700 font-medium mr-1">Já no bolso</span>
          <span>• parcelas liquidadas</span>
        </div>
      </div>

      {/* 4. Bônus & Premiações */}
      <div 
        id="card-metric-bonuses"
        className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Bônus & Premiações
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-amber-700 tracking-tight font-heading">
          {formatCurrency(stats.totalBonusesAllTime)}
        </div>
        <div className="mt-2 flex items-center text-xs text-slate-500">
          <span>Prêmios de construtoras & metas</span>
        </div>
      </div>

      {/* 5. VGV Intermediado */}
      <div 
        id="card-metric-vgv"
        className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            VGV Total Intermediado
          </span>
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <Building className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-slate-900 tracking-tight font-heading">
          {formatCurrency(stats.totalVGV)}
        </div>
        <div className="mt-2 flex items-center text-xs text-slate-500">
          <span className="font-semibold text-slate-800 mr-1">{stats.totalContractsCount}</span>
          <span>contrato(s) fechado(s)</span>
        </div>
      </div>

    </div>
  );
};
