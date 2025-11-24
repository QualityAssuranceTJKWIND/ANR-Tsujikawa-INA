// =======================================================
// File: js/auth.js
// =======================================================
import { getAuth, signInAnonymously } from "./mock-firebase.js"; // Arahkan ke lokal

const auth = getAuth(); 

export async function handleLogin() {
    const statusEl = document.getElementById('auth-status');
    statusEl.textContent = 'Masuk ke Mode Offline...';
    try {
        await signInAnonymously(auth);
        window.location.href = 'index.html';
    } catch (error) {
        statusEl.textContent = `Error: ${error.message}`;
    }
}