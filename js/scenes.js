import { addToStory, setOptions, setSceneEndCallback, setBackground, setCharacter, clearMessageQueue } from './ui.js';
import { getGameState, modifyState, advanceDay, calculateEnding } from './gameState.js';
import { storyEngine } from './storyEngine.js';

const scenes = {};

function waitAndGo(nextSceneId) {
    setSceneEndCallback(() => {
        storyEngine.gotoScene(nextSceneId);
    });
}

// 第1天
scenes.day1_start = () => {
    clearMessageQueue();
    setBackground('backstage');
    setCharacter(null, false);
    addToStory("霉味、旧木头、劣质胭脂香混在一起。破旧的戏箱堆在墙角，柱子上贴着红纸「永兴戏班」。");
    addToStory("我......这是在哪？头好晕。", "内心");
    addToStory("系统：「文脉守护系统 已激活」\n「宿主：越剧研究者」\n「当前时空：1942年·上海·永兴戏班后场」\n「主线任务：阻止戏班倒闭，推动越剧改革」\n「倒计时：7天」", "系统");
    addToStory("1942年？我穿越了？这不是做梦吧？", "内心");
    addToStory("你使劲掐了掐手臂——疼。");
    addToStory("帘子猛地掀开，一个精瘦的中年男人走进来。他穿着洗得发白的蓝布长衫，眼袋很深，手里夹着半截烟卷。", "", null);
    setCharacter('zhou_banzhu');
    addToStory("你是新来的写戏先生？", "周班主");
    addToStory("你一愣，还没回答。");
    addToStory("前一个先生跑了，留了半本烂账。你会写新戏吧？", "周班主");
    addToStory("他把我当成了别人......但也许这是留在这里的唯一机会。", "内心");
    addToStory("你点了点头。");
    addToStory("周班主松了口气，又绷起脸：「留下，包吃住，没工钱。三天写不出新戏——滚蛋！」", "周班主");
    addToStory("他转身要走，到门口又停住：「对了，我叫周德茂。这戏班三十口人，全压在我肩上。」", "周班主");
    addToStory("三十口人......这不是游戏，是活生生的人生。", "内心");
    addToStory("系统：「是否接受使命？」", "系统");
    setSceneEndCallback(() => {
        setOptions([
            { label: "我接下。不是为了系统，而是为了这群人。", action: () => {
                modifyState({ reformFaith: 10, bond: 5 });
                addToStory("周班主愣了一下，点点头，眼神里闪过一丝希望。", "周班主");
                addToStory("系统：「使命接受，第一幕开启。剩余6天。」", "系统");
                waitAndGo('day1_end');
            }},
            { label: "我只是想回家......但既然来了，就试试吧。", action: () => {
                modifyState({ reformFaith: 2 });
                addToStory("周班主哼了一声：「试试就试试，总比没人强。」", "周班主");
                addToStory("系统：「使命接受，第一幕开启。剩余6天。」", "系统");
                waitAndGo('day1_end');
            }}
        ]);
    });
};

scenes.day1_end = () => {
    advanceDay();
    waitAndGo('day2_morning');
};

