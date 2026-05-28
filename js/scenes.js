import { gameState } from './gameState.js';
import { setBackground, setCharacter, addToStory, setOptions, updateStatsDisplay, reduceActionAndReturnToAct1 } from './ui.js';

// 袁雪芬场景
export function sceneYuan() {
    setBackground('rehearsal');
    setCharacter('yuan', true);
    if (gameState.state.sceneDone.yuan) {
        addToStory("袁雪芬正在排戏，见你微笑点头：「你来了，一起讨论下祥林嫂的身段吧。」", "袁雪芬");
        if (gameState.state.reformConfidence < 100) gameState.modify('reformConfidence', 5);
        gameState.modify('totalBond', 2);
        updateStatsDisplay();
        reduceActionAndReturnToAct1();
        return;
    }
    addToStory("排练厅里袁雪芬独自练唱，眉间忧愁：「这出《梁祝》演了千百遍，观众越来越少……我想改，可班主和琴师都不支持。」", "袁雪芬");
    setOptions([
        { label: "✨ 使用系统·改革蓝图 (消耗5能量)", action: () => {
            if (gameState.consumeEnergy(5)) {
                addToStory("你展示现代越剧改革案例，袁雪芬眼前一亮，改革信心+15，羁绊+10。", "系统");
                gameState.modify('reformConfidence', 15);
                gameState.modify('totalBond', 10);
                gameState.modify('sceneDone', { yuan: true });
                updateStatsDisplay();
                reduceActionAndReturnToAct1();
            } else {
                addToStory("能量不足，无法使用系统。", "提示");
                reduceActionAndReturnToAct1();
            }
        }},
        { label: "🎭 用古典戏曲理论分析", action: () => {
            addToStory("你从《琵琶记》谈到《桃花扇》，袁雪芬深受启发，改革信心+8，羁绊+5。", "主角");
            gameState.modify('reformConfidence', 8);
            gameState.modify('totalBond', 5);
            gameState.modify('sceneDone', { yuan: true });
            updateStatsDisplay();
            reduceActionAndReturnToAct1();
        }}
    ]);
}

// 周班主场景
export function sceneBan() {
    setBackground('account');
    setCharacter('ban', true);
    if (gameState.state.sceneDone.ban) {
        addToStory("周班主拨着算盘：「资金虽然紧，但有你操持新戏，我心里踏实些。」", "周班主");
        if (gameState.state.reformConfidence < 100) gameState.modify('reformConfidence', 3);
        gameState.modify('totalBond', 2);
        updateStatsDisplay();
        reduceActionAndReturnToAct1();
        return;
    }
    addToStory("账房里周班主愁眉苦脸：「这个月票房还不够付房租，新戏行头一件也添不起……要不还是演老戏吧？」", "周班主");
    setOptions([
        { label: "✨ 使用系统·低成本舞美方案 (消耗8能量)", action: () => {
            if (gameState.consumeEnergy(8)) {
                addToStory("你展示用旧幕布改造成雪景的方案，班主大喜，改革信心+15，羁绊+10。", "系统");
                gameState.modify('reformConfidence', 15);
                gameState.modify('totalBond', 10);
                gameState.modify('sceneDone', { ban: true });
                updateStatsDisplay();
                reduceActionAndReturnToAct1();
            } else {
                addToStory("能量不足，无法使用系统。", "提示");
                reduceActionAndReturnToAct1();
            }
        }},
        { label: "📊 游说商人赞助", action: () => {
            addToStory("你提出找本地商会拉赞助，班主决定一试，改革信心+5，羁绊+3。", "主角");
            gameState.modify('reformConfidence', 5);
            gameState.modify('totalBond', 3);
            gameState.modify('sceneDone', { ban: true });
            updateStatsDisplay();
            reduceActionAndReturnToAct1();
        }}
    ]);
}

// 小春场景
export function sceneChun() {
    setBackground('backstage');
    setCharacter('chun', true);
    if (gameState.state.sceneDone.chun) {
        addToStory("小春在后台认真认字，高兴道：「先生，我昨天学会六个字了！」", "小春");
        if (gameState.state.xiaochunProgress < 100) gameState.modify('xiaochunProgress', 10);
        gameState.modify('totalBond', 3);
        updateStatsDisplay();
        reduceActionAndReturnToAct1();
        return;
    }
    addToStory("后台角落，小春蹲在戏箱后抹泪，被骂「烂泥」，连「戲」字都认不全。", "小春");
    setOptions([
        { label: "✨ 使用系统现代识字法 (消耗5能量)", action: () => {
            if (gameState.consumeEnergy(5)) {
                addToStory("你将「戲」拆解，小春瞬间记住，支线任务进度+60%。", "创新教学");
                gameState.modify('xiaochunProgress', 60);
                gameState.modify('totalBond', 10);
                if (gameState.state.xiaochunProgress >= 100) addToStory("小春激动：「我给您打洗脚水！」认字支线完成！", "小春");
                gameState.modify('sceneDone', { chun: true });
                updateStatsDisplay();
                reduceActionAndReturnToAct1();
            } else {
                addToStory("能量不足，无法使用系统。", "提示");
                reduceActionAndReturnToAct1();
            }
        }},
        { label: "📖 手把手耐心教学", action: () => {
            addToStory("你耐心教他念「戏」字，小春很用心。羁绊+5", "主角");
            gameState.modify('xiaochunProgress', 15);
            gameState.modify('totalBond', 5);
            gameState.modify('sceneDone', { chun: true });
            updateStatsDisplay();
            reduceActionAndReturnToAct1();
        }}
    ]);
}

// 老琴师场景
export function sceneQin() {
    setBackground('instrument');
    setCharacter('qin', true);
    if (gameState.state.sceneDone.qin) {
        addToStory("老琴师正擦拭胡琴，见你来递过一杯茶：「上次记的谱我核对过，一字不差。」", "老琴师");
        if (gameState.state.qinshiProgress < 100) gameState.modify('qinshiProgress', 15);
        gameState.modify('totalBond', 3);
        updateStatsDisplay();
        reduceActionAndReturnToAct1();
        return;
    }
    addToStory("琴师房传来苍凉琴声，突然断弦。老琴师叹息百年调子或断绝，反对改腔。", "老琴师");
    setOptions([
        { label: "✨ 系统·简谱记谱法 (消耗10能量)", action: () => {
            if (gameState.consumeEnergy(10)) {
                addToStory("你展示简谱，老琴师震惊，愿让你记谱。支线完成度大增，羁绊+15。", "现代乐理");
                gameState.modify('qinshiProgress', 70);
                gameState.modify('totalBond', 15);
                addToStory("老琴师拿出师父手抄曲谱：「七个徒弟都跑了，这个给你。」", "老琴师");
                gameState.modify('sceneDone', { qin: true });
                updateStatsDisplay();
                reduceActionAndReturnToAct1();
            } else {
                addToStory("能量不足，无法使用系统。", "提示");
                reduceActionAndReturnToAct1();
            }
        }},
        { label: "🎻 用心记调子，回去默写", action: () => {
            addToStory("你表示能默记下，老琴师感动于你的真诚，羁绊+5。", "主角");
            gameState.modify('qinshiProgress', 20);
            gameState.modify('totalBond', 5);
            gameState.modify('sceneDone', { qin: true });
            updateStatsDisplay();
            reduceActionAndReturnToAct1();
        }}
    ]);
}