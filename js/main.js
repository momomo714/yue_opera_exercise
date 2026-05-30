import { initUI } from './ui.js';
import { initGameState } from './gameState.js';
import { storyEngine } from './storyEngine.js';

function init() {
    initUI();
    initGameState();
    storyEngine.startGame();
}

init();