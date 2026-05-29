import { gameState } from './gameState.js';
import { addToStory, setOptions, updateStatsDisplay, setBackground, setCharacter, reduceActionAndReturnToAct1, clearMessageQueue, hideOptions } from './ui.js';
import { sceneYuan, sceneBan, sceneChun, sceneQin } from './scenes.js';

export const storyEngine = {
    isProcessing: false, // 是否正在等待队列推进
    currentAct: null,

    startPrologue() {
        this.isProcessing = true;
        setBackground('backstage');
        setCharacter(null, false);
        // 使用队列添加序幕消息
        addToStory("【序幕：坠落与苏醒】<br>你在微缩胶卷阅读器前翻阅1942年《越剧日报》，一行刺眼标题：「越剧危机深重，名角袁雪芬改革受阻」。指尖刺痛，白光炸裂……", "");
        addToStory("睁开眼，霉味、旧木头与胭脂香。半透明界面弹出古风边框：", "系统");
        addToStory("> 【文脉守护系统 已激活】<br>> 宿主：戏曲研究者<br>> 当前时空：1942年·上海·永兴戏班后场<br>> 主线任务：阻止永兴戏班倒闭，确保新越剧改革成功。<br>> 倒计时：7天 0小时<br>> 奖励：返回现代+永久记忆<br>> 当前能量：100/100", "系统提示");
        addToStory("班主掀帘而入，上下打量：「你会写新戏？留下，包吃住没工钱。三天写不出滚蛋！」", "周班主");
        // 最后显示选项，需要在所有消息显示完后才能出现。由于队列异步，我们延迟添加选项
        setTimeout(() => {
            if (!this.isProcessing) return;
            setOptions([{ label: "📜 接受使命，开始七日守护", action: () => {
                addToStory("你默念「接受」，系统图标缩为印章。第一幕开启。", "文脉");
                gameState.update({ actPhase: "act1" });
                updateStatsDisplay();
                this.showAct1Menu();
                this.isProcessing = true;
            }}]);
        }, 100);
    },

    showAct1Menu() {
        if (gameState.state.actPhase !== "act1") return;
        clearMessageQueue(); // 清空未显示的旧消息（如果有）
        addToStory(`<span style="background:#e9dbc9; padding:2px 8px;">📜 第一幕 · 三日奔走 (剩余行动点 ${gameState.state.actionPoints})</span>`, "");
        const btns = [
            { label: "🎭 排练厅 · 袁雪芬", action: () => { this.callScene(sceneYuan); } },
            { label: "📊 账房 · 周班主", action: () => { this.callScene(sceneBan); } },
            { label: "🧒 后台 · 小春", action: () => { this.callScene(sceneChun); } },
            { label: "🎻 琴师房 · 老琴师", action: () => { this.callScene(sceneQin); } },
            { label: "⏩ 推进剧情 (跳过剩余行动)", action: () => {
                addToStory("你决定不再奔走，直接面对戏班困境。", "主角");
                this.triggerEndOfAct1();
            }}
        ];
        setOptions(btns);
    },

    callScene(sceneFn) {
        // 场景函数内部会调用 addToStory 和 setOptions，我们只需重置状态
        this.isProcessing = true;
        sceneFn();
    },

    triggerEndOfAct1() {
        if (gameState.state.actPhase !== "act1") return;
        gameState.update({ actPhase: "debate", daysLeft: 4 });
        updateStatsDisplay();
        addToStory("三天匆匆……班主召集所有人：「剧院给了最后期限，五天后再没有新戏，全部滚蛋！」全场死寂。", "班主");
        this.startDebate();
    },

    startDebate() {
        setBackground('meeting');
        setCharacter(null, false);
        addToStory("议事厅内，你呈上《祥林嫂》提纲。老琴师拍桌反对。", "场景");
        this.debateRound1();
    },

    debateRound1() {
        setOptions([
            { label: "📜 不用系统：梁祝也是悲剧，观众哭完照样鼓掌", action: () => {
                addToStory("你辩驳，老琴师冷哼:「太苦了！」", "主角");
                updateStatsDisplay();
                this.debateRound2();
            }},
            { label: "✨ 使用系统（10能量）展示越剧唱腔演变图", action: () => {
                if (gameState.consumeEnergy(10)) {
                    addToStory("你展示演变图，老琴师动摇，改革信心+10，羁绊+15。", "系统卡片");
                    gameState.modify('reformConfidence', 10);
                    gameState.modify('totalBond', 15);
                    updateStatsDisplay();
                    this.debateRound2();
                } else {
                    addToStory("能量不足，无法使用系统。", "提示");
                    this.debateRound2();
                }
            }}
        ]);
    },

    debateRound2() {
        addToStory("班主敲烟斗：「没钱添新行头！」", "班主");
        setOptions([
            { label: "🎭 无系统：祥林嫂就一件破棉袄，旧戏服改", action: () => {
                addToStory("班主迟疑但觉可行，信心+5。", "主角");
                gameState.modify('reformConfidence', 5);
                updateStatsDisplay();
                this.debateRound3();
            }},
            { label: "✨ 使用系统（10能量）展示低成本高票房案例", action: () => {
                if (gameState.consumeEnergy(10)) {
                    addToStory("展示历史数据，班主惊愕，信心+15。", "系统");
                    gameState.modify('reformConfidence', 15);
                    updateStatsDisplay();
                    this.debateRound3();
                } else {
                    addToStory("能量不足，无法使用系统。", "提示");
                    this.debateRound3();
                }
            }}
        ]);
    },

    debateRound3() {
        addToStory("袁雪芬请求全班子配合，老琴师仍担心唱腔。", "袁雪芬");
        setOptions([
            { label: "🎻 无系统：保留老腔，关键唱段加过门", action: () => {
                addToStory("老琴师没有强烈反对，羁绊+5。", "主角");
                gameState.modify('totalBond', 5);
                updateStatsDisplay();
                this.finishDebate();
            }},
            { label: "✨ 使用系统（10能量）展示周宝财改革故事", action: () => {
                if (gameState.consumeEnergy(10)) {
                    addToStory("讲述琴师周宝财故事，老琴师动容：「我回去试试。」信心+10，羁绊+15。", "系统");
                    gameState.modify('reformConfidence', 10);
                    gameState.modify('totalBond', 15);
                    updateStatsDisplay();
                    this.finishDebate();
                } else {
                    addToStory("能量不足，无法使用系统。", "提示");
                    this.finishDebate();
                }
            }}
        ]);
    },

    finishDebate() {
        addToStory("小春主动帮忙，班主难得一笑。辩论落幕。", "小春");
        if (gameState.state.reformConfidence >= 70) {
            addToStory("✅ 改革信心达标，众人决心一搏！进入【破局之夜】", "系统");
        } else {
            addToStory(`⚠️ 当前信心${gameState.state.reformConfidence}未达70，但勉强推进。`, "系统");
        }
        this.startNightChoice();
    },

    startNightChoice() {
        gameState.update({ actPhase: "nightChoice" });
        setBackground('instrument');
        setCharacter(null, false);
        addToStory("夜深油灯如豆。系统警告剩余能量"+gameState.state.energy+"，倒计时剩1天22小时。最后完成一件要事：", "深夜后台");
        setOptions([
            { label: "📖 教小春最后5个字（+10能量）", action: () => {
                if (gameState.state.xiaochunProgress >= 100) {
                    addToStory("小春早已学完，但仍感动。能量+5。", "小春");
                    gameState.modify('energy', 5);
                } else {
                    gameState.modify('xiaochunProgress', 100);
                    gameState.modify('energy', 10);
                    gameState.modify('totalBond', 10);
                    addToStory("你教「文脉不死」，小春眼眶湿润。支线圆满完成。", "小春");
                }
                updateStatsDisplay();
                this.afterNightChoice();
            }},
            { label: "🎵 帮老琴师记录最后一段曲谱（+10能量）", action: () => {
                if (gameState.state.qinshiProgress >= 100) {
                    addToStory("老琴师欣慰一笑，能量+5。", "老琴师");
                    gameState.modify('energy', 5);
                } else {
                    gameState.modify('qinshiProgress', 100);
                    gameState.modify('energy', 10);
                    gameState.modify('totalBond', 15);
                    addToStory("你记下师父绝笔，解锁隐藏曲谱。", "老琴师");
                }
                updateStatsDisplay();
                this.afterNightChoice();
            }}
        ]);
    },

    afterNightChoice() {
        setBackground('stage');
        addToStory("你念出祥林嫂最后唱词……众人落泪。老琴师拉起新过门，班主烟斗落地：「赌这一把！」", "奇迹");
        gameState.modify('reformConfidence', 5);
        if (gameState.state.xiaochunProgress === 100 && gameState.state.qinshiProgress === 100) gameState.modify('reformConfidence', 5);
        updateStatsDisplay();
        addToStory("新戏上演！台下抽泣声如潮，掌声雷动。改革大获成功！", "祥林嫂·首演");
        this.evaluateEnding();
    },

    evaluateEnding() {
        const s = gameState.state;
        if (s.reformConfidence >= 80 && s.energy >= 30 && s.xiaochunProgress >= 100 && s.qinshiProgress >= 100) {
            addToStory("✨ 完美结局 ✨<br>戏班永远有你一把椅子。文脉永续。", "文脉系统");
        } else if (s.reformConfidence >= 70) {
            addToStory("🎉 成功结局 🎉<br>手抄剧本与合影回到现代，历史改写。", "落幕");
        } else if (s.reformConfidence >= 60) {
            addToStory("🍂 勉强成功 🍂<br>班主叹息：「下次不要这么冒险了。」", "落幕");
        } else {
            addToStory("❌ 任务失败：戏班解散，你困在1942年，风雪中梁祝声渐远……", "悲鸣");
            setOptions([{label: "重开戏梦", action: () => location.reload()}]);
            return;
        }
        setOptions([{label: "领取传承证书", action: () => {
            addToStory("🏮 文脉守护者证书：跨越时空，为传统续命。感谢您。🏮", "落幕");
            setOptions([{label: "结束旅程", action: () => {}}]);
        }}]);
    },

    // 用于外部调用推进（当队列空且不在选项时）
    advance() {
        // 这个方法主要是为了点击“继续”时可能触发某些自动剧情，目前暂不需要额外操作
        if (this.currentAct === 'prologue' && !this.isProcessing) {
            // 如果序章已完成且没有下一步，不做任何事
        }
    }
};