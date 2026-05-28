import { initUI } from './ui.js';
import { storyEngine } from './storyEngine.js';

document.addEventListener('DOMContentLoaded', () => {
    initUI();
    storyEngine.startPrologue();
});