// 第2天
scenes.day2_morning = () => {
    clearMessageQueue();
    setBackground('rehearsal');
    addToStory("清晨，阳光从后台的破窗斜射进来，灰尘在光柱中飞舞。");
    addToStory("第二天了......还是不敢相信。但身上这粗布长衫，手心的玉符，都是真的。", "内心");
    addToStory("你走出杂物间，看见排练厅里有个女人在独自练唱。她穿着旧戏服，身段挺拔，但眉间有化不开的愁。");
    addToStory("这就是袁雪芬？比照片上更瘦。", "内心");
    addToStory("袁雪芬的唱腔忽然中断，她扶着柱子咳嗽了几声。");
    setCharacter('yuan_xuefen');
    addToStory("袁老板，你还好吗？", "主角");
    addToStory("她回头，勉强笑了笑：「没事，老毛病。你是新来的写戏先生？」", "袁雪芬");
    addToStory("嗯，我叫......", "主角");
    addToStory("不必说名字。这个戏班，人来人往，能留下的没几个。", "袁雪芬");
    addToStory("她似乎对一切都不抱希望。但她的声音明明那么好。", "内心");
    addToStory("你会写什么样的戏？", "袁雪芬");
    addToStory("我想写一个......能让人哭出来，又能让人站起来的故事。", "主角");
    addToStory("袁雪芬眼睛亮了一下，又暗下去：「难。观众爱看才子佳人，可我只想唱点真的东西。」", "袁雪芬");
    addToStory("她的矛盾和我一样：想要改变，又怕被抛弃。", "内心");
    addToStory("系统：此时可选是否消耗能量查看历史资料（消耗5能量，获得「祥林嫂」灵感）", "系统");
    setSceneEndCallback(() => {
        const state = getGameState();
        let opts = [];
        if (state.energy >= 5) {
            opts.push({ label: "消耗5能量，查看系统资料", action: () => {
                modifyState({ energy: -5, reformFaith: 5, hasXianglinInspire: true });
                addToStory("系统：「鲁迅小说《祝福》节选已载入。主角祥林嫂，一生被封建礼教吞噬......」", "系统");
                addToStory("这就是袁雪芬要的「真的东西」。我找到了。", "内心");
                waitAndGo('day2_qinshi');
            }});
        }
        opts.push({ label: "不消耗，先观察", action: () => {
            waitAndGo('day2_qinshi');
        }});
        setOptions(opts);
    });
};

scenes.day2_qinshi = () => {
    clearMessageQueue();
    setBackground('qinRoom');
    addToStory("午后，琴师房传来断续的胡琴声，苍凉、沙哑，像老人在哭。");
    addToStory("你循声走去，门半掩。一个佝偻的老人背对着你，坐在木凳上拉琴。琴弦忽然断了。");
    setCharacter('old_qinshi');
    addToStory("唉......又断了。", "老琴师");
    addToStory("他转过身，满脸皱纹，眼神倔强。");
    addToStory("这就是老琴师？比想象中更固执。", "内心");
    addToStory("你是谁？", "老琴师");
    addToStory("新来的写戏先生。", "主角");
    addToStory("老琴师哼了一声：「又来一个糟蹋老调子的。我告诉你，越剧的魂在腔里，改不得。」", "老琴师");
    addToStory("他不是顽固，是怕失去。", "内心");
    addToStory("我听过刚才那段曲子，很动人。是您师父教的吗？", "主角");
    addToStory("老琴师一愣，沉默片刻：「你......听得懂？」", "老琴师");
    addToStory("我不懂，但我觉得它不该失传。", "主角");
    addToStory("老琴师盯着你看了很久，叹了口气：「小子，你和你前面那些不一样。但改腔的事，我死也不会答应。」", "老琴师");
    addToStory("他没有完全拒绝我，只是需要时间。", "内心");
    waitAndGo('day2_xiaochun');
};

scenes.day2_xiaochun = () => {
    clearMessageQueue();
    setBackground('backstage');
    addToStory("黄昏，后台角落。小春蹲在戏箱后面，肩膀一抽一抽的。");
    setCharacter('xiaochun');
    addToStory("呜呜......", "小春");
    addToStory("你走过去：「小春？怎么了？」");
    addToStory("小春抬头，脸上有泪痕和泥印：「先生......他们说我笨，连「戲」字都写不好，说我烂泥扶不上墙......」", "小春");
    addToStory("这孩子才八九岁，就要承受这些。", "内心");
    setSceneEndCallback(() => {
        setOptions([
            { label: "蹲下来安慰他，手把手教他写「戲」字", action: () => {
                modifyState({ xiaochunProgress: 15, bond: 5 });
                addToStory("来，我教你。你看，「戲」左边是「虚」，右边是「戈」......", "主角");
                addToStory("小春跟着你一笔一划，渐渐不哭了。");
                addToStory("先生，你真好。", "小春");
                addToStory("这孩子让我想起了自己小时候。也许，这就是我在这里的意义。", "内心");
                waitAndGo('day2_end');
            }},
            { label: "拍拍他的肩膀：「哭有什么用？要自己争气。」", action: () => {
                modifyState({ xiaochunProgress: 5, bond: 2 });
                addToStory("小春擦了擦眼泪，用力点头。", "内心");
                waitAndGo('day2_end');
            }},
            { label: "默默离开，让他自己消化", action: () => {
                addToStory("你心中有些自责，但还是转身离开。", "内心");
                waitAndGo('day2_end');
            }}
        ]);
    });
};

