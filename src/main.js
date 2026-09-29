import './style.css';
import { initScene } from './scene.js';
import { initUI } from './ui.js';
import { initKeepy } from './keepy.js';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// If WebGL is unavailable the site still works, just without the 3D shapes.
const noScene = { setPalette() {}, cycleHero() {}, hit: () => false };
let scene = noScene;
try {
  scene = initScene(document.getElementById('scene'), { reducedMotion: reduced });
} catch (err) {
  console.warn('WebGL unavailable, continuing without 3D background.', err);
  document.documentElement.classList.add('no-webgl');
}

initUI({ scene, morphButton: document.getElementById('morph') });

initKeepy(document.getElementById('keepy'), {
  onScore(score, best) {
    document.getElementById('keepy-score').textContent = String(score);
    document.getElementById('keepy-best').textContent = String(best);
  },
});
