import { getGameState, setStateListener } from './gameState.js';
import { storyEngine } from './storyEngine.js';

let bgLayer, charSpriteLeft, charSpriteRight, statsPanel;
let dialogNameEl, dialogTextEl, dialogArea;
let optionsContainer, nextIndicator;

let dialogueQueue = [];
let isWaitingForOption = false;
let currentSceneCallback = null;

export function initUI() {
    bgLayer = document.getElementById('bgLayer');
    charSpriteLeft = document.getElementById('charSpriteLeft');
    charSpriteRight = document.getElementById('charSpriteRight');
    statsPanel = document.getElementById('statsPanel');
    dialogNameEl = document.getElementById('dialogName');
    dialogTextEl = document.getElementById('dialogText');
    dialogArea = document.getElementById('dialogArea');
    optionsContainer = document.getElementById('optionsContainer');
    nextIndicator = document.getElementById('nextIndicator');

    if (charSpriteLeft) charSpriteLeft.style.display = 'block';
    if (charSpriteRight) charSpriteRight.style.display = 'none';

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
    dialogNameEl.innerText = msg.speaker || '';
    dialogTextEl.innerHTML = msg.html;
    if (msg.sprite) setCharacter(msg.sprite, true);
    if (msg.bg) setBackground(msg.bg);
}

export function addToStory(html, speaker = "", sprite = null, bg = null) {
    dialogueQueue.push({ html, speaker, sprite, bg });
    // 不再自动显示，等待用户点击或 setSceneEndCallback 触发
}

export function addMultipleMessages(messages) {
    messages.forEach(m => dialogueQueue.push(m));
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
    // 如果队列中有消息且尚未处于选项等待状态，自动显示第一条
    if (dialogueQueue.length > 0 && !isWaitingForOption) {
        displayNextDialogue();
    }
}

export function setBackground(bgName) {
    if (!bgLayer) return;
    bgLayer.style.backgroundImage = `url('assets/bg/${bgName}.jpg')`;
    bgLayer.style.backgroundSize = 'cover';
    bgLayer.style.backgroundPosition = 'center';
}

export function setCharacter(charName, visible = true) {
    if (!charSpriteRight) return;
    if (visible && charName) {
        charSpriteRight.src = `assets/char/${charName}.png`;
        charSpriteRight.style.display = 'block';
    } else {
        charSpriteRight.style.display = 'none';
    }
}

export function setProtagonistVisible(visible) {
    if (charSpriteLeft) {
        charSpriteLeft.style.display = visible ? 'block' : 'none';
    }
}

export function updateStatsDisplay() {
    const s = getGameState();
    statsPanel.innerHTML = `
        <div class="stat">灵力 ${s.energy}</div>
        <div class="stat">剩余 ${s.daysLeft}天</div>
        <div class="stat">信心 ${s.reformFaith}</div>
        <div class="stat">琴师 ${s.qinshiProgress}</div>
        <div class="stat">小春 ${s.xiaochunProgress}</div>
        <div class="stat">羁绊 ${s.bond}</div>
    `;
}