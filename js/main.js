import { initUI } from './ui.js';
import { storyEngine } from './storyEngine.js';

function init() {
    initUI();
    storyEngine.startGame();
}

init();