import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Erro ao fazer login com Google:', error);
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
      // If popup was blocked or closed quickly due to iframe security constraints
      if (window.self !== window.top) {
        // We are in an iframe (e.g. AI Studio preview)
        alert('Para fazer login com o Google com segurança, abra o aplicativo em uma nova aba do navegador.');
        window.open(window.location.href, '_blank');
      }
    }
    throw error;
  }
};

export const logoutGoogle = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Erro ao sair:', error);
    throw error;
  }
};

export type { User };
