// 初始游戏数值
export const INIT_STATE = {
    day: 1,                  // 当前第几天
    daysLeft: 6,             // 倒计时
    energy: 100,             // 系统能量
    reformFaith: 0,          // 改革信心 0-100
    xiaochunProgress: 0,     // 小春进度
    qinshiProgress: 0,       // 琴师进度
    bond: 0,                 // 羁绊值
    hasXianglinInspire: false,   // 是否获得祥林嫂灵感
    usedMedicineForQin: false,   // 是否用药救琴师
    vocalCured: false,       // 嗓子是否被修复
    ending: null,            // 结局标识
};

// 背景图片映射 (assets/bg/ 目录下)
export const BG_MAP = {
    backstage: 'backstage',      // 后台/杂物间
    rehearsal: 'rehearsal',      // 排练厅
    qinRoom: 'qinroom',          // 琴师房
    night: 'night',              // 深夜书桌
    street: 'street',            // 街巷
    stage: 'stage',              // 戏台
};

// 立绘映射 (assets/char/ 目录下)
export const CHAR_MAP = {
    yuan_xuefen: 'yuan_xuefen',     // 袁雪芬
    zhou_banzhu: 'zhou_banzhu',     // 周班主
    old_qinshi: 'old_qinshi',       // 老琴师
    xiaochun: 'xiaochun',           // 小春
    protagonist: 'protagonist',     // 主角(虚影)
};