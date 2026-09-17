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
 * Deeply sanitizes any JavaScript object or array for Firestore.
 * 1. Strips all keys whose values are `undefined`.
 * 2. Filters out any `undefined` or `null` items in arrays.
 * 3. Guarantees pure JSON-compatible primitive objects so Firestore never rejects data.
 */
export function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as unknown as T;
  }

  // First pass: standard JSON stringify automatically omits undefined keys in objects
  const jsonString = JSON.stringify(data, (_key, value) => {
    return value === undefined ? null : value;
  });

  if (!jsonString) {
    return {} as T;
  }

  const parsed = JSON.parse(jsonString);

  // Second pass: recursively clean nulls/undefined from arrays and objects
  function clean(item: any): any {
    if (item === null || item === undefined) {
      return '';
    }
    if (Array.isArray(item)) {
      return item
        .filter((el) => el !== null && el !== undefined)
        .map(clean);
    }
    if (typeof item === 'object' && item !== null) {
      const result: Record<string, any> = {};
      for (const [k, v] of Object.entries(item)) {
        if (v !== undefined) {
          result[k] = clean(v);
        }
      }
      return result;
    }
    return item;
  }

  return clean(parsed);
}

/**
 * Save user deals to Firestore cloud safely
 */
export async function saveDealsToCloud(user: User, deals: ContractDeal[]): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', user.uid);
    
    // Ensure deals is a valid array
    const safeDeals = Array.isArray(deals) ? deals : [];
    
    const rawData = {
      deals: safeDeals,
      updatedAt: new Date().toISOString(),
      userEmail: user.email || '',
      displayName: user.displayName || 'Corretor Torresul',
    };
    
    // Clean all undefined values recursively to avoid Firestore invalid data errors
    const cleanedData = sanitizeForFirestore(rawData);
    
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

