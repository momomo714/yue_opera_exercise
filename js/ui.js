import { gameState } from './gameState.js';
import { storyEngine } from './storyEngine.js';

let storyDiv, optionsDiv, statsPanel;
let bgLayer, charSprite;

export function initUI() {
    storyDiv = document.getElementById('storyText');
    optionsDiv = document.getElementById('optionsArea');
    statsPanel = document.getElementById('statsPanel');
    bgLayer = document.getElementById('bgLayer');
    charSprite = document.getElementById('charSprite');
    updateStatsDisplay();
}

// 切换背景
export function setBackground(bgName) {
    if (!bgLayer) return;
    bgLayer.style.backgroundImage = `url('images/bg/${bgName}.jpg')`;
    bgLayer.style.backgroundSize = 'cover';
    bgLayer.style.backgroundPosition = 'center';
}

// 显示/隐藏立绘
export function setCharacter(charName, visible = true) {
    if (!charSprite) return;
    if (visible && charName) {
        charSprite.src = `images/char/${charName}.png`;
        charSprite.style.display = 'block';
    } else {
        charSprite.style.display = 'none';
    }
}

export function addToStory(html, speaker = "") {
    const speakerHtml = speaker ? `<div class="dialog-name">🎭 ${speaker}</div>` : "";
    const newBlock = speakerHtml + `<div>${html}</div><hr style="margin:8px 0; opacity:0.3;">`;
    storyDiv.innerHTML += newBlock;
    storyDiv.scrollIntoView({ behavior: "smooth", block: "end" });
}

export function clearOptions() {
    if (optionsDiv) optionsDiv.innerHTML = "";
}

export function setOptions(buttons) {
    clearOptions();
    buttons.forEach(btn => {
        const buttonEl = document.createElement("button");
        buttonEl.innerText = btn.label;
        buttonEl.onclick = () => {
            if (btn.action) btn.action();
        };
        optionsDiv.appendChild(buttonEl);
    });
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

// 核心修复函数：消耗行动点并刷新UI，行动点为0时自动推进剧情
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