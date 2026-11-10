import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  Firestore, 
  doc, 
  getDocFromServer,
  collection,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  getDoc,
  Unsubscribe
} from 'firebase/firestore';
import { 
  getAuth, 
  Auth, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User 
} from 'firebase/auth';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let isConfigured = false;

// Read ONLY from environment variables (Zero hardcoded credentials)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || '(default)'
};

// Initialize only when real credentials are provided
if (firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.apiKey !== 'AIzaSy...') {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
    auth = getAuth(app);
    isConfigured = true;
    console.info('[Firebase] Connected to active Firebase project:', firebaseConfig.projectId);
  } catch (err) {
    console.warn('[Firebase] Initialization error with provided credentials:', err);
  }
} else {
  console.info('[Firebase] Standby: Waiting for VITE_FIREBASE_ credentials in .env file.');
}

export const isFirebaseConfigured = (): boolean => isConfigured;
export const getFirebaseDb = (): Firestore | null => db;
export const getFirebaseAuth = (): Auth | null => auth;

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const currentAuth = auth;
  const currentUser: User | null = currentAuth ? currentAuth.currentUser : null;
  
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid,
      email: currentUser?.email,
      emailVerified: currentUser?.emailVerified,
      isAnonymous: currentUser?.isAnonymous,
      tenantId: currentUser?.tenantId,
      providerInfo: currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testConnection(): Promise<{ success: boolean; message: string }> {
  if (!db) {
    return { 
      success: false, 
      message: 'Firebase is in Standby mode. Enter your VITE_FIREBASE_ credentials in .env to connect.' 
    };
  }
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return { success: true, message: `Connected to Firestore (${firebaseConfig.projectId}) successfully!` };
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client offline.');
    }
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown Firestore connection error' 
    };
  }
}

// ==========================================
// FIRESTORE SYNC HELPERS (Direct Live Cloud DB)
// ==========================================

export async function syncDocToFirestore(collectionPath: string, docId: string, data: any): Promise<void> {
  if (!db) return;
  try {
    await setDoc(doc(db, collectionPath, docId), {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${collectionPath}/${docId}`);
  }
}

export async function deleteDocFromFirestore(collectionPath: string, docId: string): Promise<void> {
  if (!db) return;
  try {
    await deleteDoc(doc(db, collectionPath, docId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${collectionPath}/${docId}`);
  }
}

export async function fetchCollectionFromFirestore<T>(collectionPath: string): Promise<T[]> {
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, collectionPath));
    const items: T[] = [];
    snap.forEach(d => {
      items.push({ id: d.id, ...d.data() } as T);
    });
    return items;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, collectionPath);
    return [];
  }
}

export function subscribeCollectionFromFirestore<T>(
  collectionPath: string, 
  onData: (items: T[]) => void
): Unsubscribe | null {
  if (!db) return null;
  try {
    return onSnapshot(collection(db, collectionPath), (snap) => {
      const items: T[] = [];
      snap.forEach(d => {
        items.push({ id: d.id, ...d.data() } as T);
      });
      onData(items);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, collectionPath);
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, collectionPath);
    return null;
  }
}

export async function fetchDocFromFirestore<T>(collectionPath: string, docId: string): Promise<T | null> {
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, collectionPath, docId));
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as T;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `${collectionPath}/${docId}`);
    return null;
  }
}

export {
  app,
  db,
  auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  doc,
  collection,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot
};
