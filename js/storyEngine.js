import { gameState } from './gameState.js';
import { addToStory, setOptions, updateStatsDisplay, setBackground, setCharacter, reduceActionAndReturnToAct1, clearMessageQueue, setSceneEndCallback, hideOptions } from './ui.js';
import { sceneYuan, sceneBan, sceneChun, sceneQin } from './scenes.js';

export const storyEngine = {
    startPrologue() {
        setBackground('backstage');
        setCharacter(null, false);

        // 详细开头（可自行扩充）
        addToStory("【序幕：时空错位】", "");
        addToStory("公元2024年，你是一名越剧研究者，正在上海图书馆查阅1942年的《越剧日报》微缩胶卷。", "");
        addToStory("泛黄的报纸上，一行刺眼标题映入眼帘：「越剧危机深重，名角袁雪芬改革受阻，戏班濒临解散」。", "");
        addToStory("你叹息一声，指尖轻触屏幕，突然一股电流从胶卷阅读器传来——", "");
        addToStory("白光炸裂，耳边是嘈杂的锣鼓声和倒彩声……", "");
        addToStory("你猛地睁开眼，霉味、旧木头与劣质胭脂香扑鼻而来。", "");
        addToStory("破旧的戏箱、斑驳的柱子上贴着「永兴戏班」的红纸。", "");
        addToStory("一个半透明的古风界面浮现在眼前：", "系统");
        addToStory("「文脉守护系统 已激活」", "系统");
        addToStory("「宿主：戏曲研究者」", "系统");
        addToStory("「当前时空：1942年·上海·永兴戏班后场」", "系统");
        addToStory("「主线任务：阻止永兴戏班倒闭，确保越剧改革成功」", "系统");
        addToStory("「倒计时：7天」", "系统");
        addToStory("「奖励：返回现代并获得完整历史记忆」", "系统");
        addToStory("你站起身，发现身上穿着粗布长衫，口袋里有一枚「文脉能量符」。", "");
        addToStory("帘子一掀，一个精瘦的中年男人走进来，上下打量你：", "周班主");
        addToStory("「你是新来的写戏先生？会写新戏吗？」", "周班主");
        addToStory("「留下，包吃住没工钱。三天写不出新戏，滚蛋！」", "周班主");
        addToStory("你正要解释，系统弹出提示：", "系统");
        addToStory("「接受使命，成为戏班编剧，七日内推动《祥林嫂》新戏上演。」", "系统");

        setSceneEndCallback(() => {
            setOptions([{ label: "📜 接受使命，开始七日守护", action: () => {
                addToStory("你深吸一口气，抱拳：「定不辱命。」", "主角");
                addToStory("系统图标缩为印章烙在手心，第一幕开启。", "文脉");
                gameState.update({ actPhase: "act1" });
                updateStatsDisplay();
                this.showAct1Menu();
            }}]);
        });
    },

    showAct1Menu() {
        if (gameState.state.actPhase !== "act1") return;
        clearMessageQueue();
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
        setSceneEndCallback(() => { this.debateRound1(); });
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
        setSceneEndCallback(() => {
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
        });
    },

    debateRound3() {
        addToStory("袁雪芬请求全班子配合，老琴师仍担心唱腔。", "袁雪芬");
        setSceneEndCallback(() => {
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
        });
    },

    finishDebate() {
        addToStory("小春主动帮忙，班主难得一笑。辩论落幕。", "小春");
        if (gameState.state.reformConfidence >= 70) {
            addToStory("✅ 改革信心达标，众人决心一搏！进入【破局之夜】", "系统");
        } else {
            addToStory(`⚠️ 当前信心${gameState.state.reformConfidence}未达70，但勉强推进。`, "系统");
        }
        setSceneEndCallback(() => { this.startNightChoice(); });
    },

    startNightChoice() {
        gameState.update({ actPhase: "nightChoice" });
        setBackground('instrument');
        setCharacter(null, false);
        addToStory("夜深油灯如豆。系统警告剩余能量"+gameState.state.energy+"，倒计时剩1天22小时。最后完成一件要事：", "深夜后台");
        setSceneEndCallback(() => {
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
        });
    },

    afterNightChoice() {
        setBackground('stage');
        addToStory("你念出祥林嫂最后唱词……众人落泪。老琴师拉起新过门，班主烟斗落地：「赌这一把！」", "奇迹");
        gameState.modify('reformConfidence', 5);
        if (gameState.state.xiaochunProgress === 100 && gameState.state.qinshiProgress === 100) gameState.modify('reformConfidence', 5);
        updateStatsDisplay();
        addToStory("新戏上演！台下抽泣声如潮，掌声雷动。改革大获成功！", "祥林嫂·首演");
        setSceneEndCallback(() => { this.evaluateEnding(); });
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
        // 成功结局后，展示人物卡
        this.showCharacterProfiles(() => {
            setOptions([{label: "领取传承证书", action: () => {
                addToStory("🏮 文脉守护者证书：跨越时空，为传统续命。感谢您。🏮", "落幕");
                setOptions([{label: "结束旅程", action: () => {}}]);
            }}]);
        });
    },

    // 人物卡展示函数
    showCharacterProfiles(onComplete) {
        const profiles = [
            {
                name: "袁雪芬",
                role: "越剧改革先驱",
                原型简介: "袁雪芬（1922-2011），越剧袁派创始人，1942年起在上海率先推动越剧改革，将鲁迅小说《祝福》改编为《祥林嫂》，开创越剧现代戏先河。",
                故事: "她不顾守旧势力的反对，坚持‘越剧应该反映现实，唤醒民众’。在抗战时期，她以《祥林嫂》控诉封建礼教，连演30余场，场场爆满，被誉为‘越剧的鲁迅’。",
                精神: "「真正的艺术，必须与时代共振。」"
            },
            {
                name: "周班主",
                role: "戏班班主（原型：姚水娟等戏班经营者）",
                原型简介: "1940年代上海越剧戏班班主多为从艺者转型，他们既要维持生计，又要守护艺术。典型代表如姚水娟的班主王锦云，曾冒险支持《祥林嫂》排演。",
                故事: "在战乱年代，班主们常负债经营，甚至变卖家产供戏班演出。他们是最早的‘文脉守护者’，用肩膀扛起了越剧的生存。",
                精神: "「戏可以赔钱，但不能断了根。」"
            },
            {
                name: "老琴师",
                role: "越剧琴师（原型：周宝财等）",
                原型简介: "周宝财（1900-1965），越剧主胡革新者，首创‘过门’托腔技法，使越剧唱腔更具表现力。他曾在《祥林嫂》中设计出催人泪下的悲调。",
                故事: "老琴师们口传心授，记下数百首传统曲牌。他们反对的不是改革，而是粗暴的割裂。周宝财曾说：‘要改，但要留住魂。’",
                精神: "「琴弦不断，血脉不绝。」"
            },
            {
                name: "小春",
                role: "戏班学徒（原型：无数越剧演员的童年）",
                原型简介: "旧社会学徒大多出身贫苦，七八岁便被送入戏班，签‘生死契’，挨打挨骂是常事。但正是这些孩子，后来成为越剧的中坚力量。",
                故事: "如袁雪芬11岁学艺，傅全香9岁入科班。他们从识字开始，一步步成为流派宗师。小春象征着未来的希望。",
                精神: "「每一滴泪，都会浇灌出花朵。」"
            }
        ];
        
        let index = 0;
        const showNext = () => {
            if (index >= profiles.length) {
                if (onComplete) onComplete();
                return;
            }
            const p = profiles[index];
            addToStory(`【人物卡 · ${p.name}】<br><strong>${p.role}</strong><br>${p.原型简介}<br><br>${p.故事}<br><br><em>“${p.精神}”</em>`, "文脉系统");
            setSceneEndCallback(() => {
                index++;
                showNext();
            });
        };
        showNext();
    }
};