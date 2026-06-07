import { initUI } from './ui.js';
import { initGameState } from './gameState.js';
import { storyEngine } from './storyEngine.js';

function startGame() {
    const gameContent = document.getElementById('gameContent');
    const cover = document.getElementById('coverLayer');
    if (!gameContent || !cover) return;

    cover.style.opacity = '0';
    setTimeout(() => {
        cover.style.display = 'none';
        gameContent.style.display = 'block';
        initUI();
        initGameState();
        storyEngine.startGame();
    }, 600);
}

const startBtn = document.getElementById('startGameBtn');
if (startBtn) {
    startBtn.addEventListener('click', startGame);
}