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
            console.log("队列空，触发场景回调");
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
        console.warn("displayNextDialogue 但队列为空");
        return;
    }
    try {
        const msg = dialogueQueue.shift();
        console.log(`[显示] 剩余 ${dialogueQueue.length} 条 | 内容: ${msg.html.substring(0, 40)}`);
        dialogNameEl.innerText = msg.speaker || '';
        dialogTextEl.innerHTML = msg.html;
        if (msg.sprite) setCharacter(msg.sprite, true);
        if (msg.bg) setBackground(msg.bg);
    } catch(e) {
        console.error("显示对话时出错", e);
    }
}

export function addToStory(html, speaker = "", sprite = null, bg = null) {
    try {
        dialogueQueue.push({ html, speaker, sprite, bg });
        console.log(`[加入] 队列长度 ${dialogueQueue.length} | 内容: ${html.substring(0, 40)}`);
        if (dialogueQueue.length === 1 && !isWaitingForOption) {
            displayNextDialogue();
        }
    } catch(e) {
        console.error("addToStory出错", e);
    }
}

export function addMultipleMessages(messages) {
    messages.forEach(m => addToStory(m.html, m.speaker, m.sprite, m.bg));
}

export function clearMessageQueue() {
    console.log("清空队列，原长度", dialogueQueue.length);
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
    if (charSpriteLeft) charSpriteLeft.style.display = visible ? 'block' : 'none';
}

export function updateStatsDisplay() {
    const s = getGameState();
    statsPanel.innerHTML = `
        <div class="stat">能量 ${s.energy}</div>
        <div class="stat">剩余 ${s.daysLeft}天</div>
        <div class="stat">信心 ${s.reformFaith}</div>
        <div class="stat">琴师 ${s.qinshiProgress}</div>
        <div class="stat">小春 ${s.xiaochunProgress}</div>
        <div class="stat">羁绊 ${s.bond}</div>
    `;
}