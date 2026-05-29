import { scenesMap } from './scenes.js';
import { clearMessageQueue, setSceneEndCallback } from './ui.js';
import { getGameState } from './gameState.js';

let currentSceneId = null;

export const storyEngine = {
    startGame() {
        this.gotoScene('day1_start');
    },
    
    gotoScene(sceneId) {
        if (!scenesMap[sceneId]) {
            console.error(`场景不存在: ${sceneId}`);
            return;
        }
        currentSceneId = sceneId;
        // 执行场景函数
        scenesMap[sceneId]();
    },
    
    getCurrentScene() {
        return currentSceneId;
    }
};