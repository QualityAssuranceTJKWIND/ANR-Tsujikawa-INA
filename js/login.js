// =======================================================
//                  File: js/config.js
// =======================================================
export const firebaseConfig = {
    apiKey: "AIzaSyD88gVEu294b6mPBiU5XzLmUl5LSMmdrDs",
    authDomain: "basedata-5b586.firebaseapp.com",
    projectId: "basedata-5b586",
    storageBucket: "basedata-5b586.appspot.com",
    messagingSenderId: "435559065241",
    appId: "1:435559065241:web:b2b4f01cd2ed93ea527a08"
};


// =======================================================
//                  File: js/login.js
// =======================================================
import { handleLogin } from './auth.js';

document.getElementById('login-btn').addEventListener('click', handleLogin);

// --- Logika Latar Belakang 3D ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('login-3d-bg').appendChild(renderer.domElement);
const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
const material = new THREE.MeshStandardMaterial({ color: 0x4f46e5, metalness: 0.6, roughness: 0.4 });
const cubes = [];
for (let i = 0; i < 100; i++) {
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20);
    scene.add(cube);
    cubes.push(cube);
}
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);
camera.position.z = 5;
function animate() {
    requestAnimationFrame(animate);
    cubes.forEach(cube => { cube.rotation.x += 0.005; cube.rotation.y += 0.005; });
    renderer.render(scene, camera);
}
animate();


// =======================================================
//                  File: js/auth.js
// =======================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { firebaseConfig } from './config.js';
import { initApp } from './main.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let appInitialized = false;

onAuthStateChanged(auth, (user) => {
    const onLoginPage = window.location.pathname.endsWith('login.html') || window.location.pathname.endsWith('/');
    if (user) {
        if (onLoginPage) {
            window.location.href = 'index.html';
        } else if (!appInitialized) {
            appInitialized = true;
            initApp(user);
        }
    } else {
        if (!onLoginPage) {
            window.location.href = 'login.html';
        } else {
            const statusEl = document.getElementById('auth-status');
            if (statusEl) statusEl.textContent = 'Siap untuk login.';
        }
    }
});

export async function handleLogin() {
    const statusEl = document.getElementById('auth-status');
    if (statusEl) statusEl.textContent = 'Mencoba masuk...';
    try {
        await signInAnonymously(auth);
    } catch (error) {
        console.error("Login gagal:", error);
        if (statusEl) statusEl.textContent = `Error: ${error.code}`;
    }
}

export async function handleLogout() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout gagal:", error);
    }
}


// =======================================================
//                  File: js/main.js
// =======================================================
import { handleLogout } from './auth.js';
import { renderDashboardPage, renderListAnrPage, renderAnalisisPage, updateUserInfo, toggleSidebar } from './ui.js';
import { initializeApp as initializeAppMain } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, doc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-storage.js";
import { firebaseConfig as mainConfig } from './config.js';

const mainApp = initializeAppMain(mainConfig, "mainApp");
export const db = getFirestore(mainApp);
export const storage = getStorage(mainApp);
export const appId = 'anr-dashboard-app-default';

let currentAnrData = [];
let currentAnalysisData = {};

export function initApp(user) {
    document.getElementById('app-container').classList.remove('hidden');
    document.getElementById('loading-screen').classList.add('hidden');
    updateUserInfo(user);
    setupSidebarToggle();
    handleRouting();
    window.addEventListener('hashchange', handleRouting);
    listenToData();
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
}

function setupSidebarToggle() {
    document.getElementById('sidebar-toggle-btn').addEventListener('click', toggleSidebar);
}

function handleRouting() {
    const hash = window.location.hash || '#dashboard';
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === hash);
    });
    switch (hash.split('/')[0]) {
        case '#list-anr': renderListAnrPage(currentAnrData); break;
        case '#analisis': renderAnalisisPage(currentAnrData, currentAnalysisData); break;
        default: renderDashboardPage(currentAnrData); break;
    }
}

function listenToData() {
    const anrCollectionRef = collection(db, `artifacts/${appId}/public/data/anr_reports`);
    onSnapshot(anrCollectionRef, (snapshot) => {
        currentAnrData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        handleRouting();
    });
    const analysisDocRef = doc(db, `artifacts/${appId}/public/data/analysis/summary`);
    onSnapshot(analysisDocRef, (doc) => {
        currentAnalysisData = doc.exists() ? doc.data() : {};
        handleRouting();
    });
}

// =======================================================
//                  File: js/ui.js
// =======================================================
// (Salin isi file js/ui.js dari versi anr_ui_js_v5_reverted)


// =======================================================
//                  File: js/anr.js
// =======================================================
// (Salin isi file js/anr.js dari versi anr_js_v4_reverted)


// =======================================================
//                  File: js/charts.js
// =======================================================
// (Salin isi file js/charts.js dari versi anr_charts_js_v2)

