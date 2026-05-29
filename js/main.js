import { initUI } from './ui.js';
import { initGameState } from './gameState.js';
import { storyEngine } from './storyEngine.js';

// 初始化游戏
function init() {
    initUI();           // 初始化界面元素
    initGameState();    // 初始化游戏数据
    storyEngine.startGame(); // 开始剧情
}

init();