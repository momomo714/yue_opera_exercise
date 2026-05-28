export const INIT_STATE = {
    energy: 100,
    daysLeft: 7,
    reformConfidence: 30,
    totalBond: 0,
    xiaochunProgress: 0,
    qinshiProgress: 0,
    actionPoints: 6,
    actPhase: "prologue",
    sceneDone: {
        yuan: false,
        ban: false,
        chun: false,
        qin: false
    },
    nightChoice: null,
    failed: false,
    transitTrigger: false
};

export const SUCCESS_THRESHOLD = 70;
export const PERFECT_CONFIDENCE = 80;
export const PERFECT_ENERGY = 30;