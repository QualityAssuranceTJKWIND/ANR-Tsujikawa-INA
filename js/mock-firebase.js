// =======================================================
// File: js/mock-firebase.js
// =======================================================

const DB_KEY = 'anr_offline_db';
const STORAGE_PREFIX = 'anr_storage_';

// --- Helpers ---
function getLocalDB() {
    const defaultDB = {
        "artifacts/anr-dashboard-app-default/public/data/anr_reports": [],
        "artifacts/anr-dashboard-app-default/public/data/members": []
    };
    return JSON.parse(localStorage.getItem(DB_KEY) || JSON.stringify(defaultDB));
}

function saveLocalDB(data) {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('db-changed')); // Trigger realtime listener
}

// --- 1. MOCK AUTH ---
export function initializeApp(config) { return {}; }
export function getAuth(app) { return { currentUser: { email: 'demo@offline.local', uid: 'offline-123', isAnonymous: false } }; }
export function onAuthStateChanged(auth, cb) { setTimeout(() => cb(auth.currentUser), 100); return () => {}; }
export function signInAnonymously(auth) { return Promise.resolve({ user: auth.currentUser }); }
export function signOut(auth) { 
    if(confirm("Reset data demo? (Klik OK untuk hapus data, Cancel untuk logout saja)")) {
        localStorage.removeItem(DB_KEY);
        Object.keys(localStorage).forEach(k => k.startsWith(STORAGE_PREFIX) && localStorage.removeItem(k));
    }
    window.location.reload(); 
    return Promise.resolve(); 
}

// --- 2. MOCK FIRESTORE ---
export function getFirestore(app) { return {}; }
export function collection(db, path) { return { path, type: 'collection' }; }
export function doc(db, path, id) { return { path, id, type: 'doc' }; }
export function serverTimestamp() { return new Date().toISOString(); }

export async function addDoc(collRef, data) {
    const dbData = getLocalDB();
    if (!dbData[collRef.path]) dbData[collRef.path] = [];
    const newId = 'doc_' + Date.now();
    const newDoc = { id: newId, ...data };
    dbData[collRef.path].push(newDoc);
    saveLocalDB(dbData);
    return { id: newId };
}

export async function deleteDoc(docRef) {
    const dbData = getLocalDB();
    // Asumsi docRef dibuat via doc(db, collectionPath, id)
    // Kita perlu parsing manual path-nya karena struktur mock sederhana
    // Di app Anda path selalu: artifacts/.../data/anr_reports (atau members)
    
    // Cari collection mana yang memuat ID ini
    for (const key in dbData) {
        const index = dbData[key].findIndex(item => item.id === docRef.id);
        if (index !== -1) {
            dbData[key].splice(index, 1);
            saveLocalDB(dbData);
            break;
        }
    }
}

export function onSnapshot(collRef, callback) {
    const notify = () => {
        const dbData = getLocalDB();
        const docs = dbData[collRef.path] || [];
        callback({ docs: docs.map(d => ({ id: d.id, data: () => d })) });
    };
    notify();
    window.addEventListener('db-changed', notify);
    return () => window.removeEventListener('db-changed', notify);
}

// Mock untuk getDocs (dipakai di form member)
export async function getDocs(collRef) {
    const dbData = getLocalDB();
    const docs = dbData[collRef.path] || [];
    return { docs: docs.map(d => ({ id: d.id, data: () => d })) };
}

// --- 3. MOCK STORAGE (Base64) ---
export function getStorage(app) { return {}; }
export function ref(storage, path) { return { path }; }

export async function uploadBytes(storageRef, file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                localStorage.setItem(STORAGE_PREFIX + storageRef.path, e.target.result);
                resolve({ ref: storageRef });
            } catch (err) {
                alert("Gagal: Ukuran gambar terlalu besar untuk LocalStorage browser.");
                resolve({ ref: storageRef }); // Resolve anyway to prevent crash
            }
        };
        reader.readAsDataURL(file);
    });
}

export async function getDownloadURL(storageRef) {
    return localStorage.getItem(STORAGE_PREFIX + storageRef.path) || "https://placehold.co/400x300?text=No+Image";
}