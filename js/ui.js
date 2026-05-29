import { gameState } from './gameState.js';
import { storyEngine } from './storyEngine.js';

let storyDiv, optionsDiv, nextDiv, statsPanel;
let bgLayer, charSprite;
let messageQueue = [];
let isWaitingForOption = false;
let currentSceneCallback = null; // 当队列清空后要执行的回调（如结束场景）

export function initUI() {
    storyDiv = document.getElementById('storyText');
    optionsDiv = document.getElementById('optionsArea');
    nextDiv = document.getElementById('nextArea');
    statsPanel = document.getElementById('statsPanel');
    bgLayer = document.getElementById('bgLayer');
    charSprite = document.getElementById('charSprite');
    
    // 创建“继续”按钮区域
    if (!nextDiv) {
        const container = document.querySelector('.game-container');
        const nextArea = document.createElement('div');
        nextArea.id = 'nextArea';
        nextArea.className = 'next-area';
        nextArea.innerHTML = '<button class="next-button" id="nextButton">▼ 继续 ▼</button>';
        container.appendChild(nextArea);
        nextDiv = nextArea;
    }
    document.getElementById('nextButton')?.addEventListener('click', () => {
        if (!isWaitingForOption && messageQueue.length === 0 && !storyEngine.isProcessing) {
            // 如果队列空且不在选项等待，尝试推进剧情（例如序章的第一条消息已经显示完毕）
            storyEngine.advance();
        } else if (!isWaitingForOption && messageQueue.length > 0) {
            displayNextMessage();
        }
    });
    
    updateStatsDisplay();
}

// 显示下一条消息
function displayNextMessage() {
    if (isWaitingForOption) return;
    if (messageQueue.length === 0) {
        // 队列空：如果还有后续剧情，调用 storyEngine 的推进方法
        if (!storyEngine.isProcessing) {
            storyEngine.advance();
        }
        return;
    }
    const msg = messageQueue.shift();
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message-item';
    if (msg.speaker) {
        const nameSpan = document.createElement('div');
        nameSpan.className = 'dialog-name';
        nameSpan.innerText = `🎭 ${msg.speaker}`;
        msgDiv.appendChild(nameSpan);
    }
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = msg.html; // 支持HTML
    msgDiv.appendChild(contentDiv);
    storyDiv.appendChild(msgDiv);
    // 自动滚动到底部
    const storyArea = document.getElementById('storyArea');
    if (storyArea) storyArea.scrollTop = storyArea.scrollHeight;
}

// 外部调用：添加一条消息到队列（可批量）
export function addToStory(html, speaker = "") {
    messageQueue.push({ html, speaker });
    // 如果当前没有在显示且没有等待选项，立即开始显示
    if (!isWaitingForOption && storyDiv && messageQueue.length === 1) {
        displayNextMessage();
    }
}

// 批量添加（用于初始多个消息）
export function addMultipleMessages(messages) {
    messages.forEach(m => messageQueue.push(m));
    if (!isWaitingForOption && messageQueue.length > 0 && storyDiv) {
        displayNextMessage();
    }
}

// 清空所有未显示的消息（用于场景切换）
export function clearMessageQueue() {
    messageQueue = [];
}

// 选项相关
export function clearOptions() {
    optionsDiv.innerHTML = "";
}

export function setOptions(buttons) {
    isWaitingForOption = true;
    clearOptions();
    buttons.forEach(btn => {
        const buttonEl = document.createElement("button");
        buttonEl.innerText = btn.label;
        buttonEl.onclick = () => {
            // 用户选择后，隐藏选项区域，恢复等待
            clearOptions();
            isWaitingForOption = false;
            if (btn.action) btn.action();
            // 选择后可能立即有新的消息队列，开始显示
            if (messageQueue.length > 0) displayNextMessage();
            else storyEngine.advance(); // 触发下一步
        };
        optionsDiv.appendChild(buttonEl);
    });
}

// 隐藏选项（用于某些情况）
export function hideOptions() {
    clearOptions();
    isWaitingForOption = false;
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
        <div class="stat">⚡ 文脉能量 <span class="stat-value">${s.energy}</span></div>
        <div class="stat">⏳ 倒计时 <span class="stat-value">${s.daysLeft}天</span></div>
        <div class="stat">🎭 改革信心 <span class="stat-value">${s.reformConfidence}</span></div>
        <div class="stat">🤝 羁绊值 <span class="stat-value">${s.totalBond}</span></div>
        <div class="stat">📖 行动力 <span class="stat-value">${s.actionPoints}</span></div>
    `;
}

// 消耗行动点并返回第一幕菜单（需要调用 storyEngine.showAct1Menu）
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