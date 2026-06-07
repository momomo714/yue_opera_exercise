import { initUI } from './ui.js';
import { initGameState } from './gameState.js';
import { storyEngine } from './storyEngine.js';

// 等待封面开始
function setupCover() {
    const cover = document.getElementById('coverLayer');
    const startBtn = document.getElementById('startGameBtn');
    if (!cover) return;

    startBtn.addEventListener('click', () => {
        // 淡出效果
        cover.style.opacity = '0';
        setTimeout(() => {
            cover.style.display = 'none';
            // 正式启动游戏
            initUI();
            initGameState();
            storyEngine.startGame();
        }, 800);
    });
}

// 先执行封面设置，游戏暂不启动
setupCover();