scenes.day2_end = () => {
    addToStory("深夜，油灯如豆。你坐在桌前，面前摊着纸笔。");
    addToStory("第二天结束了。我认识了他们：疲惫的袁雪芬、固执的老琴师、扛着三十口人的班主、哭泣的小春。每个人都在挣扎。", "内心");
    addToStory("系统提示：「剩余5天。当前能量：" + getGameState().energy + "。改革信心：" + getGameState().reformFaith + "。」", "系统");
    addToStory("我要写的戏，叫《祥林嫂》。明天，我要告诉他们。", "内心");
    advanceDay();
    waitAndGo('day3_conflict');
};

// 第3天
scenes.day3_conflict = () => {
    clearMessageQueue();
    setBackground('rehearsal');
    addToStory("排练厅。众人聚集，气氛凝重。");
    setCharacter('zhou_banzhu');
    addToStory("今天把新戏的架子定下来。先生，你说。", "周班主");
    addToStory("你站起来，深吸一口气。");
    addToStory("我想做的戏，叫《祥林嫂》。讲一个女人被封建礼教一步步逼死的故事。", "主角");
    setCharacter('old_qinshi');
    addToStory("老琴师猛地拍桌：「太苦了！观众是来找乐子的，不是来找哭的！」", "老琴师");
    addToStory("果然，第一个反对的是他。", "内心");
    setCharacter('yuan_xuefen');
    addToStory("我倒觉得......可以试试。祥林嫂的悲剧，能让女人看了觉醒。", "袁雪芬");
    addToStory("觉醒？戏班都要饿死了，还觉醒！", "老琴师");
    setCharacter('zhou_banzhu');
    addToStory("钱呢？新行头、新布景，都要钱。我现在连房租都快付不起了。", "周班主");
    addToStory("他们说的都对。但我不想放弃。", "内心");
    setSceneEndCallback(() => {
        const state = getGameState();
        let opts = [
            { label: "坚持己见，讲述祥林嫂的故事如何引发共鸣", action: () => {
                modifyState({ reformFaith: 5 });
                addToStory("你动情地讲述祥林嫂的遭遇，众人沉默。");
                waitAndGo('day3_mid');
            }},
            { label: "妥协，先写一个折中的戏", action: () => {
                modifyState({ reformFaith: -5 });
                addToStory("你叹了口气，决定暂退一步。");
                waitAndGo('day3_mid');
            }}
        ];
        if (state.energy >= 10) {
            opts.push({ label: "消耗10能量，展示现代越剧改革案例（如《红楼梦》的成功）", action: () => {
                modifyState({ energy: -10, reformFaith: 10, bond: 5, qinshiProgress: 20 });
                addToStory("系统投影出越剧《红楼梦》的唱段和票房数据。", "系统");
                addToStory("老琴师看着空中浮动数字，沉默了。", "老琴师");
                addToStory("......这些，都是真的？", "老琴师");
                addToStory("真的。越剧可以既保留传统，又讲新故事。", "主角");
                addToStory("老琴师低下头，手指摩挲着琴杆：「让我想想。」", "老琴师");
                addToStory("他终于松动了。哪怕只是一点。", "内心");
                waitAndGo('day3_evening');
            }});
        }
        setOptions(opts);
    });
};

