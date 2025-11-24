// =======================================================
// File: js/login.js
// =======================================================
import { handleLogin } from './auth.js';

// 3D Background (Tetap sama)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('login-3d-bg').appendChild(renderer.domElement);
// ... (Sisa kode 3D background Anda biarkan saja) ...

// Event Listener
document.getElementById('login-btn').addEventListener('click', handleLogin);