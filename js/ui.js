import { getGameState, subscribeStateChange } from './gameState.js';

let bgLayer, charSprite, statsPanel, dialogNameEl, dialogTextEl, dialogArea, optionsContainer, nextIndicator;
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

    dialogArea.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') return;
        if (!isWaitingForOption && dialogueQueue.length > 0) displayNextDialogue();
        else if (!isWaitingForOption && dialogueQueue.length === 0 && currentSceneCallback) {
            const cb = currentSceneCallback;
            currentSceneCallback = null;
            cb();
        }
    });

    subscribeStateChange(() => updateStatsDisplay());
    updateStatsDisplay();
    hideOptions();
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
    if (msg.bg) setBackground(msg.bg);
    if (msg.sprite) setCharacter(msg.sprite);
}

export function addToStory(html, speaker = "", sprite = null, bg = null) {
    dialogueQueue.push({ html, speaker, sprite, bg });
    if (dialogueQueue.length === 1 && !isWaitingForOption) displayNextDialogue();
}

export function clearMessageQueue() { dialogueQueue = []; }

function hideOptions() {
    optionsContainer.innerHTML = '';
    optionsContainer.classList.add('hide');
    isWaitingForOption = false;
}

export function setOptions(buttons) {
    isWaitingForOption = true;
    optionsContainer.classList.remove('hide');
    optionsContainer.innerHTML = '';
    buttons.forEach(btn => {
        const btnEl = document.createElement('button');
        btnEl.innerText = btn.label;
        btnEl.onclick = (e) => {
            e.stopPropagation();
            hideOptions();
            if (btn.action) btn.action();
            if (dialogueQueue.length > 0) displayNextDialogue();
            else if (currentSceneCallback) {
                const cb = currentSceneCallback;
                currentSceneCallback = null;
                cb();
            }
        };
        optionsContainer.appendChild(btnEl);
    });
}

export function setSceneEndCallback(cb) { currentSceneCallback = cb; }

export function setBackground(bgName) {
    if (!bgLayer) return;
    const styleMap = {
        backstage: 'linear-gradient(145deg, #2c2418, #1e1710)',
        rehearsal: 'linear-gradient(120deg, #3e2e20, #1e1710)',
        qinroom: 'linear-gradient(0deg, #2b211b, #1f1712)',
        night: 'linear-gradient(180deg, #0f0c09, #1a130c)',
        stage: 'linear-gradient(135deg, #4a3525, #201810)'
    };
    bgLayer.style.background = styleMap[bgName] || '#2a2418';
    bgLayer.style.backgroundSize = 'cover';
}

export function setCharacter(charName, visible = true) {
    if (!charSprite) return;
    if (visible && charName) {
        charSprite.style.display = 'block';
        charSprite.alt = charName;
        // 可扩展真实图片路径: charSprite.src = `assets/char/${charName}.png`;
    } else {
        charSprite.style.display = 'none';
    }
}

function updateStatsDisplay() {
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