scenes.day3_mid = () => {
    addToStory("中午，后台。小春端着一碗热粥走过来。");
    setCharacter('xiaochun');
    addToStory("先生，给你。我偷偷多盛了一勺。", "小春");
    addToStory("这碗粥比任何话都暖。", "内心");
    addToStory("谢谢你，小春。", "主角");
    addToStory("小春腼腆地笑：「先生，我今天学会了「祥」字。祥林嫂的祥。」", "小春");
    addToStory("你真聪明。", "主角");
    addToStory("先生，祥林嫂最后......会好吗？", "小春");
    addToStory("孩子的问题，我答不上来。", "内心");
    addToStory("她不会好。但她的故事，会让很多人好起来。", "主角");
    waitAndGo('day3_end');
};

scenes.day3_evening = () => {
    addToStory("傍晚，琴师房。老琴师独自坐着，手里拿着曲谱。");
    setCharacter('old_qinshi');
    addToStory("先生，进来吧。", "老琴师");
    addToStory("你走进去。");
    addToStory("你那个......什么系统，再放一次我听听。", "老琴师");
    addToStory("你放出周宝财改良过门后的唱腔。");
    addToStory("老琴师闭上眼，听完整段，长叹一口气：「我师父若还在，也会想改的。他只是没等到好法子。」", "老琴师");
    addToStory("原来他反对的，不是改革，而是粗鲁的破坏。", "内心");
    addToStory("我给你记谱。但你要答应，不要丢掉老腔的魂。", "老琴师");
    addToStory("我答应。", "主角");
    modifyState({ qinshiProgress: 20, reformFaith: 5, bond: 5 });
    waitAndGo('day3_end');
};

scenes.day3_end = () => {
    addToStory("深夜，你躺在床上。");
    addToStory("第三天了。我让一个人改变了主意。但前方还有更多困难。", "内心");
    addToStory("系统提示：「剩余4天。当前能量：" + getGameState().energy + "。改革信心：" + getGameState().reformFaith + "。琴师进度：" + getGameState().qinshiProgress + "。」", "系统");
    addToStory("明天，我要去见班主。他才是最需要说服的人。", "内心");
    advanceDay();
    waitAndGo('day4_break');
};

