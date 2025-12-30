import React from 'react';

export class FrozenLake {
  constructor(size = 4, rewardConfig = {}) {
    this.size = size;
    this.nStates = size * size;
    this.nActions = 4;
    this.holes = [5, 7, 11, 12];
    this.goalState = size * size - 1;
    this.hasTransitionModel = true;
    this.slippery = true;
    this.rewardConfig = {
      goalReward: 1,
      holePenalty: -1,
      stepPenalty: -0.01,
      ...rewardConfig
    };
    this.reset();
  }

  reset() {
    this.state = 0;
    return this.state;
  }

  step(action) {
    let actualAction = action;
    if (this.slippery) {
      const rand = Math.random();
      if (rand < 0.33) actualAction = (action + 3) % 4;
      else if (rand < 0.66) actualAction = (action + 1) % 4;
    }

    const row = Math.floor(this.state / this.size);
    const col = this.state % this.size;
    let newRow = row, newCol = col;

    if (actualAction === 0) newRow = Math.max(0, row - 1);
    else if (actualAction === 1) newCol = Math.min(this.size - 1, col + 1);
    else if (actualAction === 2) newRow = Math.min(this.size - 1, row + 1);
    else if (actualAction === 3) newCol = Math.max(0, col - 1);

    this.state = newRow * this.size + newCol;
    
    const done = this.holes.includes(this.state) || this.state === this.goalState;
    let reward = this.rewardConfig.stepPenalty;
    
    if (this.state === this.goalState) {
      reward = this.rewardConfig.goalReward;
    } else if (this.holes.includes(this.state)) {
      reward = this.rewardConfig.holePenalty;
    }

    return { state: this.state, reward, done };
  }

  getTransitions(state, action) {
    if (!this.slippery) {
      const row = Math.floor(state / this.size);
      const col = state % this.size;
      let newRow = row, newCol = col;

      if (action === 0) newRow = Math.max(0, row - 1);
      else if (action === 1) newCol = Math.min(this.size - 1, col + 1);
      else if (action === 2) newRow = Math.min(this.size - 1, row + 1);
      else if (action === 3) newCol = Math.max(0, col - 1);

      const newState = newRow * this.size + newCol;
      const done = this.holes.includes(newState) || newState === this.goalState;
      let reward = this.rewardConfig.stepPenalty;
      
      if (newState === this.goalState) {
        reward = this.rewardConfig.goalReward;
      } else if (this.holes.includes(newState)) {
        reward = this.rewardConfig.holePenalty;
      }

      return [{ nextState: newState, prob: 1, reward, done }];
    } else {
      const transitions = [];
      transitions.push({ action, prob: 0.34 });
      transitions.push({ action: (action + 3) % 4, prob: 0.33 });
      transitions.push({ action: (action + 1) % 4, prob: 0.33 });
      
      const result = [];
      for (const t of transitions) {
        const row = Math.floor(state / this.size);
        const col = state % this.size;
        let newRow = row, newCol = col;

        if (t.action === 0) newRow = Math.max(0, row - 1);
        else if (t.action === 1) newCol = Math.min(this.size - 1, col + 1);
        else if (t.action === 2) newRow = Math.min(this.size - 1, row + 1);
        else if (t.action === 3) newCol = Math.max(0, col - 1);

        const newState = newRow * this.size + newCol;
        const done = this.holes.includes(newState) || newState === this.goalState;
        let reward = this.rewardConfig.stepPenalty;
        
        if (newState === this.goalState) {
          reward = this.rewardConfig.goalReward;
        } else if (this.holes.includes(newState)) {
          reward = this.rewardConfig.holePenalty;
        }

        const existing = result.find(r => r.nextState === newState && r.done === done && r.reward === reward);
        if (existing) {
          existing.prob += t.prob;
        } else {
          result.push({
            nextState: newState,
            prob: t.prob,
            reward,
            done
          });
        }
      }
      
      return result;
    }
  }

  getStateCoords(state) {
    return { row: Math.floor(state / this.size), col: state % this.size };
  }
}

export default FrozenLake;