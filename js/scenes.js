import { addToStory, setOptions, setSceneEndCallback, setBackground, setCharacter, clearMessageQueue } from './ui.js';
import { getGameState, modifyState, advanceDay, calculateEnding } from './gameState.js';
import { storyEngine } from './storyEngine.js';

export const scenes = {};

// 辅助函数：等待后跳转
function waitAndGo(nextSceneId) {
    setSceneEndCallback(() => storyEngine.gotoScene(nextSceneId));
}

// ======================= 第一天 · 穿越惊愕（慢节奏沉浸） =======================
scenes.day1_start = () => {
    clearMessageQueue();
    setBackground('backstage');
    setCharacter(null, false);
    addToStory("霉味、旧木头、劣质胭脂香混合在一起，钻进鼻腔。", "", null, 'backstage');
    addToStory("破旧的戏箱堆在墙角，柱子上贴着褪色的红纸——「永兴戏班」。", "");
    addToStory("意识渐渐苏醒……我这是在哪？", "内心");
    addToStory("头好晕，像是被人从深水里捞起来。", "内心");
    addToStory("忽然，眼前浮现半透明的古风界面，流光溢彩。", "系统");
    addToStory("「文脉守护系统 已激活」<br>「宿主：越剧研究者」<br>「当前时空：1942年·上海·永兴戏班后场」<br>「主线任务：阻止戏班倒闭，推动越剧改革」<br>「倒计时：7天」", "系统");
    addToStory("1942年？我……穿越了？这怎么可能。", "内心");
    addToStory("你使劲掐了掐手臂——疼。真实的疼痛。", "");
    addToStory("帘子猛地掀开，一个精瘦的中年男人走进来，穿着洗得发白的蓝布长衫，眼袋很深，手里夹着半截烟卷。", "");
    setCharacter('zhou_banzhu');
    addToStory("你是新来的写戏先生？", "周班主");
    addToStory("我愣了一下，还没来得及回答。", "内心");
    addToStory("前一个先生跑了，留了半本烂账。你会写新戏吧？", "周班主");
    addToStory("他把我当成了别人……但也许，这是留在这里的唯一机会。", "内心");
    addToStory("我点了点头。", "主角");
    addToStory("周班主松了口气，又绷起脸：「留下，包吃住，没工钱。三天写不出新戏——滚蛋！」", "周班主");
    addToStory("他转身要走，到门口又停住：「对了，我叫周德茂。这戏班三十口人，全压在我肩上。」", "周班主");
    addToStory("三十口人……这不是游戏，是活生生的人生。", "内心");
    addToStory("系统：「是否接受使命？」", "系统");
    setSceneEndCallback(() => {
        setOptions([
            { label: "「我接下。不是为了系统，而是为了这群人。」", action: () => {
                modifyState({ reformFaith: 10, bond: 5 });
                addToStory("周班主愣了一下，点点头，眼神里闪过一丝希望。", "周班主");
                addToStory("系统：使命接受，第一幕开启。剩余6天。", "系统");
                waitAndGo('day2_morning');
            } },
            { label: "🌫️ 「我只是想回家...但既然来了，就试试吧。」", action: () => {
                modifyState({ reformFaith: 2 });
                addToStory("周班主哼了一声：「试试就试试，总比没人强。」", "周班主");
                addToStory("系统：使命接受，第一幕开启。", "系统");
                waitAndGo('day2_morning');
            } }
        ]);
    });
};