// 第4天
scenes.day4_break = () => {
    clearMessageQueue();
    setBackground('backstage');
    addToStory("账房。算盘珠子噼啪响。周班主低头记账，眉头紧锁。");
    setCharacter('zhou_banzhu');
    addToStory("又赔了。再这样下去，下个月连米都买不起。", "周班主");
    addToStory("你敲门进去。");
    addToStory("先生，有事？", "周班主");
    addToStory("我想和您聊聊戏的事。", "主角");
    addToStory("周班主放下笔，靠回椅背：「聊吧。」");
    addToStory("祥林嫂的戏，不需要新行头。就一件破棉袄，观众反而觉得真。", "主角");
    addToStory("那布景呢？雪景怎么做？", "周班主");
    addToStory("用旧幕布拆了，染成白色，挂起来就是雪。", "主角");
    addToStory("周班主盯着你看了很久：「你倒是会省钱。但......光省钱没用，得有人来看。」", "周班主");
    addToStory("只要戏好，人会来的。", "主角");
    addToStory("周班主苦笑：「我当年也这么想。后来呢？老婆跑了，嗓子废了，只好当班主。」", "周班主");
    addToStory("他也有故事。", "内心");
    addToStory("周班主从抽屉里拿出一张泛黄的照片，上面是个年轻武生。", "周班主");
    addToStory("这是我。十年前，我在台上翻跟头，底下满堂彩。一场战乱，戏楼炸了，我摔断腿，再也翻不了。", "周班主");
    addToStory("原来他恨的不是改革，是命运。", "内心");
    addToStory("班主，祥林嫂不是你的故事，但她的挣扎和你一样。观众会懂的。", "主角");
    addToStory("周班主沉默了很久，把照片收回去。");
    addToStory("......我再信一次。你写吧。", "周班主");
    modifyState({ reformFaith: 10, bond: 10 });
    addToStory("黄昏，后台。袁雪芬正在对镜卸妆。");
    setCharacter('yuan_xuefen');
    addToStory("先生，班主同意了？", "袁雪芬");
    addToStory("他同意了。", "主角");
    addToStory("谢谢你。这个戏班，很久没人带来希望了。", "袁雪芬");
    addToStory("她今天看起来没那么疲惫了。", "内心");
    addToStory("你知道吗，我十一岁学戏，师父说我是根好苗子。我就想，一定要唱出名堂。可唱了二十年，观众越来越少，有人说我老了。", "袁雪芬");
    addToStory("你不老。你的声音里还有力量。", "主角");
    addToStory("袁雪芬转过头，眼眶微红：「先生，你这个人......很奇怪。你说话不像这个时代的人。」", "袁雪芬");
    addToStory("她察觉到了什么吗？", "内心");
    addToStory("我只是......比较直接。", "主角");
    addToStory("袁雪芬笑了：「好。我就信你这次。祥林嫂，我拼了命也要演好。」", "袁雪芬");
    modifyState({ reformFaith: 10, bond: 10 });
    addToStory("深夜，你独自写剧本。");
    addToStory("第四天。我让班主和袁雪芬都站到了我这边。但老琴师还在犹豫，小春还需要更多鼓励。", "内心");
    addToStory("系统提示：「剩余3天。当前能量：" + getGameState().energy + "。改革信心：" + getGameState().reformFaith + "。小春进度：" + getGameState().xiaochunProgress + "。」", "系统");
    addToStory("你提笔写道：「祥林嫂，一个被卖、被抢、被骂克夫的女人，在大雪夜倒在了街头......」");
    advanceDay();
    waitAndGo('day5_crisis');
};

// 第5天
scenes.day5_crisis = () => {
    clearMessageQueue();
    setBackground('qinRoom');
    addToStory("清晨，琴师房。门紧闭，里面没有琴声。");
    addToStory("你敲门：「琴师？琴师！」");
    addToStory("没人应。你推开门，发现老琴师躺在床上，脸色发白，嘴唇干裂。");
    setCharacter('old_qinshi');
    addToStory("......没事，老毛病，歇歇就好。", "老琴师");
    addToStory("你摸他额头——滚烫。");
    addToStory("他发烧了，而且很严重。", "内心");
    setSceneEndCallback(() => {
        const state = getGameState();
        let opts = [
            { label: "去街上抓药", action: () => {
                modifyState({ qinshiProgress: 10, bond: 5 });
                addToStory("你匆匆上街抓药，回来喂他服下。老琴师好转了一些。");
                waitAndGo('day5_xiaochun');
            }},
            { label: "让他休息，你替他整理曲谱", action: () => {
                modifyState({ qinshiProgress: 5 });
                addToStory("你帮他整理曲谱，老琴师感激但病情未减。");
                waitAndGo('day5_xiaochun');
            }}
        ];
        if (state.energy >= 10) {
            opts.unshift({ label: "消耗10能量，从系统兑换退烧药", action: () => {
                modifyState({ energy: -10, qinshiProgress: 20, bond: 10, usedMedicineForQin: true });
                addToStory("系统：「退烧药已兑换。」你手中出现一包药粉。", "系统");
                addToStory("你喂老琴师服下。");
                addToStory("这......这是什么？好苦。", "老琴师");
                addToStory("特效药。明天你就会好。", "主角");
                addToStory("老琴师看着你，眼神复杂：「小子，你到底是什么人？」", "老琴师");
                addToStory("一个希望你好起来的人。", "主角");
                waitAndGo('day5_xiaochun');
            }});
        }
        setOptions(opts);
    });
};

