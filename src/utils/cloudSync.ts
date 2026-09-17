import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, User } from '../lib/firebase';
import { ContractDeal, Installment } from '../types';

export interface UserCloudData {
  deals: ContractDeal[];
  updatedAt: string;
  userEmail: string;
  displayName: string;
}

/**
 * Normalizes an installment to guarantee strictly valid types and zero `undefined` values.
 */
function normalizeInstallment(inst: any): Installment | null {
  if (!inst || typeof inst !== 'object') return null;
  return {
    id: String(inst.id || `inst-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`),
    dealId: String(inst.dealId || ''),
    dealTitle: String(inst.dealTitle || ''),
    installmentNumber: Number(inst.installmentNumber) || 1,
    totalInstallments: Number(inst.totalInstallments) || 1,
    title: String(inst.title || ''),
    amount: Number(inst.amount) || 0,
    dueDate: String(inst.dueDate || ''),
    receivedDate: inst.receivedDate ? String(inst.receivedDate) : '',
    status: (inst.status === 'recebido' || inst.status === 'atrasado' || inst.status === 'pendente') ? inst.status : 'pendente',
    isBonus: Boolean(inst.isBonus || false),
    notes: inst.notes ? String(inst.notes) : ''
  };
}

/**
 * Normalizes a contract deal to guarantee strictly valid types and zero `undefined` values.
 */
function normalizeDeal(deal: any): ContractDeal | null {
  if (!deal || typeof deal !== 'object') return null;
  const rawInstallments = Array.isArray(deal.installments) ? deal.installments : [];
  const safeInstallments = rawInstallments
    .map(normalizeInstallment)
    .filter((item): item is Installment => item !== null);

  return {
    id: String(deal.id || `deal-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`),
    propertyTitle: String(deal.propertyTitle || 'Imóvel'),
    propertyType: deal.propertyType || 'apartamento',
    clientName: String(deal.clientName || 'Cliente'),
    clientPhone: deal.clientPhone ? String(deal.clientPhone) : '',
    developerOrAgency: String(deal.developerOrAgency || 'Torresul Imobiliária'),
    contractDate: String(deal.contractDate || new Date().toISOString().split('T')[0]),
    propertyValue: Number(deal.propertyValue) || 0,
    grossCommissionPercent: Number(deal.grossCommissionPercent) || 0,
    grossCommissionValue: Number(deal.grossCommissionValue) || 0,
    brokerSplitPercent: Number(deal.brokerSplitPercent) || 0,
    brokerNetCommission: Number(deal.brokerNetCommission) || 0,
    bonusAmount: Number(deal.bonusAmount) || 0,
    bonusDescription: deal.bonusDescription ? String(deal.bonusDescription) : '',
    totalBrokerReceivable: Number(deal.totalBrokerReceivable) || 0,
    status: (deal.status === 'concluido' || deal.status === 'distrato' || deal.status === 'em_andamento') ? deal.status : 'em_andamento',
    notes: deal.notes ? String(deal.notes) : '',
    createdAt: String(deal.createdAt || new Date().toISOString()),
    updatedAt: String(deal.updatedAt || new Date().toISOString()),
    installments: safeInstallments
  };
}

/**
 * Save user deals to Firestore cloud safely with guaranteed primitive fields
 */
export async function saveDealsToCloud(user: User, deals: ContractDeal[]): Promise<void> {
  if (!user || !user.uid) return;
  try {
    const userDocRef = doc(db, 'users', user.uid);
    
    // Normalize and clean all deals strictly
    const safeDeals: ContractDeal[] = Array.isArray(deals) 
      ? deals.map(normalizeDeal).filter((d): d is ContractDeal => d !== null) 
      : [];

    const rawObject = {
      deals: safeDeals,
      updatedAt: new Date().toISOString(),
      userEmail: String(user.email || ''),
      displayName: String(user.displayName || 'Corretor Torresul'),
    };

    // Serializes and deserializes pure JSON, removing any remaining undefined properties
    const safePayload = JSON.parse(JSON.stringify(rawObject));
    
    await setDoc(userDocRef, safePayload, { merge: true });
  } catch (error) {
    console.error('Erro ao sincronizar com Firestore:', error);
    throw error;
  }
}

/**
 * Fetch user deals once from Firestore
 */
export async function loadDealsFromCloud(user: User): Promise<ContractDeal[] | null> {
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as UserCloudData;
      return Array.isArray(data.deals) ? data.deals : [];
    }
    return null;
  } catch (error) {
    console.error('Erro ao carregar dados do Firestore:', error);
    return null;
  }
}

/**
 * Subscribe to real-time changes from Firestore
 */
export function subscribeToUserCloud(
  user: User, 
  onData: (deals: ContractDeal[]) => void
): () => void {
  const userDocRef = doc(db, 'users', user.uid);
  return onSnapshot(userDocRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data() as UserCloudData;
      if (Array.isArray(data.deals)) {
        onData(data.deals);
      }
    }
  }, (error) => {
    console.error('Erro no listener de nuvem:', error);
  });
}

