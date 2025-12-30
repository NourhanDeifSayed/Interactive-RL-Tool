import React from 'react';

export class GridWorld {
  constructor(size = 5, rewardConfig = {}) {
    this.size = size;
    this.nStates = size * size;
    this.nActions = 4; // up, right, down, left
    this.goalState = size * size - 1;
    this.obstacles = [size + 1, size * 2 + 2];
    this.hasTransitionModel = true;
    this.rewardConfig = {
      goalReward: 10,
      stepPenalty: -0.1,
      obstaclePenalty: -1,
      ...rewardConfig
    };
    this.reset();
  }

  reset() {
    this.state = 0;
    return this.state;
  }

  step(action) {
    const row = Math.floor(this.state / this.size);
    const col = this.state % this.size;
    let newRow = row, newCol = col;

    if (action === 0) newRow = Math.max(0, row - 1); // up
    else if (action === 1) newCol = Math.min(this.size - 1, col + 1); // right
    else if (action === 2) newRow = Math.min(this.size - 1, row + 1); // down
    else if (action === 3) newCol = Math.max(0, col - 1); // left

    const newState = newRow * this.size + newCol;
    
    if (this.obstacles.includes(newState)) {
      return { state: this.state, reward: this.rewardConfig.obstaclePenalty, done: false };
    }

    this.state = newState;
    const done = this.state === this.goalState;
    const reward = done ? this.rewardConfig.goalReward : this.rewardConfig.stepPenalty;

    return { state: this.state, reward, done };
  }

  getTransitions(state, action) {
    const row = Math.floor(state / this.size);
    const col = state % this.size;
    let newRow = row, newCol = col;

    if (action === 0) newRow = Math.max(0, row - 1);
    else if (action === 1) newCol = Math.min(this.size - 1, col + 1);
    else if (action === 2) newRow = Math.min(this.size - 1, row + 1);
    else if (action === 3) newCol = Math.max(0, col - 1);

    const newState = newRow * this.size + newCol;
    
    if (this.obstacles.includes(newState)) {
      return [{
        nextState: state,
        prob: 1,
        reward: this.rewardConfig.obstaclePenalty,
        done: false
      }];
    }

    const done = newState === this.goalState;
    const reward = done ? this.rewardConfig.goalReward : this.rewardConfig.stepPenalty;

    return [{
      nextState: newState,
      prob: 1,
      reward,
      done
    }];
  }

  getStateCoords(state) {
    return { row: Math.floor(state / this.size), col: state % this.size };
  }
}

export default GridWorld;