// ======================= 第二天 · 观察试探 =======================
scenes.day2_morning = () => {
    clearMessageQueue();
    setBackground('rehearsal');
    addToStory("第二天清晨，阳光从后台的破窗斜射进来，灰尘在光柱中飞舞。", "");
    addToStory("走出杂物间，排练厅里有个女人独自练唱。旧戏服裹着挺拔的身段，眉间有化不开的愁。", "");
    setCharacter('yuan_xuefen');
    addToStory("这就是袁雪芬？比照片上更瘦。", "内心");
    addToStory("唱腔忽然中断，她扶着柱子咳嗽了几声。", "");
    addToStory("「袁老板，你还好吗？」", "主角");
    addToStory("她回头，勉强笑了笑：「没事，老毛病。你是新来的写戏先生？」", "袁雪芬");
    addToStory("「嗯，我叫……」<br>「不必说名字。这个戏班，人来人往，能留下的没几个。」", "袁雪芬");
    addToStory("「你会写什么样的戏？」", "袁雪芬");
    addToStory("「我想写一个……能让人哭出来，又能让人站起来的故事。」", "主角");
    addToStory("她眼睛亮了一下，又暗下去：「难。观众爱看才子佳人，可我只想唱点真的东西。」", "袁雪芬");
    addToStory("系统提示：消耗5能量可查看「祥林嫂」故事内核，获得改革灵感。", "系统");
    setSceneEndCallback(() => {
        if (getGameState().energy >= 5) {
            setOptions([
                { label: "消耗5能量，查看资料 → 获得祥林嫂内核，信心+5", action: () => {
                    modifyState({ energy: -5, reformFaith: 5, hasXianglinInspire: true });
                    addToStory("系统载入鲁迅《祝福》：祥林嫂，被封建礼教吞噬的悲剧。这就是袁雪芬要的「真的东西」。", "系统");
                    waitAndGo('day2_qinshi');
                } },
                { label: "先观察，暂不消耗", action: () => { addToStory("你决定先观察，或许更好的时机。", "内心"); waitAndGo('day2_qinshi'); } }
            ]);
        } else {
            addToStory("你决定先倾听。", "系统");
            waitAndGo('day2_qinshi');
        }
    });
};

scenes.day2_qinshi = () => {
    clearMessageQueue();
    setBackground('qinroom');
    addToStory("午后，琴师房传来断续的胡琴声，苍凉、沙哑，像老人在哭。", "");
    setCharacter('old_qinshi');
    addToStory("门半掩，佝偻的老人背对门口，琴弦忽然崩断。", "");
    addToStory("「唉……又断了。」他转过身，满脸皱纹，眼神倔强。", "老琴师");
    addToStory("「你是谁？」", "老琴师");
    addToStory("「新来的写戏先生。」", "主角");
    addToStory("「又来一个糟蹋老调子的！越剧的魂在腔里，改不得！」", "老琴师");
    addToStory("「我听过刚才那段曲子，很动人。是您师父教的吗？」", "主角");
    addToStory("他一愣，沉默片刻：「你……听得懂？」", "老琴师");
    addToStory("「我不懂，但我觉得它不该失传。」", "主角");
    addToStory("老琴师盯着你看了很久，叹了口气：「小子，你和你前面那些不一样。但改腔的事，我死也不会答应。」", "老琴师");
    waitAndGo('day2_xiaochun');
};

scenes.day2_xiaochun = () => {
    clearMessageQueue();
    setBackground('backstage');
    setCharacter('xiaochun');
    addToStory("黄昏，后台角落，小春蹲在戏箱后面，肩膀一抽一抽。", "");
    addToStory("「先生……他们说我笨，连「戲」字都写不好，烂泥扶不上墙……」", "小春");
    setSceneEndCallback(() => {
        setOptions([
            { label: " 蹲下安慰，手把手教他写「戲」字", action: () => {
                modifyState({ xiaochunProgress: 15, bond: 5 });
                addToStory("「你看，「戲」左边是「虚」，右边是「戈」……」小春跟着你一笔一划，渐渐不哭了。", "主角");
                addToStory("「先生，你真好。」", "小春");
                waitAndGo('day2_end');
            } },
            { label: "拍拍肩膀：「哭有什么用？要自己争气。」", action: () => {
                modifyState({ xiaochunProgress: 5, bond: 2 });
                waitAndGo('day2_end');
            } },
            { label: "默默离开", action: () => { waitAndGo('day2_end'); } }
        ]);
    });
};

scenes.day2_end = () => {
    addToStory("第二天结束了。我认识了疲惫的袁雪芬、固执的琴师、扛着三十口人的班主、哭泣的小春。每个人都在挣扎。", "内心");
    addToStory("系统：剩余5天。", "系统");
    addToStory("我要写的戏，叫《祥林嫂》。明天，我要告诉他们。", "内心");
    advanceDay();
    waitAndGo('day3_conflict');
};

