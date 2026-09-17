import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, User } from '../lib/firebase';
import { ContractDeal } from '../types';

export interface UserCloudData {
  deals: ContractDeal[];
  updatedAt: string;
  userEmail: string;
  displayName: string;
}

/**
 * Recursively cleans an object or array to ensure no `undefined` values
 * are passed to Firebase Firestore (which throws on `undefined`).
 */
function cleanForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as unknown as T;
  }
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => cleanForFirestore(item)) as unknown as T;
  }
  if (typeof data === 'object' && !(data instanceof Date)) {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data as Record<string, any>)) {
      if (value !== undefined) {
        cleaned[key] = cleanForFirestore(value);
      }
    }
    return cleaned as T;
  }
  return data;
}

/**
 * Save user deals to Firestore cloud
 */
export async function saveDealsToCloud(user: User, deals: ContractDeal[]): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const rawData = {
      deals: Array.isArray(deals) ? deals : [],
      updatedAt: new Date().toISOString(),
      userEmail: user.email || '',
      displayName: user.displayName || 'Corretor Torresul',
    };
    
    // Clean all undefined values recursively to avoid Firestore invalid data errors
    const cleanedData = cleanForFirestore(rawData);
    
    await setDoc(userDocRef, cleanedData, { merge: true });
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

