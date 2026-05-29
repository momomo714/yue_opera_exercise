import { gameState } from './gameState.js';
import { storyEngine } from './storyEngine.js';

let bgLayer, charSprite;
let statsPanel;
let dialogNameEl, dialogTextEl, dialogArea;
let optionsContainer;
let nextIndicator;

let dialogueQueue = [];
let isWaitingForOption = false;
let currentSceneCallback = null;

export function initUI() {
    bgLayer = document.getElementById('bgLayer');
    charSprite = document.getElementById('charSprite');
    statsPanel = document.getElementById('statsPanel');
    dialogNameEl = document.getElementById('dialogName');
    dialogTextEl = document.getElementById('dialogText');
    dialogArea = document.getElementById('dialogArea');
    optionsContainer = document.getElementById('optionsContainer');
    nextIndicator = document.getElementById('nextIndicator');
    
    // 点击对话框区域推进（但要注意如果点击的是按钮，不触发）
    dialogArea.addEventListener('click', (e) => {
        // 如果点击的目标是按钮，忽略
        if (e.target.tagName === 'BUTTON') return;
        if (!isWaitingForOption && dialogueQueue.length > 0) {
            displayNextDialogue();
        } else if (!isWaitingForOption && dialogueQueue.length === 0 && currentSceneCallback) {
            const cb = currentSceneCallback;
            currentSceneCallback = null;
            cb();
        }
    });
    
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
}

export function addToStory(html, speaker = "") {
    dialogueQueue.push({ html, speaker });
    if (dialogueQueue.length === 1 && !isWaitingForOption) {
        displayNextDialogue();
    }
}

export function addMultipleMessages(messages) {
    messages.forEach(m => dialogueQueue.push(m));
    if (!isWaitingForOption && dialogueQueue.length > 0) {
        displayNextDialogue();
    }
}

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

export function setSceneEndCallback(callback) {
    currentSceneCallback = callback;
}

export function setBackground(bgName) {
    if (!bgLayer) return;
    bgLayer.style.backgroundImage = `url('images/bg/${bgName}.jpg')`;
    bgLayer.style.backgroundSize = 'cover';
    bgLayer.style.backgroundPosition = 'center';
}

export function setCharacter(charName, visible = true) {
    if (!charSprite) return;
    if (visible && charName) {
        charSprite.src = `images/char/${charName}.png`;
        charSprite.style.display = 'block';
    } else {
        charSprite.style.display = 'none';
    }
}

export function updateStatsDisplay() {
    const s = gameState.state;
    statsPanel.innerHTML = `
        <div class="stat">⚡ ${s.energy}</div>
        <div class="stat">⏳ ${s.daysLeft}天</div>
        <div class="stat">🎭 ${s.reformConfidence}</div>
        <div class="stat">🤝 ${s.totalBond}</div>
        <div class="stat">📖 ${s.actionPoints}</div>
    `;
}

export function reduceActionAndReturnToAct1() {
    const s = gameState.state;
    if (s.actPhase !== "act1") return;
    if (s.actionPoints <= 0) return;
    s.actionPoints--;
    updateStatsDisplay();
    if (s.actionPoints === 0) {
        addToStory("行动力耗尽，时光飞逝……", "系统");
        storyEngine.triggerEndOfAct1();
    } else {
        storyEngine.showAct1Menu();
    }
}