scenes.day5_xiaochun = () => {
    clearMessageQueue();
    setBackground('rehearsal');
    addToStory("中午，排练厅。因为琴师病倒，排练暂停。小春不见了。");
    setCharacter('yuan_xuefen');
    addToStory("小春早上说去给你抓药，到现在没回来。", "袁雪芬");
    addToStory("这孩子......一个人跑出去了？", "内心");
    addToStory("你和袁雪芬分头找。最后在戏班后门的墙角找到小春，他蹲在那里，手里抓着几株草药。");
    setCharacter('xiaochun');
    addToStory("先生......我听人说这草能退烧，我去城郊挖的......", "小春");
    addToStory("这孩子的手上全是泥，指甲都破了。", "内心");
    addToStory("你一个人去城郊？多危险！", "主角");
    addToStory("小春低下头：「我......我想帮你。」", "小春");
    addToStory("你鼻子一酸，蹲下来抱住他。");
    addToStory("谢谢你。但以后不许一个人乱跑。", "主角");
    addToStory("小春点头，眼泪掉下来。");
    modifyState({ xiaochunProgress: 20, bond: 15 });
    addToStory("傍晚，所有人聚在后台。老琴师吃了药已经退烧，坐在椅子上。");
    setCharacter('zhou_banzhu');
    addToStory("明天就是第六天了，后天首演。我们还有好多没准备好。", "周班主");
    setCharacter('yuan_xuefen');
    addToStory("唱腔我差不多了，但有一段高腔我总唱不好。", "袁雪芬");
    setCharacter('old_qinshi');
    addToStory("那段我来改过门，帮你托着。", "老琴师");
    addToStory("他们开始互相配合了。", "内心");
    setCharacter('xiaochun');
    addToStory("我......我可以帮忙搬道具！", "小春");
    setCharacter('zhou_banzhu');
    addToStory("班主难得笑了一下：「好。每个人都要出力。」", "周班主");
    addToStory("你看着这群人，心里涌上一股暖流。");
    addToStory("第五天。我们成了真正的伙伴。", "内心");
    addToStory("系统提示：「剩余2天。当前能量：" + getGameState().energy + "。改革信心：" + getGameState().reformFaith + "。羁绊总值：" + getGameState().bond + "。」", "系统");
    advanceDay();
    waitAndGo('day6_crisis');
};

// 第6天
scenes.day6_crisis = () => {
    clearMessageQueue();
    setBackground('rehearsal');
    addToStory("早晨，排练厅。最后一次联排。");
    setCharacter('yuan_xuefen');
    addToStory("袁雪芬唱到一半，突然失声，剧烈咳嗽。");
    addToStory("糟糕，她的嗓子......", "内心");
    setCharacter('old_qinshi');
    addToStory("停下来！她的嗓子撑不住了！", "老琴师");
    addToStory("袁雪芬摇头：「没事......我能唱......」", "袁雪芬");
    addToStory("她再开口，声音沙哑，完全不像样。");
    addToStory("全场死寂。");
    setCharacter('zhou_banzhu');
    addToStory("这......这怎么办？明天就演了！", "周班主");
    addToStory("所有努力，难道要毁在这一刻？", "内心");
    setSceneEndCallback(() => {
        const state = getGameState();
        let opts = [
            { label: "改变唱腔，降调演出", action: () => {
                modifyState({ reformFaith: -10 });
                addToStory("降调唱。保嗓子上台最重要。", "主角");
                addToStory("袁雪芬犹豫，还是照做了。唱完后，她流下泪：「对不起......」", "袁雪芬");
                addToStory("老琴师：「你已经很好了。」", "老琴师");
                addToStory("看着她内疚的样子，我心里也不好受。", "内心");
                waitAndGo('day6_mid');
            }},
            { label: "推迟首演一天", action: () => {
                if (state.energy >= 10) {
                    modifyState({ energy: -10 });
                    addToStory("你请求推迟一天，班主勉强同意。");
                } else {
                    modifyState({ reformFaith: -15 });
                    addToStory("班主坚决不同意，你只好作罢。");
                }
                waitAndGo('day6_mid');
            }}
        ];
        if (state.energy >= 20) {
            opts.unshift({ label: "消耗20能量，使用系统「声带修复」", action: () => {
                modifyState({ energy: -20, vocalCured: true });
                addToStory("系统：「声带修复开始。消耗20能量。」", "系统");
                addToStory("一阵暖流涌入袁雪芬喉咙。她咳了几下，再开口——声音清亮如初。", "袁雪芬");
                addToStory("这......先生，你怎么做到的？", "袁雪芬");
                addToStory("系统的事以后再说。继续排练！", "主角");
                addToStory("众人重新振作。");
                waitAndGo('day6_mid');
            }});
        }
        setOptions(opts);
    });
};

