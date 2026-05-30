import { getGameState, setStateListener } from './gameState.js';
import { storyEngine } from './storyEngine.js';

let bgLayer, charSprite, statsPanel;
let dialogNameEl, dialogTextEl, dialogArea;
let optionsContainer, nextIndicator;

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
    if (msg.sprite) setCharacter(msg.sprite);
    if (msg.bg) setBackground(msg.bg);
}

export function addToStory(html, speaker = "", sprite = null, bg = null) {
    dialogueQueue.push({ html, speaker, sprite, bg });
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
    bgLayer.style.backgroundImage = `url('assets/bg/${bgName}.jpg')`;
    bgLayer.style.backgroundSize = 'cover';
    bgLayer.style.backgroundPosition = 'center';
}

export function setCharacter(charName, visible = true) {
    if (!charSprite) return;
    if (visible && charName) {
        charSprite.src = `assets/char/${charName}.png`;
        charSprite.style.display = 'block';
    } else {
        charSprite.style.display = 'none';
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