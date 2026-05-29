import { INIT_STATE } from '../data/constants.js';
import { updateStatsDisplay } from './ui.js';

let gameState = { ...INIT_STATE };

// 监听器 (用于UI刷新)
let stateListener = null;

export function initGameState() {
    // 重置状态 (若需要)
    Object.assign(gameState, INIT_STATE);
    if (stateListener) stateListener();
}

export function getGameState() {
    return gameState;
}

// 通用修改数值方法, 并触发UI更新
export function modifyState(delta) {
    if (delta.energy !== undefined) gameState.energy = Math.min(200, Math.max(0, gameState.energy + delta.energy));
    if (delta.reformFaith !== undefined) gameState.reformFaith = Math.min(100, Math.max(0, gameState.reformFaith + delta.reformFaith));
    if (delta.xiaochunProgress !== undefined) gameState.xiaochunProgress = Math.min(100, Math.max(0, gameState.xiaochunProgress + delta.xiaochunProgress));
    if (delta.qinshiProgress !== undefined) gameState.qinshiProgress = Math.min(100, Math.max(0, gameState.qinshiProgress + delta.qinshiProgress));
    if (delta.bond !== undefined) gameState.bond = Math.min(100, Math.max(0, gameState.bond + delta.bond));
    if (delta.hasXianglinInspire !== undefined) gameState.hasXianglinInspire = delta.hasXianglinInspire;
    if (delta.usedMedicineForQin !== undefined) gameState.usedMedicineForQin = delta.usedMedicineForQin;
    if (delta.vocalCured !== undefined) gameState.vocalCured = delta.vocalCured;
    if (delta.daysLeft !== undefined) gameState.daysLeft = delta.daysLeft;
    if (delta.day !== undefined) gameState.day = delta.day;
    
    if (stateListener) stateListener();
}

// 推进一天 (剧情调用)
export function advanceDay() {
    if (gameState.day < 7) {
        gameState.day++;
        gameState.daysLeft = 7 - gameState.day;
        if (stateListener) stateListener();
    }
}

// 注册UI更新回调
export function setStateListener(callback) {
    stateListener = callback;
}

// 结局计算
export function calculateEnding() {
    const { reformFaith, energy, xiaochunProgress, qinshiProgress } = gameState;
    if (reformFaith >= 80 && energy >= 30 && xiaochunProgress >= 100 && qinshiProgress >= 100) return "perfect";
    if (reformFaith >= 70) return "success";
    if (reformFaith >= 60) return "barely";
    return "fail";
}