// ======================= 第三天 · 冲突碰撞 =======================
scenes.day3_conflict = () => {
    clearMessageQueue();
    setBackground('rehearsal');
    addToStory("排练厅。众人聚集，气氛凝重。", "");
    addToStory("「今天把新戏的架子定下来。先生，你说。」", "周班主");
    addToStory("「我想做的戏，叫《祥林嫂》。一个女人被封建礼教一步步逼死的故事。」", "主角");
    addToStory("老琴师猛地拍桌：「太苦了！观众是来找乐子的！」", "老琴师");
    addToStory("「祥林嫂的悲剧，能让女人觉醒。」", "袁雪芬");
    addToStory("「钱呢？新行头、新布景，都要钱。我现在连房租都快付不起了。」", "周班主");
    setSceneEndCallback(() => {
        setOptions([
            { label: "坚持己见，讲述祥林嫂的力量", action: () => { modifyState({ reformFaith: 5 }); waitAndGo('day3_after'); } },
            { label: "妥协先写折中戏", action: () => { modifyState({ reformFaith: -5 }); waitAndGo('day3_after'); } },
            { label: "消耗10能量展示《红楼梦》改革案例 ", action: () => {
                if (getGameState().energy >= 10) {
                    modifyState({ energy: -10, reformFaith: 10, bond: 5, qinshiProgress: 20 });
                    addToStory("投影出现代越剧《红楼梦》数据，老琴师沉默良久：「让我想想。」", "系统");
                }
                waitAndGo('day3_after');
            } }
        ]);
    });
};

scenes.day3_after = () => {
    addToStory("中午，小春端来热粥：「先生，我偷偷多盛了一勺。」", "小春");
    addToStory("「谢谢你，小春。今天学会了什么字？」「祥字。祥林嫂的祥。」", "主角");
    addToStory("「先生，祥林嫂最后……会好吗？」", "小春");
    addToStory("「她不会好。但她的故事，会让很多人好起来。」", "主角");
    addToStory("傍晚，琴师房。老琴师低声说：「我给你记谱。但不要丢掉老腔的魂。」", "老琴师");
    modifyState({ qinshiProgress: 20, reformFaith: 5, bond: 5 });
    advanceDay();
    waitAndGo('day4_break');
};

// ======================= 第四天 · 磨合破冰 =======================
scenes.day4_break = () => {
    clearMessageQueue();
    setBackground('backstage');
    addToStory("账房算盘噼啪。周班主眉头紧锁：「又赔了。下个月连米都买不起。」", "周班主");
    addToStory("「祥林嫂不需要新行头，一件破棉袄，旧幕布做雪景。」", "主角");
    addToStory("周班主苦笑，拿出泛黄照片：「十年前我在台上翻跟头，满堂彩……战乱摔断腿，再也不能翻。」", "周班主");
    addToStory("「班主，祥林嫂的挣扎和你一样。观众会懂的。」", "主角");
    addToStory("「……我再信一次。你写吧。」", "周班主");
    modifyState({ reformFaith: 10, bond: 10 });
    addToStory("黄昏，袁雪芬对镜卸妆：「谢谢你带来希望。祥林嫂，我拼了命也要演好。」", "袁雪芬");
    modifyState({ reformFaith: 10, bond: 10 });
    addToStory("深夜，你提笔写道：「祥林嫂，一个被卖、被抢、被骂克夫的女人，在大雪夜倒在了街头……」", "内心");
    advanceDay();
    waitAndGo('day5_crisis');
};

// ======================= 第五天 · 危机互助 =======================
scenes.day5_crisis = () => {
    clearMessageQueue();
    setBackground('qinroom');
    addToStory("清晨琴师房门紧闭，老琴师高烧卧床，额头滚烫。", "");
    setSceneEndCallback(() => {
        setOptions([
            { label: "消耗10能量兑换退烧药 ", action: () => {
                if (getGameState().energy >= 10) {
                    modifyState({ energy: -10, qinshiProgress: 20, bond: 10, usedMedicineForQin: true });
                    addToStory("退烧药起效，老琴师感慨：「小子，你到底是什么人？」", "老琴师");
                }
                waitAndGo('day5_xiaochun');
            } },
            { label: "上街抓药", action: () => {
                modifyState({ qinshiProgress: 10, bond: 5 });
                waitAndGo('day5_xiaochun');
            } }
        ]);
    });
};