scenes.day6_mid = () => {
    addToStory("中午，后台。你独自坐着，系统警报闪烁。");
    addToStory("系统：「能量低于30！若低于10，系统将休眠，无法提供帮助。」", "系统");
    addToStory("能量快用完了。明天就是最后一天，我必须谨慎。", "内心");
    setCharacter('xiaochun');
    addToStory("小春端着一碗水进来：「先生，你脸色好差......喝点水。」", "小春");
    addToStory("你接过碗，发现碗底压着一张纸条，上面歪歪扭扭写着：「先生，加油。 ——小春」");
    addToStory("这个孩子......总是给我力量。", "内心");
    addToStory("深夜，所有人都在准备。你通宵修改剧本的结尾，手指磨破了皮。");
    setCharacter('yuan_xuefen');
    addToStory("袁雪芬推门进来：「先生，你还没睡？」", "袁雪芬");
    addToStory("睡不着。你呢？", "主角");
    addToStory("我也睡不着。唱了二十年，从来没像今天这么紧张。", "袁雪芬");
    addToStory("因为你把祥林嫂当成了自己。", "主角");
    addToStory("袁雪芬沉默良久：「先生，如果明天失败了，你会后悔来这里吗？」", "袁雪芬");
    addToStory("我会后悔吗？", "内心");
    addToStory("不会。因为认识了你们。", "主角");
    addToStory("袁雪芬笑了，眼角有泪光：「谢谢你。」", "袁雪芬");
    addToStory("第六天结束了。明天，就是决定命运的日子。", "内心");
    addToStory("系统提示：「剩余1天。当前能量：" + getGameState().energy + "。改革信心：" + getGameState().reformFaith + "。一切，看明天。」", "系统");
    advanceDay();
    waitAndGo('day7_finale');
};

