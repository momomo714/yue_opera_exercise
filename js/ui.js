import { gameState } from './gameState.js';
import { storyEngine } from './storyEngine.js';

let bgLayer, charSprite;
let statsPanel;
let dialogNameEl, dialogTextEl, dialogArea;
let optionsDiv;

// 对话队列
let dialogueQueue = [];      // 存储 { html, speaker }
let isWaitingForOption = false;
let currentSceneCallback = null;  // 当队列清空后执行的函数（例如结束场景）

export function initUI() {
    bgLayer = document.getElementById('bgLayer');
    charSprite = document.getElementById('charSprite');
    statsPanel = document.getElementById('statsPanel');
    dialogNameEl = document.getElementById('dialogName');
    dialogTextEl = document.getElementById('dialogText');
    dialogArea = document.getElementById('dialogArea');
    optionsDiv = document.getElementById('optionsArea');
    
    // 点击对话框区域推进
    dialogArea.addEventListener('click', () => {
        if (!isWaitingForOption && dialogueQueue.length > 0) {
            displayNextDialogue();
        } else if (!isWaitingForOption && dialogueQueue.length === 0) {
            // 队列空，可能场景结束需要回调
            if (currentSceneCallback) {
                const cb = currentSceneCallback;
                currentSceneCallback = null;
                cb();
            }
        }
    });
    
    updateStatsDisplay();
    // 初始隐藏选项区
    optionsDiv.classList.add('hide');
}

// 显示下一条对话
function displayNextDialogue() {
    if (isWaitingForOption) return;
    if (dialogueQueue.length === 0) {
        // 队列空：如果有场景结束回调则执行
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
    // 滚动效果可以通过动画，简单起见不加滚动
}

// 外部添加一条对话（立即加入队列，如果当前没有显示则显示）
export function addToStory(html, speaker = "") {
    if (isWaitingForOption) {
        // 如果正在等待选项，暂存到队列后面，等选项结束后再显示
        dialogueQueue.push({ html, speaker });
        return;
    }
    dialogueQueue.push({ html, speaker });
    if (dialogueQueue.length === 1 && !isWaitingForOption) {
        displayNextDialogue();
    }
}

// 批量添加（用于初始多个）
export function addMultipleMessages(messages) {
    messages.forEach(m => dialogueQueue.push(m));
    if (!isWaitingForOption && dialogueQueue.length > 0) {
        displayNextDialogue();
    }
}

// 清空队列（场景切换时）
export function clearMessageQueue() {
    dialogueQueue = [];
}

// 显示选项（会暂停自动推进）
export function setOptions(buttons) {
    isWaitingForOption = true;
    optionsDiv.classList.remove('hide');
    optionsDiv.innerHTML = '';
    buttons.forEach(btn => {
        const btnEl = document.createElement('button');
        btnEl.innerText = btn.label;
        btnEl.onclick = () => {
            // 隐藏选项区，恢复推进
            optionsDiv.classList.add('hide');
            isWaitingForOption = false;
            if (btn.action) btn.action();
            // 选项点击后，如果队列还有未显示，立即显示下一条
            if (dialogueQueue.length > 0) {
                displayNextDialogue();
            } else if (currentSceneCallback) {
                // 如果没有更多对话且场景有结束回调，执行
                const cb = currentSceneCallback;
                currentSceneCallback = null;
                cb();
            }
        };
        optionsDiv.appendChild(btnEl);
    });
}

export function hideOptions() {
    optionsDiv.classList.add('hide');
    isWaitingForOption = false;
}

// 设置场景结束后的回调（当对话队列清空且没有选项时调用）
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

// 消耗行动点并返回第一幕菜单（需要外部调用 showAct1Menu）
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