import { INIT_STATE } from './data/constants.js';

class GameState {
    constructor() {
        this.data = { ...INIT_STATE };
    }

    get state() {
        return this.data;
    }

    update(updates) {
        Object.assign(this.data, updates);
    }

    modify(prop, delta) {
        if (prop === 'sceneDone') {
            // 合并更新，不覆盖已有标记
            this.data.sceneDone = { ...this.data.sceneDone, ...delta };
        } else if (typeof this.data[prop] === 'number') {
            let newVal = this.data[prop] + delta;
            if (prop === 'energy' || prop === 'reformConfidence' || prop === 'totalBond' || prop === 'xiaochunProgress' || prop === 'qinshiProgress') {
                newVal = Math.min(100, Math.max(0, newVal));
            }
            this.data[prop] = newVal;
        } else {
            this.data[prop] = delta;
        }
    }

    consumeEnergy(amount) {
        if (this.data.energy >= amount) {
            this.data.energy -= amount;
            return true;
        }
        return false;
    }

    reset() {
        this.data = { ...INIT_STATE };
    }
}

export const gameState = new GameState();