// 第7天
scenes.day7_finale = () => {
    clearMessageQueue();
    setBackground('stage');
    addToStory("早晨，后台。所有人都到齐了，空气里弥漫着紧张和期待。");
    setCharacter('zhou_banzhu');
    addToStory("最后检查一遍：行头、道具、乐队......", "周班主");
    setCharacter('xiaochun');
    addToStory("先生，我帮你把剧本放在台侧了。", "小春");
    addToStory("谢谢。", "主角");
    setCharacter('old_qinshi');
    addToStory("我这把老骨头，今天豁出去了。", "老琴师");
    setCharacter('yuan_xuefen');
    addToStory("袁雪芬在对着镜子化妆，手微微发抖。");
    addToStory("我必须让他们镇定下来。", "内心");
    addToStory("大家听我说。今天，不管台下坐了多少人，不管有没有掌声，你们已经是英雄了。", "主角");
    addToStory("众人安静下来。");
    addToStory("因为你们敢于改变。这比什么都重要。", "主角");
    addToStory("袁雪芬深吸一口气，站起来：「走吧。」", "袁雪芬");
    addToStory("下午，开演前。幕布后，观众席传来嘈杂声。你偷偷掀开帘子——坐了八成满。");
    setCharacter('zhou_banzhu');
    addToStory("比平时多了一倍人......", "周班主");
    addToStory("有希望。", "内心");
    setCharacter('old_qinshi');
    addToStory("开始了。", "老琴师");
    addToStory("锣鼓响起，幕布拉开。袁雪芬上场，第一句唱腔稳稳送出。");
    addToStory("台下安静了。");
    addToStory("你站在侧幕，手心冒汗。一段、两段、三段......没有出错。");
    addToStory("她唱得太好了。", "内心");
    addToStory("唱到「天问」一段，袁雪芬的眼泪夺眶而出，那是真哭。");
    addToStory("台下传来抽泣声。");
    addToStory("成功了。", "内心");
    addToStory("大幕落下，沉默了三秒，然后——掌声如潮水般涌来。");
    addToStory("好——！再来一个！");
    addToStory("我做到了。我们都做到了。", "内心");
    addToStory("后台，所有人相拥而泣。");
    setCharacter('zhou_banzhu');
    addToStory("三十年......我头一回在后台哭。", "周班主");
    setCharacter('old_qinshi');
    addToStory("小子，你是老天爷派来的吧？", "老琴师");
    setCharacter('xiaochun');
    addToStory("先生！我们赢了！", "小春");
    setCharacter('yuan_xuefen');
    addToStory("谢谢你。", "袁雪芬");
    
    // 结局判定
    const endingType = calculateEnding();
    if (endingType === "perfect") {
        addToStory("系统：「完美结局达成。戏班重生，越剧改革成功。你将成为永兴戏班的永久荣誉成员。」", "系统");
        addToStory("周班主：「先生，留在这里吧。戏班永远有你一把椅子。」", "周班主");
        addToStory("我选择留下。因为这里已经是我的家。", "内心");
        addToStory("【人物卡·袁雪芬】越剧改革先驱。1922-2011，袁派创始人。1942年，她顶着骂声排演《祥林嫂》，连演30场，场场爆满。她说：「越剧要活，就得呼吸时代的空气。」");
        addToStory("【人物卡·周班主】旧社会班主，扛着几十口人的生计。他们变卖家产、低声下气，只为让戏班活下去。他们是最早的「文脉守护者」。");
        addToStory("【人物卡·老琴师】越剧主胡革新者。首创过门托腔，让唱腔更有骨血。他记下数百首濒临失传的曲牌，用琴声为改革铺路。");
        addToStory("【人物卡·小春】旧社会学徒，七八岁签生死契，挨打挨骂。但他们从识字开始，一步步成为流派宗师。小春，是未来的希望。");
    } else if (endingType === "success") {
        addToStory("系统：「成功结局达成。改革胜利，但戏班仍需努力。你带着手抄剧本和合影回到现代。」", "系统");
        addToStory("袁雪芬：「先生，你还会再来吗？」", "袁雪芬");
        addToStory("会的。我永远记得你们。", "主角");
        addToStory("【人物卡·袁雪芬】越剧改革先驱。\n【人物卡·周班主】文脉守护者。\n【人物卡·老琴师】琴弦不断，血脉不绝。\n【人物卡·小春】每一滴泪，都会浇灌出花朵。");
    } else if (endingType === "barely") {
        addToStory("系统：「勉强成功。演出平平，观众反应一般，但戏班保住了。」", "系统");
        addToStory("周班主：「先生，下次不要这么冒险了。」", "周班主");
        addToStory("我明白。", "主角");
        addToStory("【人物卡·袁雪芬】越剧改革先驱。\n【人物卡·周班主】文脉守护者。\n【人物卡·老琴师】琴弦不断。\n【人物卡·小春】未来的希望。");
    } else {
        addToStory("系统：「任务失败。演出冷场，戏班解散。你困在1942年，风雪中梁祝声渐远......」", "系统");
        addToStory("我终究没能改变历史。但我不后悔来过。", "内心");
        setSceneEndCallback(() => {
            setOptions([{ label: "重开游戏", action: () => location.reload() }]);
        });
        return;
    }
    setSceneEndCallback(() => {
        setOptions([{ label: "感谢守护，文脉不灭", action: () => {} }]);
    });
};

export const scenesMap = scenes;