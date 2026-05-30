import { scenes } from './scenes.js';

let currentSceneId = null;

export const storyEngine = {
    startGame() {
        this.gotoScene('day1_start');
    },
    gotoScene(sceneId) {
        if (!scenes[sceneId]) {
            console.error(`场景不存在: ${sceneId}`);
            return;
        }
        currentSceneId = sceneId;
        scenes[sceneId]();
    },
    getCurrentScene() { return currentSceneId; }
};