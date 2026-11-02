import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged, User } from "firebase/auth";
import { 
  getFirestore, 
  setLogLevel,
  doc, 
  getDoc, 
  setDoc,
  Firestore 
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Silence verbose connection retry warnings so transient network blips do not throw false-positive console errors
setLogLevel("silent");

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

interface FirestoreErrorInfo {
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

let firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);

let firestoreDb: Firestore | null = null;

export function getDb(): Firestore | null {
  if (!firestoreDb) {
    try {
      if (!firebaseConfig || !firebaseConfig.projectId) {
        return null;
      }
      firestoreDb = firebaseConfig.firestoreDatabaseId 
        ? getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId) 
        : getFirestore(firebaseApp);
    } catch (err) {
      console.warn("Firestore initialization warning:", err);
    }
  }
  return firestoreDb;
}

export const db = getDb();

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): void {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.warn("Firestore Operation Note: ", JSON.stringify(errInfo));
}

/**
 * Initializes anonymous authentication ensuring each device gets a dedicated uid.
 */
export async function ensureAuthenticatedUser(): Promise<User | null> {
  if (auth.currentUser) {
    return auth.currentUser;
  }
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        unsubscribe();
        resolve(user);
      } else {
        try {
          const cred = await signInAnonymously(auth);
          unsubscribe();
          resolve(cred.user);
        } catch (err) {
          console.warn("Firebase anonymous authentication note:", err);
          unsubscribe();
          resolve(null);
        }
      }
    });
  });
}

export async function saveUserDataToCloud(userId: string, lectures: any[], config: any): Promise<boolean> {
  if (!userId) return false;
  const path = `users/${userId}`;
  try {
    const database = getDb();
    if (!database) return false;
    const userDocRef = doc(database, "users", userId);
    await setDoc(userDocRef, {
      lectures,
      config,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (err: any) {
    if (err?.code !== "unavailable") {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
    return false;
  }
}

export async function loadUserDataFromCloud(userId: string): Promise<{ lectures: any[]; config: any } | null> {
  if (!userId) return null;
  const path = `users/${userId}`;
  try {
    const database = getDb();
    if (!database) return null;
    const userDocRef = doc(database, "users", userId);
    
    // 3.5s timeout prevents blocking when network is poor or offline
    const fetchPromise = getDoc(userDocRef);
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3500));
    
    const snap = await Promise.race([fetchPromise, timeoutPromise]);
    if (snap && "exists" in snap && snap.exists()) {
      return snap.data() as { lectures: any[]; config: any };
    }
  } catch (err: any) {
    if (err?.code !== "unavailable") {
      handleFirestoreError(err, OperationType.GET, path);
    }
  }
  return null;
}
