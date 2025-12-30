import React from 'react';

export class MountainCar {
  constructor(rewardConfig = {}) {
    this.nStates = 100;
    this.nActions = 3;
    this.hasTransitionModel = false;
    this.rewardConfig = {
      goalReward: 0,
      stepPenalty: -1,
      maxSteps: 200,
      ...rewardConfig
    };
    this.reset();
  }

  reset() {
    this.position = -0.5;
    this.velocity = 0;
    this.steps = 0;
    return this.getState();
  }

  getState() {
    const posIdx = Math.min(9, Math.max(0, Math.floor((this.position + 1.2) / 1.8 * 10)));
    const velIdx = Math.min(9, Math.max(0, Math.floor((this.velocity + 0.07) / 0.14 * 10)));
    return posIdx * 10 + velIdx;
  }

  step(action) {
    const force = (action - 1) * 0.001;
    this.velocity += force - 0.0025 * Math.cos(3 * this.position);
    this.velocity = Math.max(-0.07, Math.min(0.07, this.velocity));
    this.position += this.velocity;
    this.position = Math.max(-1.2, Math.min(0.6, this.position));
    
    if (this.position <= -1.2) this.velocity = 0;
    
    this.steps++;
    const done = this.position >= 0.5 || this.steps >= this.rewardConfig.maxSteps;
    const reward = done && this.position >= 0.5 ? this.rewardConfig.goalReward : this.rewardConfig.stepPenalty;

    return { state: this.getState(), reward, done };
  }
}

export default MountainCar;