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

    // 主角立绘样式修正：底部对齐，无黑边
    if (charSpriteLeft) {
        charSpriteLeft.style.display = 'block';
        charSpriteLeft.style.verticalAlign = 'bottom';
        charSpriteLeft.style.background = 'transparent';
    }
    if (charSpriteRight) {
        charSpriteRight.style.display = 'none';
        charSpriteRight.style.verticalAlign = 'bottom';
        charSpriteRight.style.background = 'transparent';
    }

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

// 控制右侧立绘（对话角色），确保底部对齐和无背景
export function setCharacter(charName, visible = true) {
    if (!charSpriteRight) return;
    if (visible && charName) {
        charSpriteRight.src = `assets/char/${charName}.png`;
        charSpriteRight.style.display = 'block';
        charSpriteRight.style.verticalAlign = 'bottom';
        charSpriteRight.style.background = 'transparent';
        // 图片加载后再次确保样式
        charSpriteRight.onload = () => {
            charSpriteRight.style.verticalAlign = 'bottom';
        };
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
        <div class="stat">能量 ${s.energy}</div>
        <div class="stat">剩余 ${s.daysLeft}天</div>
        <div class="stat">信心 ${s.reformFaith}</div>
        <div class="stat">琴师 ${s.qinshiProgress}</div>
        <div class="stat">小春 ${s.xiaochunProgress}</div>
        <div class="stat">羁绊 ${s.bond}</div>
    `;
}
// 角色卡片数据
const characterCards = [
    {
        name: "袁雪芬",
        img: "assets/char/yuan_xuefen.png",
        desc: `<strong>越剧改革先驱 · 袁派创始人</strong><br>
               1922-2011，浙江嵊州人。1942年，她顶着巨大压力排演《祥林嫂》，连演30场，场场爆满。<br>
               她曾说：“越剧要活，就得呼吸时代的空气。”她将话剧、电影的表现手法融入越剧，使原本以才子佳人为主的越剧开始关注社会现实。<br>
               袁雪芬一生清贫，却为越剧留下了《梁山伯与祝英台》《西厢记》等不朽经典，被誉为“越剧皇后”。`
    },
    {
        name: "周班主（原型）",
        img: "assets/char/zhou_banzhu.png",
        desc: `<strong>旧社会班主 · 最早的文脉守护者</strong><br>
               原型为姚水娟等戏班经营者。他们扛着几十口人的生计，变卖家产、低声下气，只为让戏班活下去。<br>
               在那个战火纷飞的年代，班主们不仅要应对苛捐杂税，还要提防军阀流氓的勒索。他们是最早的改革支持者，因为没有他们，再好的戏也没有舞台。<br>
               “戏可以赔钱，但不能断了根”——这是他们最朴素的信念。`
    },
    {
        name: "老琴师（原型）",
        img: "assets/char/old_qinshi.png",
        desc: `<strong>越剧主胡革新者 · 琴弦不断血脉不绝</strong><br>
               原型为周宝财等琴师。他首创“过门托腔”技法，让唱腔更有骨血；他记下数百首濒临失传的曲牌，用琴声为改革铺路。<br>
               老琴师们是幕后英雄，没有他们的伴奏，再好的唱腔也黯然失色。他们固执地守护传统，却也愿意为创新尝试新的过门。<br>
               一根琴弦，连着百年的越剧魂。`
    },
    {
        name: "小春（原型）",
        img: "assets/char/xiaochun.png",
        desc: `<strong>旧社会学徒 · 未来的希望</strong><br>
               七八岁签下生死契，挨打挨骂，从识字开始，一步步成为流派宗师。小春是所有越剧演员童年的缩影。<br>
               他们凌晨四点半起床练功，晚上十一二点才能休息，稍有差错便是棍棒加身。但正是这种严苛的训练，练就了一身绝艺。<br>
               每一滴泪，都会浇灌出花朵。小春们后来成为了尹桂芳、范瑞娟、傅全香……撑起了越剧的半壁江山。`
    }
];

export function showCharacterCards(onComplete) {
    let currentIndex = 0;
    const modal = document.createElement('div');
    modal.className = 'card-modal';
    
    function showCard(index) {
        if (index >= characterCards.length) {
            modal.remove();
            if (onComplete) onComplete();
            return;
        }
        const card = characterCards[index];
        modal.innerHTML = `
            <div class="card-container">
                <img class="card-avatar" src="${card.img}" alt="${card.name}" onerror="this.src='assets/char/protagonist.png'">
                <div class="card-name">${card.name}</div>
                <div class="card-desc">${card.desc}</div>
                <button class="card-next">${index === characterCards.length-1 ? '完成' : '下一张'}</button>
                <div class="card-index">${index+1} / ${characterCards.length}</div>
            </div>
        `;
        const nextBtn = modal.querySelector('.card-next');
        nextBtn.addEventListener('click', () => showCard(index + 1));
    }
    
    document.body.appendChild(modal);
    showCard(0);
}