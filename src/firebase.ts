import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { 
  DEFAULT_DEPARTMENTS, 
  DEFAULT_SUBJECTS, 
  DEFAULT_MATERIALS, 
  DEFAULT_USERS
} from './mockData';
import type { 
  Department, 
  Subject, 
  Material, 
  User as UserType 
} from './mockData';

// --- firebase Configuration ---
// Replace the placeholder credentials below with your actual project credentials from the firebase Console.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID_HERE.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID_HERE",
  storageBucket: "YOUR_PROJECT_ID_HERE.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "YOUR_APP_ID_HERE"
};

// Check if the user has updated the configuration placeholder
export const isFirebaseConfigured = 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "YOUR_API_KEY_HERE" && 
  firebaseConfig.projectId && 
  firebaseConfig.projectId !== "YOUR_PROJECT_ID_HERE";

let db: any = null;

if (isFirebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("🔥 firebase Firestore has been successfully initialized!");
  } catch (error) {
    console.error("❌ firebase initialization failed:", error);
  }
} else {
  console.warn("⚠️ firebase is running in Offline/Simulator mode because credentials are not configured yet. Set them in 'src/firebase.ts'. Falling back to local storage database.");
}

// --- Data Synchronization Layer with Firestore ---

// 1. Fetch all datasets
export const loadAllDataFromFirestore = async (): Promise<{
  departments: Department[];
  subjects: Subject[];
  materials: Material[];
  users: { [email: string]: { password: string; info: UserType } };
}> => {
  if (!isFirebaseConfigured || !db) {
    // Return local storage data if offline
    return getLocalFallbackData();
  }

  try {
    const deptsCol = collection(db, 'departments');
    const subsCol = collection(db, 'subjects');
    const matsCol = collection(db, 'materials');
    const usersCol = collection(db, 'users');

    const [deptsSnap, subsSnap, matsSnap, usersSnap] = await Promise.all([
      getDocs(deptsCol),
      getDocs(subsCol),
      getDocs(matsCol),
      getDocs(usersCol)
    ]);

    // Check if firestore is empty. If it is, seed it with default datasets!
    if (deptsSnap.empty && subsSnap.empty && matsSnap.empty && usersSnap.empty) {
      console.log("🌱 Database is empty. Seeding firestore with university default records...");
      await seedFirestoreDatabase();
      return loadAllDataFromFirestore(); // Reload after seed
    }

    const departments: Department[] = [];
    deptsSnap.forEach(docSnap => departments.push({ id: docSnap.id, ...docSnap.data() } as Department));

    const subjects: Subject[] = [];
    subsSnap.forEach(docSnap => subjects.push({ id: docSnap.id, ...docSnap.data() } as Subject));

    const materials: Material[] = [];
    matsSnap.forEach(docSnap => materials.push({ id: docSnap.id, ...docSnap.data() } as Material));

    const users: { [email: string]: { password: string; info: UserType } } = {};
    usersSnap.forEach(docSnap => {
      const data = docSnap.data();
      users[docSnap.id] = {
        password: data.password,
        info: {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          departmentId: data.departmentId,
          semester: data.semester,
          assignedSubjects: data.assignedSubjects,
          status: data.status || 'approved'
        }
      };
    });

    // Merge with local storage fallback data so local-only changes (like failed Firestore writes) are not lost on refresh
    const localData = getLocalFallbackData();

    // Merge departments
    const mergedDepts = [...departments];
    localData.departments.forEach(ld => {
      if (!mergedDepts.some(d => d.id === ld.id)) {
        mergedDepts.push(ld);
        saveDepartmentFirestore(ld);
      }
    });

    // Merge subjects
    const mergedSubs = [...subjects];
    localData.subjects.forEach(ls => {
      if (!mergedSubs.some(s => s.id === ls.id)) {
        mergedSubs.push(ls);
        saveSubjectFirestore(ls);
      }
    });

    // Merge materials
    const mergedMats = [...materials];
    localData.materials.forEach(lm => {
      if (!mergedMats.some(m => m.id === lm.id)) {
        mergedMats.push(lm);
        saveMaterialFirestore(lm);
      }
    });

    // Merge users
    const mergedUsers = { ...localData.users };
    Object.entries(users).forEach(([email, entry]) => {
      mergedUsers[email] = entry;
    });
    Object.entries(localData.users).forEach(([email, entry]) => {
      if (!users[email]) {
        saveUserFirestore(entry.info, entry.password);
      }
    });

    return {
      departments: mergedDepts,
      subjects: mergedSubs,
      materials: mergedMats,
      users: mergedUsers
    };
  } catch (error) {
    console.error("❌ Failed to load data from firestore. Falling back to local storage.", error);
    return getLocalFallbackData();
  }
};

