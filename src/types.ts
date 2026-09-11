export type PropertyType = 
  | 'apartamento'
  | 'casa'
  | 'terreno'
  | 'comercial'
  | 'lancamento'
  | 'rural'
  | 'outro';

export type DealStatus = 'em_andamento' | 'concluido' | 'distrato';

export type InstallmentStatus = 'pendente' | 'recebido' | 'atrasado';

export interface Installment {
  id: string;
  dealId: string;
  dealTitle: string;
  installmentNumber: number;
  totalInstallments: number;
  title: string;
  amount: number;
  dueDate: string; // YYYY-MM-DD
  receivedDate?: string; // YYYY-MM-DD
  status: InstallmentStatus;
  isBonus?: boolean;
  notes?: string;
}

export interface ContractDeal {
  id: string;
  propertyTitle: string;
  propertyType: PropertyType;
  clientName: string;
  clientPhone?: string;
  developerOrAgency: string; // Ex: 'Construtora Cyrela', 'Imobiliária Nova', 'Autônomo'
  contractDate: string; // YYYY-MM-DD
  propertyValue: number; // VGV do imóvel em R$
  grossCommissionPercent: number; // Ex: 5 (%)
  grossCommissionValue: number; // Ex: R$ 50.000
  brokerSplitPercent: number; // Repasse pro corretor Ex: 50 (%) ou 100 (%)
  brokerNetCommission: number; // Comissão líquida do corretor
  bonusAmount: number; // Bônus ou premiação extra da construtora
  bonusDescription?: string; // Ex: 'Campanha de Aceleração / Prêmio Sinal'
  totalBrokerReceivable: number; // Comissao liquida + bonus
  installments: Installment[];
  status: DealStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyForecastItem {
  monthKey: string; // YYYY-MM
  label: string; // Ex: "Out/26"
  fullLabel: string; // Ex: "Outubro de 2026"
  projectedAmount: number; // Total a receber previsto
  receivedAmount: number; // Já pago/recebido no mês
  bonusAmount: number; // Bônus do mês
  totalVolume: number; // projected + received
  installments: Installment[];
  isCurrentMonth: boolean;
  isPastMonth: boolean;
}

export interface FinancialStats {
  totalPendingFuture: number; // O que vai entrar nos próximos meses
  avgMonthlyNextMonths: number; // Média mensal prevista nos próximos meses
  totalReceivedAllTime: number; // Histórico de comissões já no bolso
  totalBonusesAllTime: number; // Total de bônus faturados
  totalVGV: number; // Volume total de vendas intermediado
  activeContractsCount: number;
  completedContractsCount: number;
  totalContractsCount: number;
  averageCommissionPercent: number;
}

export type ViewFilterPeriod = 'todos' | 'proximos_3_meses' | 'proximos_6_meses' | 'ano_atual' | 'recebidos' | 'pendentes';
