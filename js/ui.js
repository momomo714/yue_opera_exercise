import { getGameState, setStateListener } from './gameState.js';
import { storyEngine } from './storyEngine.js';

// DOM 元素
let bgLayer, charSprite, statsPanel;
let dialogNameEl, dialogTextEl, dialogArea;
let optionsContainer, nextIndicator;

let dialogueQueue = [];      // 对话队列
let isWaitingForOption = false;
let currentSceneCallback = null;  // 对话队列清空后回调

export function initUI() {
    bgLayer = document.getElementById('bgLayer');
    charSprite = document.getElementById('charSprite');
    statsPanel = document.getElementById('statsPanel');
    dialogNameEl = document.getElementById('dialogName');
    dialogTextEl = document.getElementById('dialogText');
    dialogArea = document.getElementById('dialogArea');
    optionsContainer = document.getElementById('optionsContainer');
    nextIndicator = document.getElementById('nextIndicator');
    
    // 点击对话框推进对话
    dialogArea.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') return;
        if (!isWaitingForOption && dialogueQueue.length > 0) {
            displayNextDialogue();
        } else if (!isWaitingForOption && dialogueQueue.length === 0 && currentSceneCallback) {
            const cb = currentSceneCallback;
            currentSceneCallback = null;
            cb();
        }
    });
    
    // 注册状态更新回调
    setStateListener(() => updateStatsDisplay());
    updateStatsDisplay();
    hideOptionsContainer();
}

function displayNextDialogue() {
    if (isWaitingForOption) return;
    if (dialogueQueue.length === 0) {
        if (currentSceneCallback) {
            const cb = currentSceneCallback;
            currentSceneCallback = null;
            cb();
        }
        return;
    }
    const msg = dialogueQueue.shift();
    dialogNameEl.innerText = msg.speaker ? `🎭 ${msg.speaker}` : '';
    dialogTextEl.innerHTML = msg.html;
    // 若有立绘设置
    if (msg.sprite) setCharacter(msg.sprite);
    if (msg.bg) setBackground(msg.bg);
}

// 添加一句对话
export function addToStory(html, speaker = "", sprite = null, bg = null) {
    dialogueQueue.push({ html, speaker, sprite, bg });
    if (dialogueQueue.length === 1 && !isWaitingForOption) {
        displayNextDialogue();
    }
}

// 批量添加对话
export function addMultipleMessages(messages) {
    messages.forEach(m => dialogueQueue.push(m));
    if (!isWaitingForOption && dialogueQueue.length > 0) {
        displayNextDialogue();
    }
}

// 清空消息队列 (切换场景前谨慎使用)
export function clearMessageQueue() {
    dialogueQueue = [];
}

function hideOptionsContainer() {
    optionsContainer.innerHTML = '';
    optionsContainer.classList.add('hide');
}

function showOptionsContainer() {
    optionsContainer.classList.remove('hide');
}

// 显示选项按钮
export function setOptions(buttons) {
    isWaitingForOption = true;
    showOptionsContainer();
    optionsContainer.innerHTML = '';
    buttons.forEach(btn => {
        const btnEl = document.createElement('button');
        btnEl.innerText = btn.label;
        btnEl.onclick = (e) => {
            e.stopPropagation();
            hideOptionsContainer();
            isWaitingForOption = false;
            if (btn.action) btn.action();
            // 选项后若还有对话则继续
            if (dialogueQueue.length > 0) {
                displayNextDialogue();
            } else if (currentSceneCallback) {
                const cb = currentSceneCallback;
                currentSceneCallback = null;
                cb();
            }
        };
        optionsContainer.appendChild(btnEl);
    });
}

export function hideOptions() {
    hideOptionsContainer();
    isWaitingForOption = false;
}

// 设置场景结束回调 (对话队列处理完后调用)
export function setSceneEndCallback(callback) {
    currentSceneCallback = callback;
}

// 切换背景
export function setBackground(bgName) {
    if (!bgLayer) return;
    bgLayer.style.backgroundImage = `url('assets/bg/${bgName}.jpg')`;
    bgLayer.style.backgroundSize = 'cover';
    bgLayer.style.backgroundPosition = 'center';
}

// 切换立绘
export function setCharacter(charName, visible = true) {
    if (!charSprite) return;
    if (visible && charName) {
        charSprite.src = `assets/char/${charName}.png`;
        charSprite.style.display = 'block';
    } else {
        charSprite.style.display = 'none';
    }
}

// 更新数值面板
export function updateStatsDisplay() {
    const s = getGameState();
    statsPanel.innerHTML = `
        <div class="stat">⚡ 灵力 ${s.energy}</div>
        <div class="stat">📅 剩余 ${s.daysLeft}天</div>
        <div class="stat">⭐ 信心 ${s.reformFaith}</div>
        <div class="stat">🎻 琴师 ${s.qinshiProgress}</div>
        <div class="stat">🌱 小春 ${s.xiaochunProgress}</div>
        <div class="stat">💞 羁绊 ${s.bond}</div>
    `;
}