// Seeding function
const seedFirestoreDatabase = async () => {
  if (!db) return;
  try {
    const batch = writeBatch(db);

    // Seed Departments
    DEFAULT_DEPARTMENTS.forEach(dept => {
      const ref = doc(db, 'departments', dept.id);
      batch.set(ref, { name: dept.name, code: dept.code });
    });

    // Seed Subjects
    DEFAULT_SUBJECTS.forEach(sub => {
      const ref = doc(db, 'subjects', sub.id);
      batch.set(ref, {
        name: sub.name,
        code: sub.code,
        departmentId: sub.departmentId,
        semester: sub.semester
      });
    });

    // Seed Materials
    DEFAULT_MATERIALS.forEach(mat => {
      const ref = doc(db, 'materials', mat.id);
      batch.set(ref, {
        title: mat.title,
        subjectId: mat.subjectId,
        departmentId: mat.departmentId,
        semester: mat.semester,
        category: mat.category,
        description: mat.description,
        uploadedBy: mat.uploadedBy,
        uploadedByRole: mat.uploadedByRole,
        uploadedByEmail: mat.uploadedByEmail,
        uploadDate: mat.uploadDate,
        fileContent: mat.fileContent,
        fileName: mat.fileName,
        fileSize: mat.fileSize,
        status: mat.status
      });
    });

    // Seed Users
    Object.entries(DEFAULT_USERS).forEach(([email, entry]) => {
      const ref = doc(db, 'users', email.toLowerCase());
      batch.set(ref, {
        password: entry.password,
        id: entry.info.id,
        name: entry.info.name,
        email: entry.info.email,
        role: entry.info.role,
        departmentId: entry.info.departmentId || "",
        semester: entry.info.semester || "",
        assignedSubjects: entry.info.assignedSubjects || [],
        status: entry.info.status || 'approved'
      });
    });

    await batch.commit();
    console.log("✅ Seeding successfully completed.");
  } catch (error) {
    console.error("❌ Seeding database failed:", error);
  }
};

// Local storage fallback helpers
const getLocalFallbackData = () => {
  const getOrSet = (key: string, defaultValue: any) => {
    const val = localStorage.getItem(key);
    if (!val) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    try { return JSON.parse(val); } catch { return defaultValue; }
  };

  return {
    departments: getOrSet('cms_departments', DEFAULT_DEPARTMENTS) as Department[],
    subjects: getOrSet('cms_subjects', DEFAULT_SUBJECTS) as Subject[],
    materials: getOrSet('cms_materials', DEFAULT_MATERIALS) as Material[],
    users: getOrSet('cms_users', DEFAULT_USERS) as { [email: string]: { password: string; info: UserType } }
  };
};

// 2. Save Operations
export const saveDepartmentFirestore = async (dept: Department) => {
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'departments', dept.id), {
        name: dept.name,
        code: dept.code
      });
    } catch (e) { console.error("Firestore save department failed:", e); }
  }
};

export const saveSubjectFirestore = async (sub: Subject) => {
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'subjects', sub.id), {
        name: sub.name,
        code: sub.code,
        departmentId: sub.departmentId,
        semester: sub.semester
      });
    } catch (e) { console.error("Firestore save subject failed:", e); }
  }
};

export const saveMaterialFirestore = async (mat: Material) => {
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'materials', mat.id), {
        title: mat.title,
        subjectId: mat.subjectId,
        departmentId: mat.departmentId,
        semester: mat.semester,
        category: mat.category,
        description: mat.description,
        uploadedBy: mat.uploadedBy,
        uploadedByRole: mat.uploadedByRole,
        uploadedByEmail: mat.uploadedByEmail,
        uploadDate: mat.uploadDate,
        fileContent: mat.fileContent,
        fileName: mat.fileName,
        fileSize: mat.fileSize,
        status: mat.status
      });
    } catch (e) { console.error("Firestore save material failed:", e); }
  }
};

export const saveUserFirestore = async (user: UserType, passwordText: string) => {
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'users', user.email.toLowerCase()), {
        password: passwordText,
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        departmentId: user.departmentId || "",
        semester: user.semester || "",
        assignedSubjects: user.assignedSubjects || [],
        status: user.status || 'approved'
      });
    } catch (e) { console.error("Firestore save user failed:", e); }
  }
};

// 3. Delete Operations
export const deleteDepartmentFirestore = async (id: string) => {
  if (isFirebaseConfigured && db) {
    try { await deleteDoc(doc(db, 'departments', id)); } catch (e) { console.error("Firestore delete department failed:", e); }
  }
};

export const deleteSubjectFirestore = async (id: string) => {
  if (isFirebaseConfigured && db) {
    try { await deleteDoc(doc(db, 'subjects', id)); } catch (e) { console.error("Firestore delete subject failed:", e); }
  }
};

export const deleteMaterialFirestore = async (id: string) => {
  if (isFirebaseConfigured && db) {
    try { await deleteDoc(doc(db, 'materials', id)); } catch (e) { console.error("Firestore delete material failed:", e); }
  }
};

export const deleteUserFirestore = async (email: string) => {
  if (isFirebaseConfigured && db) {
    try { await deleteDoc(doc(db, 'users', email.toLowerCase())); } catch (e) { console.error("Firestore delete user failed:", e); }
  }
};