scenes.day5_xiaochun = () => {
    addToStory("中午，小春不见了。袁雪芬说：「他早上说去给你抓药。」", "袁雪芬");
    addToStory("在后门墙角找到小春，他满手泥巴抓着草药：「先生……我想帮你。」", "小春");
    addToStory("你蹲下抱住他：「谢谢你。但以后不许一个人乱跑。」", "主角");
    modifyState({ xiaochunProgress: 20, bond: 15 });
    addToStory("傍晚众人齐心，老琴师说：「那段高腔我来改过门帮你托着。」小春：「我可以搬道具！」", "");
    advanceDay();
    waitAndGo('day6_desperate');
};

// ======================= 第六天 · 绝境抉择 =======================
scenes.day6_desperate = () => {
    clearMessageQueue();
    setBackground('rehearsal');
    addToStory("最后一次联排，袁雪芬突然失声，嗓音沙哑，全场死寂。", "");
    setSceneEndCallback(() => {
        setOptions([
            { label: "消耗20能量「声带修复」", action: () => {
                if (getGameState().energy >= 20) {
                    modifyState({ energy: -20, vocalCured: true });
                    addToStory("暖流涌入，袁雪芬声音清亮如初。众人重新振作。", "系统");
                }
                waitAndGo('day6_night');
            } },
            { label: "降调演出", action: () => {
                modifyState({ reformFaith: -10 });
                waitAndGo('day6_night');
            } }
        ]);
    });
};

scenes.day6_night = () => {
    addToStory("深夜，小春送来纸条：「先生，加油。 ——小春」", "");
    addToStory("袁雪芬推门进来：「如果明天失败了，你会后悔吗？」", "袁雪芬");
    addToStory("「不会。因为认识了你们。」", "主角");
    addToStory("第六天结束。剩余1天。", "系统");
    advanceDay();
    waitAndGo('day7_finale');
};

// ======================= 第七天 · 首演终局 =======================
scenes.day7_finale = () => {
    clearMessageQueue();
    setBackground('stage');
    addToStory("早晨后台，所有人紧张准备。周班主检查行头，小春帮你放好剧本。", "");
    addToStory("老琴师：「今天豁出去了。」袁雪芬手微微发抖。", "");
    addToStory("「大家听我说，你们已经是英雄了。因为你们敢于改变。」", "主角");
    addToStory("锣鼓响起，幕布拉开。台下坐了八成满。", "");
    addToStory("一段、两段……唱到「天问」，袁雪芬泪流满面，台下抽泣。", "");
    addToStory("大幕落下，沉默三秒，掌声如潮！", "");
    addToStory("后台所有人相拥而泣。", "");

    const endingType = calculateEnding();
    if (endingType === "perfect") {
        addToStory("完美结局 · 薪火相传 <br>系统：戏班重生，越剧改革成功。周班主：「先生，留在这里吧，戏班永远有你一把椅子。」", "系统");
        addToStory("【人物卡·袁雪芬】越剧改革先驱。<br>【人物卡·周班主】文脉守护者。<br>【人物卡·老琴师】琴弦不断血脉不绝。<br>【人物卡·小春】每一滴泪都会浇灌花朵。", "");
    } else if (endingType === "success") {
        addToStory(" 成功结局 · 曙光初现 <br>袁雪芬问：「你还会再来吗？」<br>「会的，我永远记得你们。」", "系统");
    } else if (endingType === "barely") {
        addToStory("勉强成功 · 戏班保住", "系统");
    } else {
        addToStory("风雪终章 · 戏班解散。你困在1942年，梁祝声渐远……", "系统");
    }
    setSceneEndCallback(() => { setOptions([{ label: "感谢守护 · 文脉不灭", action: () => {} }]); });
};